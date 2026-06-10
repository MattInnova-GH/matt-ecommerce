<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::with('category:id,name')
            ->latest()
            ->paginate(15)
            ->through(fn (Promotion $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'discount_type' => $p->discount_type,
                'discount_value' => (float) $p->discount_value,
                'starts_at' => $p->starts_at?->format('Y-m-d'),
                'ends_at' => $p->ends_at?->format('Y-m-d'),
                'is_active' => $p->is_active,
                'is_currently_active' => $p->isCurrentlyActive(),
                'category' => $p->category,
            ]);

        return Inertia::render('Admin/Promotions/Promotions', [
            'promotions' => $promotions,
            'categories' => Category::select('id', 'name')->where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Promotion::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$counter++;
        }

        $validated['slug'] = $slug;
        $validated['is_active'] = $request->boolean('is_active', true);

        Promotion::create($validated);

        return redirect()->back()->with('success', 'Promoción creada correctamente.');
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        if ($validated['name'] !== $promotion->name) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            while (Promotion::where('slug', $slug)->where('id', '!=', $promotion->id)->exists()) {
                $slug = $originalSlug.'-'.$counter++;
            }
            $validated['slug'] = $slug;
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        $promotion->update($validated);

        return redirect()->back()->with('success', 'Promoción actualizada correctamente.');
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return redirect()->back()->with('success', 'Promoción eliminada correctamente.');
    }

    public function toggleStatus(Promotion $promotion)
    {
        $promotion->update(['is_active' => ! $promotion->is_active]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente.');
    }
}
