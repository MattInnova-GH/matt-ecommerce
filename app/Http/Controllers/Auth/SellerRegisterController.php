<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SellerRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class SellerRegisterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'business_name' => ['required', 'string', 'max:255'],
            'business_type' => ['required', 'string'],
            'tax_id_type' => ['required', 'in:RUC,DNI,CE'],
            'tax_id_number' => ['required', 'string'],
            'address' => ['required', 'string', 'max:500'],
            'experience' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'document_type' => $validated['tax_id_type'],
                'document_number' => $validated['tax_id_number'],
            ]);

            $user->assignRole('user'); // ← Spatie, rol básico mientras espera

            SellerRequest::create([
                'user_id' => $user->id,
                'business_name' => $validated['business_name'],
                'business_type' => $validated['business_type'],
                'address' => $validated['address'],
                'tax_id' => $validated['tax_id_type'].':'.$validated['tax_id_number'],
                'phone' => $validated['phone'],
                'experience' => $validated['experience'] ?? null,
                'status' => 'PENDING',
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('home');
    }
}
