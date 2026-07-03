<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name', 'logo', 'favicon', 'primary_color', 'secondary_color',
        'facebook', 'instagram', 'whatsapp', 'tiktok', 'email', 'phone', 'address',
    ];
}
