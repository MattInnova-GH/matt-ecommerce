<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category:id,name', 'brand:id,name', 'images', 'variants'])
            ->latest()
            ->paginate(15)
            ->through(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->price,
                'stock' => $p->stock,
                'thumbnail' => $p->thumbnail,
                'is_active' => $p->is_active,
                'is_featured' => $p->is_featured,
                'category' => $p->category,
                'brand' => $p->brand,
                'images_count' => $p->images->count(),
                'variants_count' => $p->variants->count(),
            ]);

        return Inertia::render('Admin/Products/Products', [
            'products' => $products,
            'categories' => Category::select('id', 'name')->where('is_active', true)->get(),
            'brands' => Brand::select('id', 'name')->get(),
        ]);
    }

    public function create()
    {
        $categories = Category::select('id', 'name')->where('is_active', true)->get();
        $brands = Brand::select('id', 'name')->get();

        return Inertia::render('Admin/Products/CreateProduct', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'gallery.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['nullable', 'string', 'max:255'],
            'variants.*.value' => ['nullable', 'string', 'max:255'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
        ]);

        // Generar slug si no viene
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        // Asegurar que el slug sea único
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug.'-'.$counter++;
        }

        // Convertir booleanos
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['is_featured'] = $request->boolean('is_featured', false);

        return DB::transaction(function () use ($request, $validated) {
            // Subir thumbnail
            if ($request->hasFile('thumbnail')) {
                $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
            }

            $product = Product::create($validated);

            // Subir galería
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $image) {
                    $path = $image->store('products/gallery', 'public');
                    $product->images()->create(['image_url' => $path]);
                }
            }

            // Guardar variantes
            if (! empty($validated['variants'])) {
                foreach ($validated['variants'] as $variant) {
                    if (! empty($variant['name']) && ! empty($variant['value'])) {
                        $product->variants()->create([
                            'name' => $variant['name'],
                            'value' => $variant['value'],
                            'stock' => $variant['stock'] ?? 0,
                            'price' => isset($variant['price']) && $variant['price'] !== '' ? $variant['price'] : null,
                        ]);
                    }
                }
            }

            return redirect()->route('admin.products.index')->with('success', 'Producto creado correctamente.');
        });
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/EditProduct', [
            'product' => $product->load(['images', 'variants']),
            'categories' => Category::select('id', 'name')->where('is_active', true)->get(),
            'brands' => Brand::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug,'.$product->id],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'gallery.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'variants' => ['nullable', 'array'],
            'variants.*.name' => ['nullable', 'string', 'max:255'],
            'variants.*.value' => ['nullable', 'string', 'max:255'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'deleted_images' => ['nullable', 'array'],
            'deleted_images.*' => ['integer', 'exists:product_images,id'],
        ]);

        // Generar slug si no viene
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            // Asegurar slug único (por si acaso)
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
                $validated['slug'] = $originalSlug.'-'.$counter++;
            }
        }

        // Convertir booleanos
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['is_featured'] = $request->boolean('is_featured', false);

        return DB::transaction(function () use ($request, $validated, $product) {
            // Actualizar thumbnail - CORREGIDO
            if ($request->hasFile('thumbnail')) {
                if ($product->thumbnail) {
                    Storage::disk('public')->delete($product->thumbnail);
                }
                $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
            } else {
                // No sobrescribir la thumbnail existente
                unset($validated['thumbnail']);
            }

            $product->update($validated);

            // Eliminar imágenes marcadas
            if (! empty($validated['deleted_images'])) {
                $imagesToDelete = $product->images()->whereIn('id', $validated['deleted_images'])->get();
                foreach ($imagesToDelete as $img) {
                    Storage::disk('public')->delete($img->image_url);
                    $img->delete();
                }
            }

            // Agregar nuevas imágenes
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $image) {
                    $path = $image->store('products/gallery', 'public');
                    $product->images()->create(['image_url' => $path]);
                }
            }

            // Actualizar variantes (reemplazar todas)
            if (isset($validated['variants'])) {
                $product->variants()->delete();
                foreach ($validated['variants'] as $variant) {
                    if (! empty($variant['name']) && ! empty($variant['value'])) {
                        $product->variants()->create([
                            'name' => $variant['name'],
                            'value' => $variant['value'],
                            'stock' => $variant['stock'] ?? 0,
                            'price' => isset($variant['price']) && $variant['price'] !== '' ? $variant['price'] : null,
                        ]);
                    }
                }
            }

            return redirect()->route('admin.products.index')->with('success', 'Producto actualizado correctamente.');
        });
    }

    public function destroy(Product $product)
    {
        return DB::transaction(function () use ($product) {
            // Eliminar thumbnail
            if ($product->thumbnail) {
                Storage::disk('public')->delete($product->thumbnail);
            }

            // Eliminar imágenes de galería
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_url);
            }

            // Eliminar producto (las variantes se eliminan por cascade)
            $product->delete();

            return redirect()->back()->with('success', 'Producto eliminado correctamente.');
        });
    }

    public function toggleStatus(Product $product)
    {
        $product->update(['is_active' => ! $product->is_active]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }

    public function toggleFeatured(Product $product)
    {
        $product->update(['is_featured' => ! $product->is_featured]);

        return redirect()->back()->with('success', 'Producto destacado actualizado correctamente.');
    }
}
