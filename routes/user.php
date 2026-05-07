<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\FavoriteController;

Route::middleware(['auth'])->group(function () {

    Route::get('/favoritos', [FavoriteController::class, 'index'])
        ->name('favorites.index');

    Route::post('/favoritos/toggle/{product}', [FavoriteController::class, 'toggle'])
        ->name('favorites.toggle');

    Route::delete('/favoritos/{product}', [FavoriteController::class, 'destroy'])
        ->name('favorites.destroy');

    Route::post('/favoritos/bulk-delete', [FavoriteController::class, 'destroyMany'])
        ->name('favorites.bulk-delete');
});