<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Client\OrderController;
use App\Http\Controllers\Client\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\User\ConfigurationController;
use App\Http\Controllers\User\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:client|admin'])
    ->name('client.')
    ->group(function () {

        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
        Route::patch('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{item}', [CartController::class, 'destroy'])->name('cart.destroy');

        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

        // CONFIGURACION

        // PERFIL
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

        // PEDIDOS
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

        // AVATAR
        Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
        Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');

        // DIRECCIONES
        Route::post('/profile/addresses', [ProfileController::class, 'storeAddress'])->name('profile.addresses.store');
        Route::put('/profile/addresses/{address}', [ProfileController::class, 'updateAddress'])->name('profile.addresses.update');
        Route::delete('/profile/addresses/{address}', [ProfileController::class, 'destroyAddress'])->name('profile.addresses.destroy');

        // ------------------ FAVORITOS ------------------------------------------

        Route::get('/favoritos', [FavoriteController::class, 'index'])
            ->name('favorites.index');

        Route::post('/favoritos/toggle/{product}', [FavoriteController::class, 'toggle'])
            ->name('favorites.toggle');

        Route::delete('/favoritos/{product}', [FavoriteController::class, 'destroy'])
            ->name('favorites.destroy');

        Route::post('/favoritos/bulk-delete', [FavoriteController::class, 'destroyMany'])
            ->name('favorites.bulk-delete');

        // ------------------ CONFIGURARION ------------------------------------------

        Route::get('/configuracion', [ConfigurationController::class, 'index'])
            ->name('configuration.index');

    });
