<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name', 'logo', 'favicon', 'primary_color', 'secondary_color',
        'facebook', 'instagram', 'whatsapp', 'tiktok', 'email', 'phone', 'address',
        'yape_qr', 'yape_number',
        'bank_name', 'bank_account_number', 'bank_cci', 'bank_holder', 'bank_currency',
    ];
}
