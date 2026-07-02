<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public const STATUS_LABELS = [
        'PENDING' => 'Pendiente',
        'ACCEPTED' => 'Aceptado',
        'REJECTED' => 'Rechazado',
        'SHIPPED' => 'Enviado',
        'DELIVERED' => 'Entregado',
        'CANCELLED' => 'Cancelado',
    ];

    public function __construct(public Order $order) {}

    public function build()
    {
        $statusLabel = self::STATUS_LABELS[$this->order->status] ?? $this->order->status;

        return $this->subject("Tu pedido {$this->order->order_number} está {$statusLabel}")
            ->view('emails.order-status-updated', [
                'statusLabel' => $statusLabel,
            ]);
    }
}
