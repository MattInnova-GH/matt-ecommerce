<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->take(6)
            ->get()
            ->map(fn($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'imageUrl' => $category->image_url,
                'productCount' => $category->products_count,
            ]);

        $products = Product::where('is_active', true)
            ->where('is_approved', true)
            ->latest()
            ->take(12)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'imageUrl' => $product->image_url,
            ]);

        return Inertia::render('User/Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
