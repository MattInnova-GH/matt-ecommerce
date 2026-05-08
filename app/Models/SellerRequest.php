<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerRequest extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'address',
        'tax_id',
        'phone',
        'experience',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
