<?php

use App\Http\Controllers\Instructor\DashboardController;
use App\Http\Controllers\Instructor\InstructorEvaluationController;
use App\Http\Controllers\EvaluationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // My Evaluations Routes
    Route::get('/evaluations', [InstructorEvaluationController::class, 'index'])->name('evaluations.index');
    Route::get('/evaluations/{id}/results', [InstructorEvaluationController::class, 'showResults'])->name('evaluations.results');
    Route::get('/evaluations/{id}', [EvaluationController::class, 'showEvaluation'])->name('evaluations.show');
    Route::post('/evaluations/{id}/responses', [EvaluationController::class, 'storeResponses'])->name('evaluations.store');
    
    // My Profile Routes
    Route::get('/profile', function () {
        return inertia('instructor/profile/edit');
    })->name('profile.edit');
    
    // Training Materials Routes
    Route::get('/materials', function () {
        return inertia('instructor/materials/index');
    })->name('materials.index');
});
