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
            'remove_logo' => 'nullable|boolean',
            'remove_favicon' => 'nullable|boolean',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'yape_qr' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'remove_yape_qr' => 'nullable|boolean',
            'yape_number' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_cci' => 'nullable|string|max:50',
            'bank_holder' => 'nullable|string|max:255',
            'bank_currency' => 'nullable|string|max:50',
        ]);

        unset($validated['remove_logo'], $validated['remove_favicon'], $validated['remove_yape_qr']);

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
        } elseif ($request->boolean('remove_logo')) {
            if ($setting->logo && file_exists(public_path($setting->logo))) {
                unlink(public_path($setting->logo));
            }
            $validated['logo'] = null;
        }

        // Subir favicon
        if ($request->hasFile('favicon')) {
            if ($setting->favicon && file_exists(public_path($setting->favicon))) {
                unlink(public_path($setting->favicon));
            }
            $path = $request->file('favicon')->store('settings', 'public');
            $validated['favicon'] = '/storage/'.$path;
        } elseif ($request->boolean('remove_favicon')) {
            if ($setting->favicon && file_exists(public_path($setting->favicon))) {
                unlink(public_path($setting->favicon));
            }
            $validated['favicon'] = null;
        }

        // Subir QR de Yape
        if ($request->hasFile('yape_qr')) {
            if ($setting->yape_qr && file_exists(public_path($setting->yape_qr))) {
                unlink(public_path($setting->yape_qr));
            }
            $path = $request->file('yape_qr')->store('settings', 'public');
            $validated['yape_qr'] = '/storage/'.$path;
        } elseif ($request->boolean('remove_yape_qr')) {
            if ($setting->yape_qr && file_exists(public_path($setting->yape_qr))) {
                unlink(public_path($setting->yape_qr));
            }
            $validated['yape_qr'] = null;
        }

        $setting->fill($validated);
        $setting->save();

        return redirect()->back();
    }
}
