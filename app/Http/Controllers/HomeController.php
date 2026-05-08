<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'imageUrl' => $c->image,
                'productCount' => $c->products_count,
            ]);

        $products = Product::where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'imageUrl' => $p->thumbnail,
            ]);

        return Inertia::render('Client/Home', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
