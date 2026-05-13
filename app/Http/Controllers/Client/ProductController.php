<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'brand', 'images'])
            ->where('is_active', true);

        // Búsqueda por nombre
        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        // Filtro por categoría
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filtro por marca
        if ($request->filled('brand')) {
            $query->where('brand_id', $request->brand);
        }

        // Filtro por precio mínimo
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }

        // Filtro por precio máximo
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        // Ordenamiento
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'latest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(12)->through(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => $product->price,
            'stock' => $product->stock,
            'category' => $product->category->name ?? 'General',
            'imageUrl' => $product->thumbnail ? (str_starts_with($product->thumbnail, 'http') ? $product->thumbnail : '/storage/'.$product->thumbnail) : null,
            'is_favorited' => auth()->check() ? $product->favoritedBy()->where('user_id', auth()->id())->exists() : false,
        ]);

        // Obtener categorías activas para filtros
        $categories = Category::where('is_active', true)->get();

        // Obtener marcas
        $brands = Brand::all();

        // Calcular rango de precios
        $minProductPrice = Product::where('is_active', true)->min('price') ?? 0;
        $maxProductPrice = Product::where('is_active', true)->max('price') ?? 1000;

        return Inertia::render('Client/Product', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'search' => $request->input('search'),
                'category' => $request->input('category'),
                'brand' => $request->input('brand'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $sort,
            ],
            'priceRange' => [
                'min' => (int) $minProductPrice,
                'max' => (int) $maxProductPrice,
            ],
        ]);
    }

    public function show($slug)
    {
        $product = Product::with([
            'category',
            'brand',
            'images',
            'variants',
            'reviews' => function ($query) {
                $query->where('is_approved', true)
                    ->with('user')
                    ->orderBy('created_at', 'desc');
            },
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Mapear reviews para incluir nombre y avatar formateados
        $product->setRelation('reviews', $product->reviews->map(function ($review) {
            $review->user = (object) [
                'id' => $review->user->id,
                'name' => $review->user->first_name.' '.$review->user->last_name,
                'avatar' => $review->user->avatar,
            ];

            return $review;
        }));

        // Calcular promedio de calificaciones basado solo en aprobadas
        $averageRating = $product->reviews->avg('rating') ?? 0;
        $totalReviews = $product->reviews->count();

        // Productos relacionados (misma categoría, excluyendo el actual)
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with('images')
            ->limit(4)
            ->get();

        $product->is_favorited = auth()->check() ? $product->favoritedBy()->where('user_id', auth()->id())->exists() : false;

        // Verificar si el usuario puede comentar
        $canReview = false;
        if (auth()->check()) {
            $canReview = Order::where('user_id', auth()->id())
                ->whereIn('status', ['ACCEPTED', 'SHIPPED', 'DELIVERED'])
                ->whereHas('items', function ($query) use ($product) {
                    $query->where('product_id', $product->id);
                })
                ->exists();

            // Opcional: Evitar múltiples reseñas del mismo usuario para el mismo producto
            $hasAlreadyReviewed = Review::where('user_id', auth()->id())
                ->where('product_id', $product->id)
                ->exists();

            if ($hasAlreadyReviewed) {
                $canReview = false;
            }
        }

        return Inertia::render('Client/ProductDetail', [
            'product' => $product,
            'averageRating' => round($averageRating, 1),
            'totalReviews' => $totalReviews,
            'relatedProducts' => $relatedProducts,
            'canReview' => $canReview,
        ]);
    }
}
