<?php

use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [App\Http\Controllers\StorefrontController::class, 'index'])->name('home');

// Public storefront routes
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/', [App\Http\Controllers\StorefrontController::class, 'index'])->name('index');
    Route::get('/{product:slug}', [App\Http\Controllers\StorefrontController::class, 'show'])->name('show');
});

Route::prefix('stores')->name('stores.')->group(function () {
    Route::get('/', [App\Http\Controllers\StorefrontController::class, 'stores'])->name('index');
    Route::get('/{store:slug}', [App\Http\Controllers\StorefrontController::class, 'store'])->name('show');
});

// Cart routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [App\Http\Controllers\CartController::class, 'index'])->name('index');
        Route::post('/add/{product}', [App\Http\Controllers\CartController::class, 'add'])->name('add');
        Route::put('/{cart}', [App\Http\Controllers\CartController::class, 'update'])->name('update');
        Route::delete('/{cart}', [App\Http\Controllers\CartController::class, 'remove'])->name('remove');
        Route::delete('/', [App\Http\Controllers\CartController::class, 'clear'])->name('clear');
        Route::get('/count', [App\Http\Controllers\CartController::class, 'count'])->name('count');
    });

    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [App\Http\Controllers\OrderController::class, 'index'])->name('index');
        Route::get('/checkout', [App\Http\Controllers\OrderController::class, 'checkout'])->name('checkout');
        Route::post('/checkout', [App\Http\Controllers\OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [App\Http\Controllers\OrderController::class, 'show'])->name('show');
        Route::patch('/{order}/cancel', [App\Http\Controllers\OrderController::class, 'cancel'])->name('cancel');
    });

    // Payment callback routes
    Route::prefix('payment')->name('payment.')->group(function () {
        Route::get('/success/{order}', [App\Http\Controllers\PaymentController::class, 'success'])->name('success');
        Route::get('/cancel/{order}', [App\Http\Controllers\PaymentController::class, 'cancel'])->name('cancel');
    });
});

// Webhook routes (no auth required)
Route::post('/webhooks/magpie', [App\Http\Controllers\PaymentController::class, 'webhook'])->name('webhooks.magpie');

// Authenticated user routing with role-based dashboard redirects
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if ($user->isMerchant()) {
            return redirect()->route('merchant.dashboard');
        }

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Default to buyer dashboard
        return redirect()->route('buyer.dashboard');
    })->name('dashboard');
});

// Buyer Routes
Route::middleware(['auth', 'verified', 'buyer'])->prefix('buyer')->name('buyer.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Buyer\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders');

    Route::get('/profile', function () {
        return response()->json(['message' => 'Buyer Profile']);
    })->name('profile');
});

// Merchant Routes
Route::middleware(['auth', 'verified', 'merchant'])->prefix('merchant')->name('merchant.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Merchant\DashboardController::class, 'index'])->name('dashboard');

    // Store management
    Route::get('/store/create', [App\Http\Controllers\Merchant\StoreController::class, 'create'])->name('store.create');
    Route::post('/store', [App\Http\Controllers\Merchant\StoreController::class, 'store'])->name('store.store');
    Route::get('/store/edit', [App\Http\Controllers\Merchant\StoreController::class, 'edit'])->name('store.edit');
    Route::put('/store', [App\Http\Controllers\Merchant\StoreController::class, 'update'])->name('store.update');

    // Product management
    Route::resource('products', App\Http\Controllers\Merchant\ProductController::class);
    Route::post('/products/{product}/publish', [App\Http\Controllers\Merchant\ProductController::class, 'publish'])->name('products.publish');
    Route::post('/products/{product}/unpublish', [App\Http\Controllers\Merchant\ProductController::class, 'unpublish'])->name('products.unpublish');

    Route::get('/orders', function () {
        return response()->json(['message' => 'Merchant Orders']);
    })->name('orders');

    // Analytics
    Route::get('/analytics', [App\Http\Controllers\Merchant\DashboardController::class, 'getAnalytics'])->name('analytics');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');

    // User management
    Route::get('/users', [App\Http\Controllers\Admin\AdminDashboardController::class, 'users'])->name('users');

    // Store management
    Route::get('/stores', [App\Http\Controllers\Admin\AdminDashboardController::class, 'stores'])->name('stores');
    Route::patch('/stores/{store}/approve', [App\Http\Controllers\Admin\AdminDashboardController::class, 'approveStore'])->name('stores.approve');
    Route::patch('/stores/{store}/suspend', [App\Http\Controllers\Admin\AdminDashboardController::class, 'suspendStore'])->name('stores.suspend');

    // Order management
    Route::get('/orders', [App\Http\Controllers\Admin\AdminDashboardController::class, 'orders'])->name('orders');

    // Payment management
    Route::get('/payments', [App\Http\Controllers\Admin\AdminDashboardController::class, 'payments'])->name('payments');

    // Category management
    Route::get('/categories', [App\Http\Controllers\Admin\AdminDashboardController::class, 'categories'])->name('categories');

    // Analytics
    Route::get('/analytics', [App\Http\Controllers\Admin\AdminDashboardController::class, 'analytics'])->name('analytics');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
