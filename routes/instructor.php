<?php

use App\Http\Controllers\Instructor\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // My Evaluations Routes
    Route::get('/evaluations', function () {
        return inertia('instructor/evaluations/index');
    })->name('evaluations.index');
    
    Route::get('/evaluations/{id}', function ($id) {
        return inertia('instructor/evaluations/show', ['id' => $id]);
    })->name('evaluations.show');
    
    // My Profile Routes
    Route::get('/profile', function () {
        return inertia('instructor/profile/edit');
    })->name('profile.edit');
    
    // Training Materials Routes
    Route::get('/materials', function () {
        return inertia('instructor/materials/index');
    })->name('materials.index');
});
