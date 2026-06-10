<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Categorías activas con conteo de productos
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'imageUrl' => $c->image ? Storage::url($c->image) : null,
                'productCount' => $c->products_count,
            ]);

        // ✅ NUEVO: Promociones activas con datos de categoría
        $activePromotions = \App\Models\Promotion::active()
            ->with('category')
            ->get()
            ->map(fn ($promo) => [
                'id' => $promo->id,
                'name' => $promo->name,
                'description' => $promo->description,
                'discount_type' => $promo->discount_type,
                'discount_value' => (float) $promo->discount_value,
                'discount_badge' => $promo->getDiscountBadgeText(),
                'starts_at' => $promo->starts_at->format('Y-m-d'),
                'ends_at' => $promo->ends_at->format('Y-m-d'),
                'category' => $promo->category ? [
                    'id' => $promo->category->id,
                    'name' => $promo->category->name,
                    'slug' => $promo->category->slug,
                    'imageUrl' => $promo->category->image ? Storage::url($promo->category->image) : null,
                ] : null,
            ]);

        // Productos destacados (con descuento incluido)
        $products = Product::where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'final_price' => $p->final_price,
                'has_discount' => $p->has_discount,
                'discount_badge' => $p->discount_badge,
                'imageUrl' => $p->thumbnail ? Storage::url($p->thumbnail) : null,
                'slug' => $p->slug,
            ]);

        $banners = Banner::where('is_active', true)->get();

        $reviews = Review::where('is_approved', true)
            ->with(['user'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->user->first_name . ' ' . $r->user->last_name,
                'comment' => $r->comment,
                'rating' => $r->rating,
                'avatar' => $r->user->avatar ? Storage::url($r->user->avatar) : null,
            ]);

        return Inertia::render('Client/Home', [
            'products' => $products,
            'categories' => $categories,
            'activePromotions' => $activePromotions, // ✅ Enviamos las promociones
            'banners' => $banners,
            'reviews' => $reviews,
        ]);
    }
}