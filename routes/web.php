<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// ✅ Estas faltan — son públicas
Route::get('/catalogos', [ProductController::class, 'index'])->name('catalog');
Route::get('/productos/{slug}', [ProductController::class, 'show'])->name('product.show');


require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/client.php';

Route::fallback(function () {
    return redirect()->back()->with('error', 'La página que buscas no existe o no tienes acceso.');
});
