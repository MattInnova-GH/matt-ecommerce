<?php

use App\Http\Controllers\User\ConfigurationController;
use App\Http\Controllers\User\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

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

    Route::put('/configuracion/perfil', [ConfigurationController::class, 'updateProfile'])
        ->name('configuration.update-profile');

    Route::post('/configuracion/solicitar-vendedor', [ConfigurationController::class, 'createSellerRequest'])
        ->name('configuration.seller-request');

    Route::post('/configuracion/avatar', [ConfigurationController::class, 'updateAvatar'])
        ->name('configuration.avatar');

    // ------------------ SEARCH BAR ------------------------------------------

});
