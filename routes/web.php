<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EvaluationController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Include test routes
require __DIR__.'/test.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Evaluation routes for both instructors and supervisors
    Route::get('evaluations/{id}', [EvaluationController::class, 'showEvaluation'])->name('evaluations.show');
    Route::post('evaluations/{id}/responses', [EvaluationController::class, 'storeResponses'])->name('evaluations.store');
    Route::get('api/instructors', [EvaluationController::class, 'getInstructors'])->name('api.instructors');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/supervisor.php';
require __DIR__.'/instructor.php';
