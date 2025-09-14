<?php

use App\Http\Controllers\Supervisor\DashboardController;
use App\Http\Controllers\EvaluationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:supervisor'])->prefix('supervisor')->name('supervisor.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Instructor Management Routes (for assigned instructors)
    Route::get('/instructors', function () {
        return inertia('supervisor/instructors/index');
    })->name('instructors.index');
    
    // Evaluation Routes
    Route::get('/evaluations', function () {
        // Get all available evaluation forms for supervisors
        $evaluationForms = \App\Models\EvaluationForm::with(['createdBy', 'competencyUnits'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('supervisor/evaluations/index', [
            'evaluationForms' => $evaluationForms,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('supervisor.dashboard')],
                ['label' => 'Evaluations', 'url' => null],
            ]
        ]);
    })->name('evaluations.index');
    
    // Step 1: Show instructor selection for evaluation
    Route::get('/evaluations/{id}/select-instructor', function ($id) {
        $evaluationForm = \App\Models\EvaluationForm::findOrFail($id);
        
        // Get all instructors with their evaluation status
        $instructors = \App\Models\User::whereHas('instructorProfile')
            ->with('instructorProfile')
            ->get()
            ->map(function ($user) use ($id) {
                // Check if instructor has completed self-evaluation
                $selfEvaluationCompleted = \App\Models\EvaluationResponse::where([
                    'evaluation_form_id' => $id,
                    'user_id' => $user->id,
                    'response_type' => 'self'
                ])->exists();
                
                // Check if supervisor has completed evaluation for this instructor
                $supervisorEvaluationCompleted = \App\Models\EvaluationResponse::where([
                    'evaluation_form_id' => $id,
                    'evaluated_user_id' => $user->id,
                    'response_type' => 'supervisor'
                ])->exists();
                
                // Check if comparison results exist
                $hasComparisonResults = $selfEvaluationCompleted && $supervisorEvaluationCompleted;
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'specialization' => $user->instructorProfile->specialization ?? 'N/A',
                    'certification_level' => $user->instructorProfile->certification_level ?? 'N/A',
                    'self_evaluation_completed' => $selfEvaluationCompleted,
                    'supervisor_evaluation_completed' => $supervisorEvaluationCompleted,
                    'has_comparison_results' => $hasComparisonResults,
                ];
            });
            
        return inertia('supervisor/evaluations/select-instructor', [
            'instructors' => $instructors,
            'evaluationForm' => $evaluationForm,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('supervisor.dashboard')],
                ['label' => 'Evaluations', 'url' => route('supervisor.evaluations.index')],
                ['label' => $evaluationForm->title, 'url' => null],
            ]
        ]);
    })->name('evaluations.select-instructor');
    
    // Step 2: Show evaluation form for selected instructor
    Route::get('/evaluations/{id}/evaluate/{instructor_id}', [EvaluationController::class, 'showSupervisorEvaluation'])->name('evaluations.evaluate');
    
    // Step 3: View comparison results
    Route::get('/evaluations/{id}/results/{instructor_id}', [EvaluationController::class, 'showComparisonResults'])->name('evaluations.results');
    
    Route::post('/evaluations/{id}/responses', [EvaluationController::class, 'storeResponses'])->name('evaluations.store');
    Route::get('/api/instructors', [EvaluationController::class, 'getInstructors'])->name('api.instructors');
    
    Route::get('/evaluations/create', function () {
        return inertia('supervisor/evaluations/create');
    })->name('evaluations.create');
    
    // Reports Routes
    Route::get('/reports', function () {
        return inertia('supervisor/reports/index');
    })->name('reports.index');
});
