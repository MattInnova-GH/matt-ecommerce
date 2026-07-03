<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Marca una notificación como leída (sin realizar ninguna acción sobre ella).
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['is_read' => true]);

        return back();
    }

    /**
     * El cliente registra su número de Yape para recibir el reembolso de un
     * pedido rechazado/cancelado. El dinero se devuelve manualmente fuera del
     * sistema; esto solo deja el número disponible para el administrador.
     */
    public function submitRefundYapePhone(Request $request, Notification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        abort_unless($notification->action === 'refund_yape_phone', 404);

        $validated = $request->validate([
            'yape_phone' => 'required|string|regex:/^9[0-9]{8}$/',
        ]);

        $order = $notification->order()->with('payment')->first();

        abort_unless($order && $order->payment, 404);
        abort_unless(in_array($order->status, ['REJECTED', 'CANCELLED']), 422);
        abort_unless($order->payment->status === 'APPROVED', 422);
        abort_if($order->payment->refunded_at, 422, 'Este pedido ya fue reembolsado.');

        $order->payment->update(['refund_yape_phone' => $validated['yape_phone']]);
        $notification->update(['is_read' => true]);

        return back()->with('success', 'Tu número de Yape fue registrado. Procesaremos tu reembolso pronto.');
    }
}
