<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EvaluationFormController;
use App\Http\Controllers\Admin\EvaluationStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // User Management Routes
    Route::resource('users', UserController::class)->except(['edit', 'update', 'destroy']);
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    
    // Evaluation Form Management Routes
    Route::resource('evaluation-forms', EvaluationFormController::class)->names([
        'index' => 'evaluation-forms.index',
        'create' => 'evaluation-forms.create',
        'store' => 'evaluation-forms.store',
        'show' => 'evaluation-forms.show',
        'edit' => 'evaluation-forms.edit',
        'update' => 'evaluation-forms.update',
        'destroy' => 'evaluation-forms.destroy',
    ]);
    
    // View evaluation responses
    Route::get('/evaluation-forms/{evaluationForm}/responses', [EvaluationFormController::class, 'showResponses'])->name('evaluation-forms.responses');
    
    // User Evaluations Status Routes
    Route::get('/evaluations', [EvaluationStatusController::class, 'index'])->name('evaluations.index');
    Route::get('/evaluations/details', [EvaluationStatusController::class, 'viewDetails'])->name('evaluations.details');
    Route::put('/evaluations/{session}/status', [EvaluationStatusController::class, 'updateStatus'])->name('evaluations.update-status');
    Route::get('/evaluations/{session}', [EvaluationStatusController::class, 'show'])->name('evaluations.show');
    Route::get('/evaluations/view/{form}/{instructor}/{supervisor}', [EvaluationStatusController::class, 'viewDetails'])->name('evaluations.view-details');
    Route::get('/evaluations/export/{form}/{supervisor}/{instructor}', [EvaluationStatusController::class, 'exportPdf'])->name('evaluations.export-pdf');
    
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
