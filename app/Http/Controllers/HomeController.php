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

        $products = Product::where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'imageUrl' => $p->thumbnail ? Storage::url($p->thumbnail) : null,
            ]);

        $banners = Banner::where('is_active', true)->get();

        $reviews = Review::where('is_approved', true)
            ->with(['user'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->user->first_name.' '.$r->user->last_name,
                'comment' => $r->comment,
                'rating' => $r->rating,
                'avatar' => $r->user->avatar ? Storage::url($r->user->avatar) : null,
            ]);

        return Inertia::render('Client/Home', [
            'products' => $products,
            'categories' => $categories,
            'banners' => $banners,
            'reviews' => $reviews,
        ]);
    }
}
