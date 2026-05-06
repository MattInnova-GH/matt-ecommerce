<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
   protected $fillable = [
        'ticket_number',
        'user_id',
        'status',
        'priority',
        'category',
        'title',
        'description',
        'order_number',
        'product_name',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function responses()
    {
        return $this->hasMany(TicketResponse::class, 'ticket_id');
    }
}
