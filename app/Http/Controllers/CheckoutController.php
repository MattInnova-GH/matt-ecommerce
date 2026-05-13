<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Client/Checkout');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total' => 'required|numeric',
            'paymentMethod' => 'required|string',
            'voucher' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'deliveryMethod' => 'required|string|in:delivery,pickup',
            'deliveryAddress' => 'nullable|array',
            'selectedStore' => 'nullable|array',
        ]);

        // Validación manual extra para mayor claridad
        if ($request->deliveryMethod === 'delivery' && empty($request->deliveryAddress)) {
            return back()->withErrors(['deliveryAddress' => 'La dirección de entrega es obligatoria para envíos a domicilio.']);
        }
        if ($request->deliveryMethod === 'pickup' && empty($request->selectedStore)) {
            return back()->withErrors(['selectedStore' => 'Debes seleccionar una tienda para el recojo.']);
        }

        $notes = "Metodo: {$request->paymentMethod}";
        if ($request->deliveryMethod === 'pickup' && $request->selectedStore) {
            $notes .= ' | Recojo en tienda: '.($request->selectedStore['name'] ?? 'N/A');
        }

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
            $order->items()->create([
                'product_id' => $item['id'],
                'product_name' => $item['name'],
                'product_price' => $item['price'],
                'quantity' => $item['quantity'],
                'subtotal' => (float) $item['price'] * $item['quantity'],
            ]);
        }

        $receiptUrl = null;
        if ($request->hasFile('voucher')) {
            $receiptUrl = $request->file('voucher')->store('vouchers', 'public');
        }

        $order->payment()->create([
            'method' => $request->paymentMethod,
            'amount' => $request->total,
            'receipt_url' => $receiptUrl,
            'status' => 'PENDING',
        ]);

        return redirect()->route('home')->with('success', '¡Gracias por tu compra! Tu pedido ha sido procesado y está pendiente de verificación de pago.');
    }
}
