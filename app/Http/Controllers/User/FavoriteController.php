<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    // LISTAR FAVORITOS
    public function index()
    {
        $user = auth()->user();

        $favorites = $user->favorites()
            ->with('category')
            ->latest('favorites.created_at')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'category' => $product->category?->name,
                    'imageUrl' => $product->image_url,
                    'colors' => $product->colors ?? [],
                    'favoritedAt' => $product->pivot->created_at,
                ];
            });

        return Inertia::render('Favorites/UserFavoriteClient', [
            'favorites' => $favorites,
        ]);
    }

    // TOGGLE FAVORITO (agregar / quitar)
    public function toggle($productId)
    {
        $user = auth()->user();

        if ($user->favorites()->where('product_id', $productId)->exists()) {
            $user->favorites()->detach($productId);

            return back()->with('success', 'Eliminado de favoritos');
        }

        $user->favorites()->attach($productId);

        return back()->with('success', 'Agregado a favoritos');
    }

    // ELIMINAR UNO
    public function destroy($productId)
    {
        auth()->user()
            ->favorites()
            ->detach($productId);

        return back()->with('success', 'Eliminado');
    }

    // ELIMINAR MASIVO
    public function destroyMany(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        auth()->user()
            ->favorites()
            ->detach($request->ids);

        return back()->with('success', 'Eliminados');
    }
}