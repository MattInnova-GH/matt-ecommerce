<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('is_active', true)
            ->where('is_approved', true)
            ->where('stock', '>', 0)
            ->with(['category', 'variants'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'imageUrl' => $product->image_url,
                'category' => $product->category->name,
                'stock' => $product->stock,
                'colors' => $product->variants->where('type', 'color')->pluck('value'),
                'sizes' => $product->variants->where('type', 'size')->pluck('value'),
            ]);

        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($q) {
                $q->where('is_active', true)->where('is_approved', true)->where('stock', '>', 0);
            }])
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'imageUrl' => $cat->image_url,
                'productCount' => $cat->products_count,
            ]);

        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        if (! $query) {
            return response()->json(['products' => []]);
        }

        $products = Product::where('is_active', true)
            ->where('is_approved', true)
            ->where('stock', '>', 0)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->with(['category'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'imageUrl' => $product->image_url,
                'category' => $product->category->name,
            ]);

        return response()->json([
            'products' => $products,
        ]);
    }
}
