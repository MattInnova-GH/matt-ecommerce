<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'method', 'amount', 'receipt_url', 'status',
        'yape_phone', 'yape_code', 'yape_mode',
        'refunded_at', 'refund_notes', 'refund_yape_phone', 'refund_proof_url',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refunded_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
