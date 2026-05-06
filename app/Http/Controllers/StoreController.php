<?php

namespace App\Http\Controllers;

use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $stores = SellerProfile::where('is_approved', true)
            ->with(['user', 'products' => function($q) {
                $q->where('is_active', true)->where('is_approved', true);
            }])
            ->get()
            ->map(fn($profile) => [
                'id' => $profile->id,
                'storeName' => $profile->store_name,
                'description' => $profile->description,
                'storeLogo' => $profile->logo_url,
                'storeCover' => $profile->banner_url,
                'sellerName' => $profile->user->name,
                'sellerLastName' => '', // Assuming name contains full name or add field
                'productCount' => $profile->products->count(),
                'since' => $profile->created_at->toISOString(),
                'products' => $profile->products->take(4)->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'imageUrl' => $p->image_url,
                ]),
            ]);

        return Inertia::render('User/Shops/Index', [
            'stores' => $stores,
        ]);
    }

    public function show($id)
    {
        $store = SellerProfile::with(['user', 'products' => function($q) {
                $q->where('is_active', true)->where('is_approved', true);
            }])
            ->findOrFail($id);

        return Inertia::render('User/Shops/Show', [
            'store' => $store,
        ]);
    }
}
