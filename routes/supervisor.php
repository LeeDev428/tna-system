<?php

use App\Http\Controllers\Supervisor\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:supervisor'])->prefix('supervisor')->name('supervisor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Instructor Management Routes (for assigned instructors)
    Route::get('/instructors', function () {
        return inertia('supervisor/instructors/index');
    })->name('instructors.index');
    
    // Evaluation Routes
    Route::get('/evaluations', function () {
        return inertia('supervisor/evaluations/index');
    })->name('evaluations.index');
    
    Route::get('/evaluations/create', function () {
        return inertia('supervisor/evaluations/create');
    })->name('evaluations.create');
    
    // Reports Routes
    Route::get('/reports', function () {
        return inertia('supervisor/reports/index');
    })->name('reports.index');
});
