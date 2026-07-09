<?php

namespace App\Mail;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewComplaintNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Complaint $complaint) {}

    public function build()
    {
        return $this->subject("Nuevo {$this->complaint->complaint_type} recibido — {$this->complaint->code}")
            ->view('emails.new-complaint-notification');
    }
}
