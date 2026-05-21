<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'method', 'amount', 'receipt_url', 'status',
        'yape_phone', 'yape_code', 'yape_mode',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
