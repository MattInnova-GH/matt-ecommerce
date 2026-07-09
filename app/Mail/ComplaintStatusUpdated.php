<?php

namespace App\Mail;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ComplaintStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public const STATUS_LABELS = [
        'pendiente' => 'Pendiente',
        'en_proceso' => 'En proceso',
        'resuelto' => 'Resuelto',
    ];

    public function __construct(public Complaint $complaint) {}

    public function build()
    {
        $statusLabel = self::STATUS_LABELS[$this->complaint->status] ?? $this->complaint->status;

        return $this->subject("Actualización de tu {$this->complaint->complaint_type} {$this->complaint->code}: {$statusLabel}")
            ->view('emails.complaint-status-updated', [
                'statusLabel' => $statusLabel,
            ]);
    }
}
