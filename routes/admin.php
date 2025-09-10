<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // User Management Routes
    Route::get('/users', function () {
        return inertia('admin/users/index');
    })->name('users.index');
    
    Route::get('/users/create', function () {
        return inertia('admin/users/create');
    })->name('users.create');
    
    // Units Management Routes
    Route::get('/units', function () {
        return inertia('admin/units/index');
    })->name('units.index');
    
    Route::get('/units/create', function () {
        return inertia('admin/units/create');
    })->name('units.create');
    
    // Elements Management Routes
    Route::get('/elements', function () {
        return inertia('admin/elements/index');
    })->name('elements.index');
    
    Route::get('/elements/create', function () {
        return inertia('admin/elements/create');
    })->name('elements.create');
    
    // Evaluation Reports Routes
    Route::get('/reports', function () {
        return inertia('admin/reports/index');
    })->name('reports.index');
});
