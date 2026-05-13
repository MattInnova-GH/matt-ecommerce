<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('order')->get();

        return Inertia::render('Admin/Banners/Banners', [
            'banners' => $banners,
        ]);
    }

    public function store(Request $request)
    {
        $totalBanners = Banner::count();

        if ($totalBanners >= 5) {
            return back()->withErrors(['limit' => 'Máximo 5 banners permitidos.']);
        }

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,avif|max:2048', // 2MB max
            'type' => 'required|in:main,promotional',
        ]);

        // Subir la imagen
        $imagePath = $request->file('image')->store('banners', 'public');

        $validated['image_path'] = $imagePath;
        $validated['order'] = Banner::max('order') + 1;

        // Si es tipo main, asegurar que solo haya uno
        if ($validated['type'] === 'main') {
            Banner::where('type', 'main')->update(['type' => 'promotional']);
        }

        Banner::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,avif|max:2048',
            'type' => 'required|in:main,promotional',
        ]);

        // Si se sube una nueva imagen
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior
            if ($banner->image_path && Storage::disk('public')->exists($banner->image_path)) {
                Storage::disk('public')->delete($banner->image_path);
            }
            // Subir nueva imagen
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        // Si se está cambiando a tipo main, reasignar el anterior
        if ($validated['type'] === 'main' && $banner->type !== 'main') {
            Banner::where('type', 'main')->update(['type' => 'promotional']);
        }

        $banner->update($validated);

        return redirect()->back();
    }

    public function destroy(Banner $banner)
    {
        $totalBanners = Banner::count();

        if ($totalBanners <= 2) {
            return back()->withErrors(['min' => 'Debe haber al menos 2 banners.']);
        }

        // Si estamos eliminando el banner principal, asignar otro como principal
        if ($banner->type === 'main') {
            $newMain = Banner::where('id', '!=', $banner->id)
                ->orderBy('order')
                ->first();
            if ($newMain) {
                $newMain->update(['type' => 'main']);
            }
        }

        // Eliminar la imagen física
        if ($banner->image_path && Storage::disk('public')->exists($banner->image_path)) {
            Storage::disk('public')->delete($banner->image_path);
        }

        $banner->delete();

        return redirect()->back();
    }

    public function toggleStatus(Banner $banner)
    {
        $banner->update(['is_active' => ! $banner->is_active]);

        return redirect()->back();
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer|exists:banners,id',
            'orders.*.order' => 'required|integer|min:1|max:5',
        ]);

        foreach ($request->orders as $item) {
            Banner::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return redirect()->back();
    }
}
