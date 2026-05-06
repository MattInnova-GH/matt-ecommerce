<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'total',
        'shipping_address',
        'payment_method',
        'receipt_url',
        'payment_receipt_url',
        'delivery_method',
        'pickup_store',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
