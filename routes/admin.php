<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

// Route::middleware(['role:ADMIN'])->group(function () {
//    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
// });

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
});
