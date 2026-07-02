<?php

namespace App\Mail;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ComplaintReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Complaint $complaint) {}

    public function build()
    {
        return $this->subject("Hemos recibido tu {$this->complaint->complaint_type} — {$this->complaint->code}")
            ->view('emails.complaint-received');
    }
}
