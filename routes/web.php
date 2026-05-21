<?php

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\Client\CategoryController;
use App\Http\Controllers\Client\ProductController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/productos', [ProductController::class, 'index'])->name('products');
Route::get('/productos/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::get('/categorias', [CategoryController::class, 'index'])->name('categories');
Route::get('/categorias/{slug}', [CategoryController::class, 'show'])->name('category.show');

// ------------------ SEARCH BAR ------------------------------------------

Route::get('/buscar', [PublicProductController::class, 'search'])->name('product.search');

// ------------------ CHATBOT ------------------------------------------

Route::post('/chatbot', [ChatbotController::class, 'respond'])->name('chatbot.respond');

Route::get('/libro-de-reclamaciones', fn () => inertia('Client/Reclamaciones'))->name('reclamaciones');
Route::get('/terminos-y-condiciones', fn () => inertia('Client/TerminosCondiciones'))->name('terminos');
Route::get('/politica-de-privacidad', fn () => inertia('Client/PoliticaPrivacidad'))->name('privacidad');
Route::get('/preguntas-frecuentes', fn () => inertia('Client/PreguntasFrecuentes'))->name('faq');

require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/client.php';

Route::fallback(function () {
    return redirect()->back()->with('error', 'La página que buscas no existe o no tienes acceso.');
});
