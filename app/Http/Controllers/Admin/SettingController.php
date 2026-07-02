<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::first();

        return Inertia::render('Admin/Settings/Settings', [
            'settings' => $settings ?? new Setting,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'favicon' => 'nullable|image|mimes:jpg,jpeg,png,svg,ico|max:1024',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
        ]);

        $setting = Setting::first();

        if (! $setting) {
            $setting = new Setting;
        }

        // Subir logo
        if ($request->hasFile('logo')) {
            if ($setting->logo && file_exists(public_path($setting->logo))) {
                unlink(public_path($setting->logo));
            }
            $path = $request->file('logo')->store('settings', 'public');
            $validated['logo'] = '/storage/'.$path;
        }

        // Subir favicon
        if ($request->hasFile('favicon')) {
            if ($setting->favicon && file_exists(public_path($setting->favicon))) {
                unlink(public_path($setting->favicon));
            }
            $path = $request->file('favicon')->store('settings', 'public');
            $validated['favicon'] = '/storage/'.$path;
        }

        $setting->fill($validated);
        $setting->save();

        return redirect()->back();
    }
}
