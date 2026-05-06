<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)
            ->where('is_approved', true)
            ->with(['category']);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->latest()->get()->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float)$product->price,
            'stock' => $product->stock,
            'imageUrl' => $product->image_url,
            'category' => $product->category->name,
            'categorySlug' => $product->category->slug,
        ]);

        $categories = Category::where('is_active', true)
            ->withCount(['products' => function($q) {
                $q->where('is_active', true)->where('is_approved', true);
            }])
            ->get()
            ->map(fn($category) => [
                'id' => $category->slug,
                'name' => $category->name,
                'productCount' => $category->products_count,
            ]);

        return Inertia::render('User/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->where('is_approved', true)
            ->with(['category', 'seller.sellerProfile', 'variants', 'reviews.user'])
            ->firstOrFail();

        return Inertia::render('User/Products/Show', [
            'product' => $product,
        ]);
    }
}
