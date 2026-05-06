<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerRequest extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'business_name',
        'business_type',
        'address',
        'message',
        'tax_id',
        'phone',
        'experience',
        'documents',
    ];

    protected $casts = [
        'documents' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
