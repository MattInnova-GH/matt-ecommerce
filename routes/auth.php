<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SellerRegisterController;

Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => inertia('Auth/Login'))->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

    Route::get('/register', fn() => inertia('Auth/Register'))->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::post('/register/seller', [SellerRegisterController::class, 'store'])->name('register.seller');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');
});