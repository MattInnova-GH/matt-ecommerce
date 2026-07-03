<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'payment'])
            ->latest()
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total' => (float) $order->total,
                'subtotal' => (float) $order->subtotal,
                'tax' => (float) $order->tax,
                'rejection_reason' => $order->rejection_reason,
                'payment_method' => $order->payment?->method,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toISOString(),
                'updated_at' => $order->updated_at->toISOString(),
                'shipping_address' => $order->shipping_address,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_thumbnail' => $item->product?->thumbnail,
                    'quantity' => $item->quantity,
                    'product_price' => (float) $item->product_price,
                    'subtotal' => (float) $item->subtotal,
                ]),
            ]);

        return Inertia::render('Client/Profile/Orders/Orders', [
            'orders' => $orders,
        ]);
    }
}
