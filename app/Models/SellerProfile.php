<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'store_name',
        'description',
        'logo',
        'cover_image',
        'email',
        'phone',
        'address',
        'website',
        'social_media',
        'business_hours',
    ];

    protected $casts = [
        'social_media' => 'array',
        'business_hours' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
