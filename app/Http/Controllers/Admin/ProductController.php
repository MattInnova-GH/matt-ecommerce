<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
   public function index()
    {
        $products = Product::with(['category:id,name', 'brand:id,name', 'supplier:id,name'])
            ->latest()
            ->paginate(15)
            ->through(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'slug'        => $p->slug,
                'sku'         => $p->sku,
                'price'       => (float) $p->price,
                'stock'       => $p->stock,
                'thumbnail'   => $p->thumbnail,
                'is_active'   => $p->is_active,
                'is_featured' => $p->is_featured,
                'category_id' => $p->category_id,
                'brand_id'    => $p->brand_id,
                'supplier_id' => $p->supplier_id,
                'category'    => $p->category,
                'brand'       => $p->brand,
                'supplier'    => $p->supplier,
            ]);

        return Inertia::render('Admin/Products/Products', [
            'products'   => $products,
            'categories' => Category::select('id', 'name')->where('is_active', true)->get(),
            'brands'     => Brand::select('id', 'name')->get(),
            'suppliers'  => Supplier::select('id', 'name')->get(),
        ]);
    }


    public function create()
    {   
        $categories = Category::select('id', 'name')->where('is_active', true)->get();
        $brands = Brand::select('id', 'name')->get();
        $suppliers = Supplier::select('id', 'name')->get();

        return Inertia::render('Admin/Products/CreateProduct', [
            'categories' => $categories,
            'brands'     => $brands,
            'suppliers'  => $suppliers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'sku'         => ['required', 'string', 'max:100', 'unique:products,sku'],
            'price'       => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id'    => ['nullable', 'exists:brands,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'is_active'   => ['nullable'],
            'is_featured' => ['nullable'],
            'thumbnail'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $validated['slug']        = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $validated['is_active']   = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);
        $validated['is_featured'] = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()->back()->with('success', 'Producto creado correctamente.');
    }


    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/EditProduct', [
            'product'     => $product,
            'categories'  => Category::select('id', 'name')->where('is_active', true)->get(),
            'brands'      => Brand::select('id', 'name')->get(),
            'suppliers'   => Supplier::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', 'unique:products,slug,' . $product->id],
            'description' => ['nullable', 'string'],
            'sku'         => ['required', 'string', 'max:100', 'unique:products,sku,' . $product->id],
            'price'       => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id'    => ['nullable', 'exists:brands,id'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'is_active'   => ['nullable'],
            'is_featured' => ['nullable'],
            'thumbnail'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ]);

        $validated['slug']        = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $validated['is_active']   = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);
        $validated['is_featured'] = filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN);

        if ($request->hasFile('thumbnail')) {
            if ($product->thumbnail) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('products', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $product->update($validated);

        return redirect()->back()->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Product $product)
    {
        if ($product->thumbnail) {
            Storage::disk('public')->delete($product->thumbnail);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Producto eliminado correctamente.');
    }

    public function toggleStatus(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function toggleFeatured(Product $product)
    {
        $product->update(['is_featured' => !$product->is_featured]);

        return redirect()->back()->with('success', 'Destacado actualizado.');
    }
}
