<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // USUARIOS
        Route::resource('users', UserController::class);
        Route::post('/users/{user}/change-role', [UserController::class, 'changeRole'])->name('users.change-role');
        Route::post('/users/{user}/toggle-block', [UserController::class, 'toggleBlock'])->name('users.toggle-block');

        Route::resource('products', ProductController::class);
        Route::put('products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::put('products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');

        Route::resource('categories', CategoryController::class);
        Route::put('categories/{category}/toggleStatus', [CategoryController::class, 'toggleStatus'])->name('categories.toggleStatus');

        // MARCAS
        Route::resource('brands', BrandController::class);

        Route::resource('suppliers', SupplierController::class);
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);

        // MULTIPLES BANNERS
        Route::resource('banners', BannerController::class);
        Route::put('banners/{banner}/toggle-status', [BannerController::class, 'toggleStatus'])->name('banners.toggle-status');
        Route::post('/admin/banners/reorder', [BannerController::class, 'reorder'])->name('banners.reorder');

        // PAGOS
        Route::resource('payments', PaymentController::class);

        // COMENTARIOS DE PRODUCTOS
        Route::resource('reviews', ReviewController::class)->only(['index', 'destroy']);
        Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
