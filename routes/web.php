<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
Route::get('/productos/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/tiendas', [StoreController::class, 'index'])->name('stores.index');
Route::get('/tiendas/{id}', [StoreController::class, 'show'])->name('stores.show');

// Search routes
Route::get('/search-data', [SearchController::class, 'index'])->name('search.data');
Route::get('/search-query', [SearchController::class, 'search'])->name('search.query');

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/seller.php';
require __DIR__.'/user.php';
require __DIR__.'/auth.php';

Route::fallback(function () {
    return redirect()->back()->with('error', 'La página que buscas no existe o no tienes acceso.');
});
