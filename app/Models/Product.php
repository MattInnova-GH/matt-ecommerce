<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'stock', 'thumbnail', 
        'is_active', 'is_featured', 'category_id', 'brand_id', 'supplier_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Obtiene la promoción activa del producto (hereda de su categoría)
     */
    public function getActivePromotionAttribute(): ?Promotion
    {
        return $this->category?->activePromotion();
    }

    /**
     * Precio final con descuento aplicado si hay promoción activa
     */
    public function getFinalPriceAttribute(): float
    {
        $promotion = $this->active_promotion;
        if ($promotion && $promotion->isCurrentlyActive()) {
            return $promotion->applyDiscount($this->price);
        }
        return (float) $this->price;
    }

    /**
     * Obtiene el badge de descuento para mostrar
     */
    public function getDiscountBadgeAttribute(): ?string
    {
        $promotion = $this->active_promotion;
        if ($promotion && $promotion->isCurrentlyActive()) {
            return $promotion->getDiscountBadgeText();
        }
        return null;
    }

    /**
     * Indica si el producto tiene descuento activo
     */
    public function getHasDiscountAttribute(): bool
    {
        return $this->final_price < $this->price;
    }
}