<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        return Inertia::render('Client/Checkout');
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'paymentMethod' => 'required|string|in:transfer,yape',
            'voucher' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'deliveryMethod' => 'required|string|in:delivery,pickup',
            'deliveryAddress' => 'nullable|array',
            'selectedStore' => 'nullable|array',
            'yapePhone' => 'nullable|string',
            'yapeCode' => 'nullable|string',
            'yapeMode' => 'nullable|string|in:code,qr',
        ]);

        if ($request->deliveryMethod === 'delivery' && empty($request->deliveryAddress)) {
            return back()->withErrors(['deliveryAddress' => 'La dirección de entrega es obligatoria para envíos a domicilio.']);
        }
        if ($request->deliveryMethod === 'pickup' && empty($request->selectedStore)) {
            return back()->withErrors(['selectedStore' => 'Debes seleccionar una tienda para el recojo.']);
        }

        $notes = "Método de pago: {$request->paymentMethod}";
        if ($request->deliveryMethod === 'pickup' && $request->selectedStore) {
            $notes .= ' | Recojo en tienda: '.($request->selectedStore['name'] ?? 'N/A');
        }

        $receiptUrl = null;
        if ($request->hasFile('voucher')) {
            $receiptUrl = $request->file('voucher')->store('vouchers', 'public');
        }

        try {
            $order = DB::transaction(function () use ($request, $notes, $receiptUrl) {
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'order_number' => 'ORD-'.strtoupper(uniqid()),
                    'subtotal' => $request->total,
                    'tax' => 0,
                    'total' => $request->total,
                    'status' => 'PENDING',
                    'shipping_address' => $request->deliveryMethod === 'delivery' ? $request->deliveryAddress : null,
                    'notes' => $notes,
                ]);

                foreach ($request->items as $item) {
                    $product = Product::whereKey($item['id'])->lockForUpdate()->first();

                    if (! $product) {
                        throw new \RuntimeException("El producto \"{$item['name']}\" ya no está disponible.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \RuntimeException("No hay suficiente stock de \"{$item['name']}\".");
                    }

                    $order->items()->create([
                        'product_id' => $item['id'],
                        'product_name' => $item['name'],
                        'product_price' => $item['price'],
                        'quantity' => $item['quantity'],
                        'subtotal' => (float) $item['price'] * $item['quantity'],
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                $order->payment()->create([
                    'method' => $request->paymentMethod,
                    'amount' => $request->total,
                    'receipt_url' => $receiptUrl,
                    'status' => 'PENDING',
                    'yape_phone' => $request->yapePhone,
                    'yape_code' => $request->yapeCode,
                    'yape_mode' => $request->yapeMode,
                ]);

                return $order;
            });
        } catch (\RuntimeException $e) {
            return back()->withErrors(['items' => $e->getMessage()]);
        }

        $order->load(['items', 'payment', 'user']);
        Mail::to($order->user->email)->send(new OrderConfirmation($order));

        return redirect()->route('home')->with('success', '¡Gracias por tu compra! Tu pedido está pendiente de verificación de pago. Te enviamos un correo con el detalle de tu compra.');
    }
}
