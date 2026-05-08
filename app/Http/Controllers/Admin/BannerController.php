<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Banners/Banners', [
            'banners' => $banners
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|url|max:500',
            'link' => 'nullable|url|max:500',
            'is_active' => 'boolean',
        ]);

        Banner::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image_url' => 'required|url|max:500',
            'link' => 'nullable|url|max:500',
            'is_active' => 'boolean',
        ]);

        $banner->update($validated);

        return redirect()->back();
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        
        return redirect()->back();
    }

    public function toggleStatus(Banner $banner)
    {
        $banner->update(['is_active' => !$banner->is_active]);
        
        return redirect()->back();
    }
}