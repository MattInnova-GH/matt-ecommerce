<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = [
        'code', 'first_name', 'last_name', 'document_number', 'phone',
        'email', 'address', 'asset_type', 'asset_description',
        'claimed_amount', 'complaint_type', 'problem_description',
        'consumer_request', 'status',
    ];

    protected $casts = [
        'claimed_amount' => 'decimal:2',
    ];
}
