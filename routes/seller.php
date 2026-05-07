<?php

use App\Http\Controllers\Seller\SellerController;
use Illuminate\Support\Facades\Route;

// Route::middleware(['role:ADMIN'])->group(function () {
//    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
// });

Route::prefix('seller')->group(function () {
    Route::get('/', [SellerController::class, 'index'])->name('seller.dashboard');
});
