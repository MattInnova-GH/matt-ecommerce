<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RefundProcessed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Payment $payment) {}

    public function build()
    {
        return $this->subject("Tu reembolso del pedido {$this->payment->order->order_number} fue procesado")
            ->view('emails.refund-processed');
    }
}
