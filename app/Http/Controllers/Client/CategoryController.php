<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image,
                'products_count' => $category->products_count,
                'children' => [], // Sin subcategorías por ahora
            ]);

        return Inertia::render('Client/Category', [
            'categories' => $categories,
        ]);
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Obtener productos de esta categoría
        $products = Product::with(['category', 'images'])
            ->where('category_id', $category->id)
            ->where('is_active', true)
            ->latest()
            ->paginate(12)
            ->through(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'thumbnail' => $product->thumbnail,
                'is_featured' => $product->is_featured,
                'category' => $product->category ? ['name' => $product->category->name] : null,
            ]);

        return Inertia::render('Client/CategoryProducts', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image,
            ],
            'subcategories' => [], // Sin subcategorías por ahora
            'products' => $products,
        ]);
    }
}
