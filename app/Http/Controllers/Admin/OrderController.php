<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusUpdated;
use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Orders/Orders', [
            'orders' => $orders,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDING,ACCEPTED,REJECTED,SHIPPED,DELIVERED,CANCELLED',
            'rejection_reason' => 'required_if:status,REJECTED,CANCELLED|nullable|string|max:1000',
        ]);

        $statusChanged = $order->status !== $validated['status'];

        if (! in_array($validated['status'], ['REJECTED', 'CANCELLED'])) {
            $validated['rejection_reason'] = null;
        }

        $order->update($validated);

        if ($statusChanged) {
            $order->load(['items', 'user', 'payment']);
            Mail::to($order->user->email)->send(new OrderStatusUpdated($order));

            $needsRefund = in_array($order->status, ['REJECTED', 'CANCELLED'])
                && $order->payment
                && $order->payment->status === 'APPROVED'
                && ! $order->payment->refunded_at;

            if ($needsRefund) {
                Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'title' => 'Reembolso pendiente',
                    'message' => "Tu pedido {$order->order_number} fue ".
                        ($order->status === 'CANCELLED' ? 'cancelado' : 'rechazado').
                        '. Ingresa tu número de Yape para procesar tu reembolso.',
                    'action' => 'refund_yape_phone',
                ]);
            }
        }

        return back();
    }
}
