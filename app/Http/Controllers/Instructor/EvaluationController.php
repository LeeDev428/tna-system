<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\EvaluationForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    /**
     * Display a listing of evaluation forms for the instructor
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
                      ->where('session_type', 'self')
                      ->latest();
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
     * Display the results of a completed evaluation
     */
    public function showResults($id)
    {
        $userId = Auth::id();
        
        $evaluationForm = EvaluationForm::with([
            'competencyUnits.competencyElements.ratingCriteria.ratingScaleDescriptions',
            'evaluationSessions' => function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->where('session_type', 'self')
                      ->where('status', 'completed')
                      ->with('evaluationResponses')
                      ->latest();
            }
        ])->findOrFail($id);

        $session = $evaluationForm->evaluationSessions->first();
        
        if (!$session || $session->status !== 'completed') {
            return redirect()->route('instructor.evaluations.index')
                           ->with('error', 'Evaluation not completed yet.');
        }

        // Calculate results and CPR scores
        $results = $this->calculateEvaluationResults($session);

        return Inertia::render('instructor/evaluations/results', [
            'evaluationForm' => $evaluationForm,
            'session' => $session,
            'results' => $results,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('instructor.dashboard')],
                ['label' => 'My Evaluations', 'url' => route('instructor.evaluations.index')],
                ['label' => 'Results', 'url' => null],
            ]
        ]);
    }

    /**
     * Calculate evaluation results and CPR scores
     */
    private function calculateEvaluationResults($session)
    {
        $responses = $session->evaluationResponses->groupBy('competency_element_id');
        $results = [];

        foreach ($responses as $elementId => $elementResponses) {
            $criticality = $elementResponses->where('rating_criteria_type', 'criticality')->first()?->rating ?? 0;
            $competence = $elementResponses->where('rating_criteria_type', 'competence')->first()?->rating ?? 0;
            $frequency = $elementResponses->where('rating_criteria_type', 'frequency')->first()?->rating ?? 0;

            $cprScore = $criticality * $competence * $frequency;
            $needsTraining = $cprScore < 21;

            $results[$elementId] = [
                'criticality' => $criticality,
                'competence' => $competence,
                'frequency' => $frequency,
                'cpr_score' => $cprScore,
                'needs_training' => $needsTraining,
            ];
        }

        return $results;
    }
}
