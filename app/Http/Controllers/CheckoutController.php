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
    /**
     * Costo de envio a domicilio. Debe coincidir con DELIVERY_COST en
     * resources/js/Components/User/Checkout/utils/checkout.utils.ts.
     */
    private const DELIVERY_COST = 15.00;

    public function index()
    {
        return Inertia::render('Client/Checkout');
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'paymentMethod' => 'required|string|in:transfer,yape',
            'voucher' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'deliveryMethod' => 'required|string|in:delivery,pickup',
            'deliveryAddress' => 'nullable|array',
            'deliveryAddress.address' => 'required_if:deliveryMethod,delivery|string|max:500',
            'deliveryAddress.district' => 'required_if:deliveryMethod,delivery|string|max:255',
            'deliveryAddress.postalCode' => 'required_if:deliveryMethod,delivery|string|max:10',
            'deliveryAddress.recipientName' => 'required_if:deliveryMethod,delivery|string|max:255',
            'deliveryAddress.phone' => 'required_if:deliveryMethod,delivery|string|max:20',
            'deliveryAddress.reference' => 'nullable|string|max:500',
            'selectedStore' => 'nullable|array',
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

        // El subtotal y el envio se calculan aqui (no se confia en el total
        // que manda el navegador) para que la orden guarde el monto real.
        $subtotal = collect($request->items)
            ->sum(fn ($item) => (float) $item['price'] * (int) $item['quantity']);
        $shippingCost = $request->deliveryMethod === 'delivery' ? self::DELIVERY_COST : 0.0;
        $total = $subtotal + $shippingCost;

        try {
            $order = DB::transaction(function () use ($request, $notes, $receiptUrl, $subtotal, $shippingCost, $total) {
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'order_number' => 'ORD-'.strtoupper(uniqid()),
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'tax' => 0,
                    'total' => $total,
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
                    'amount' => $total,
                    'receipt_url' => $receiptUrl,
                    'status' => 'PENDING',
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
