<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $favorites = $user->favorites()
            ->with(['category'])
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'category' => $product->category->name ?? 'N/A',
                'imageUrl' => $product->thumbnail ? (str_starts_with($product->thumbnail, 'http') ? $product->thumbnail : '/storage/'.$product->thumbnail) : null,
            ]);

        return Inertia::render('Client/UserFavoriteClient', [
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
