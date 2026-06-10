<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'image', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

    public function activePromotion(): ?Promotion
    {
        return $this->promotions()->active()->first();
    }
}