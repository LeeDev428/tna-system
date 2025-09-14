<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\EvaluationForm;
use App\Models\EvaluationSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InstructorEvaluationController extends Controller
{
    /**
     * Display a listing of evaluation forms for the instructor.
     */
    public function index()
    {
        $userId = Auth::id();
        
        // Get all available evaluation forms for instructors with their evaluation sessions
        $evaluationForms = EvaluationForm::with([
            'createdBy', 
            'competencyUnits',
            'evaluationSessions' => function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->where('response_type', 'instructor');
            }
        ])
        ->where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($form) {
            // Add the first (most recent) evaluation session to the form
            $form->evaluation_session = $form->evaluationSessions->first();
            unset($form->evaluationSessions); // Remove the collection to clean up
            return $form;
        });
            
        return Inertia::render('instructor/evaluations/index', [
            'evaluationForms' => $evaluationForms,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('instructor.dashboard')],
                ['label' => 'My Evaluations', 'url' => null],
            ]
        ]);
    }

    /**
     * Display the results of a completed evaluation.
     */
    public function showResults($formId)
    {
        $userId = Auth::id();
        
        // Get the evaluation session with responses
        $session = EvaluationSession::with([
            'evaluationForm.competencyUnits.elements.ratingCriteria.scaleDescriptions',
            'responses.competencyElement'
        ])
        ->where('evaluation_form_id', $formId)
        ->where('user_id', $userId)
        ->where('response_type', 'instructor')
        ->where('status', 'completed')
        ->firstOrFail();

        return Inertia::render('instructor/evaluations/results', [
            'session' => $session,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('instructor.dashboard')],
                ['label' => 'My Evaluations', 'url' => route('instructor.evaluations.index')],
                ['label' => 'Results', 'url' => null],
            ]
        ]);
    }
}
