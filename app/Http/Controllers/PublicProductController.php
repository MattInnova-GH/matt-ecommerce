<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if ($query && strlen($query) >= 2) {
            $products = Product::with('category')
                ->where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%")
                        ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$query}%")
                        );
                })
                ->orderBy('is_featured', 'desc')
                ->limit(10)
                ->get()
                ->map(fn ($p) => $this->formatProduct($p));

            return response()->json(['products' => $products]);
        }

        // Carga inicial
        $products = Product::with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        $categories = Category::withCount(['products' => fn ($q) => $q->where('is_active', true),
        ])
            ->where('is_active', true)
            ->orderBy('products_count', 'desc')
            ->limit(8)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'imageUrl' => $c->image ? asset('storage/'.$c->image) : null,
                'productCount' => $c->products_count,
            ]);

        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    private function formatProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'imageUrl' => $product->thumbnail
                            ? asset('storage/'.$product->thumbnail)
                            : null,
            'category' => $product->category?->name,
        ];
    }
}
