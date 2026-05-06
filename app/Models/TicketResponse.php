<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketResponse extends Model
{
    protected $fillable = [
        'ticket_id',
        'message',
        'is_admin',
        'attachments',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'attachments' => 'array',
    ];

    public function ticket()
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }
}
