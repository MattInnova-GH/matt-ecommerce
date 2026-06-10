<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'discount_type', 'discount_value',
        'starts_at', 'ends_at', 'is_active', 'category_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'discount_value' => 'decimal:2',
        'starts_at' => 'date',
        'ends_at' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function isCurrentlyActive(): bool
    {
        $today = Carbon::today();
        return $this->is_active && $this->starts_at->lte($today) && $this->ends_at->gte($today);
    }

    public function applyDiscount(float $price): float
    {
        if ($this->discount_type === 'percentage') {
            return max(0, $price - ($price * $this->discount_value / 100));
        }
        return max(0, $price - (float) $this->discount_value);
    }

    public function getDiscountBadgeText(): string
    {
        if ($this->discount_type === 'percentage') {
            return '-' . $this->discount_value . '%';
        }
        return '-S/' . number_format($this->discount_value, 2);
    }

    public function scopeActive($query)
    {
        $today = Carbon::today()->toDateString();
        return $query->where('is_active', true)
            ->where('starts_at', '<=', $today)
            ->where('ends_at', '>=', $today);
    }
}