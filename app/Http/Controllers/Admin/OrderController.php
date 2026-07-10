<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusUpdated;
use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public const STATUS_NOTIFICATIONS = [
        'ACCEPTED' => 'Tu pedido :number de :product (S/ :total) fue aceptado y ya lo estamos preparando.',
        'REJECTED' => 'Tu pedido :number de :product (S/ :total) fue rechazado.',
        'SHIPPED' => 'Tu pedido :number de :product (S/ :total) ya fue enviado.',
        'DELIVERED' => 'Tu pedido :number de :product (S/ :total) fue entregado. ¡Gracias por tu compra!',
        'CANCELLED' => 'Tu pedido :number de :product (S/ :total) fue cancelado.',
    ];

    /**
     * Nombre de producto legible para mostrar en notificaciones al cliente
     * en vez del order_number (un código sin significado para el usuario).
     */
    private function productSummary(Order $order): string
    {
        $items = $order->items;

        if ($items->isEmpty()) {
            return $order->order_number;
        }

        $first = $items->first()->product_name;
        $remaining = $items->count() - 1;

        return $remaining > 0
            ? "{$first} y {$remaining} producto".($remaining > 1 ? 's' : '').' más'
            : $first;
    }

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

            try {
                Mail::to($order->user->email)->send(new OrderStatusUpdated($order));
            } catch (\Throwable $e) {
                Log::error('No se pudo enviar el correo de actualización de pedido', [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'error' => $e->getMessage(),
                ]);
            }

            // Notificación en la campanita para cualquier cambio de estado.
            if (isset(self::STATUS_NOTIFICATIONS[$order->status])) {
                Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'title' => 'Pedido '.strtolower(OrderStatusUpdated::STATUS_LABELS[$order->status] ?? $order->status),
                    'message' => strtr(self::STATUS_NOTIFICATIONS[$order->status], [
                        ':product' => $this->productSummary($order),
                        ':number' => $order->order_number,
                        ':total' => number_format((float) $order->total, 2),
                    ]),
                ]);
            }

            $needsRefund = in_array($order->status, ['REJECTED', 'CANCELLED'])
                && $order->payment
                && $order->payment->status === 'APPROVED'
                && ! $order->payment->refunded_at;

            if ($needsRefund) {
                Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'title' => 'Reembolso pendiente',
                    'message' => "Tu pedido de {$this->productSummary($order)} fue ".
                        ($order->status === 'CANCELLED' ? 'cancelado' : 'rechazado').
                        '. Ingresa tu número de Yape para procesar tu reembolso.',
                    'action' => 'refund_yape_phone',
                ]);
            }
        }

        return back();
    }
}
