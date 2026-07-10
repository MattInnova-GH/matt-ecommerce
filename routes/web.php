<?php

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\Client\CategoryController;
use App\Http\Controllers\Client\ProductController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::post('/libro-de-reclamaciones', [ComplaintController::class, 'store'])->name('reclamaciones.store');
Route::get('/terminos-y-condiciones', fn () => inertia('Client/TerminosCondiciones'))->name('terminos');
Route::get('/politica-de-privacidad', fn () => inertia('Client/PoliticaPrivacidad'))->name('privacidad');
Route::get('/preguntas-frecuentes', fn () => inertia('Client/PreguntasFrecuentes'))->name('faq');

require __DIR__.'/admin.php';
require __DIR__.'/auth.php';
require __DIR__.'/client.php';

Route::fallback(function (Request $request) {
    return Inertia::render('Errors/NotFound')->toResponse($request)->setStatusCode(404);
});
