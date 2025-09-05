<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to Marketplace',
        'app_name' => config('app.name'),
        'version' => '1.0.0'
    ]);
})->name('home');

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
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Buyer Dashboard', 'user' => auth()->user()->only(['id', 'name', 'role'])]);
    })->name('dashboard');
    
    Route::get('/orders', function () {
        return response()->json(['message' => 'Buyer Orders']);
    })->name('orders');
    
    Route::get('/profile', function () {
        return response()->json(['message' => 'Buyer Profile']);
    })->name('profile');
});

// Merchant Routes
Route::middleware(['auth', 'verified', 'merchant'])->prefix('merchant')->name('merchant.')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Merchant Dashboard', 'user' => auth()->user()->only(['id', 'name', 'role'])]);
    })->name('dashboard');
    
    Route::get('/store', function () {
        return response()->json(['message' => 'Merchant Store']);
    })->name('store');
    
    Route::get('/products', function () {
        return response()->json(['message' => 'Merchant Products']);
    })->name('products');
    
    Route::get('/orders', function () {
        return response()->json(['message' => 'Merchant Orders']);
    })->name('orders');
    
    Route::get('/analytics', function () {
        return response()->json(['message' => 'Merchant Analytics']);
    })->name('analytics');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Admin Dashboard', 'user' => auth()->user()->only(['id', 'name', 'role'])]);
    })->name('dashboard');
    
    Route::get('/users', function () {
        return response()->json(['message' => 'Admin Users']);
    })->name('users');
    
    Route::get('/stores', function () {
        return response()->json(['message' => 'Admin Stores']);
    })->name('stores');
    
    Route::get('/categories', function () {
        return response()->json(['message' => 'Admin Categories']);
    })->name('categories');
    
    Route::get('/analytics', function () {
        return response()->json(['message' => 'Admin Analytics']);
    })->name('analytics');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
