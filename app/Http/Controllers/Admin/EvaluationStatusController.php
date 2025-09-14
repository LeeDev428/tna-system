<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EvaluationForm;
use App\Models\EvaluationSession;
use App\Models\EvaluationResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluationStatusController extends Controller
{
    public function index()
    {
        // Get all evaluation forms
        $evaluationForms = EvaluationForm::with(['competencyUnits.elements'])->get();

        // Get all instructors and supervisors
        $instructors = User::whereHas('instructorProfile')->with('instructorProfile')->get();
        $supervisors = User::whereHas('supervisorProfile')->with('supervisorProfile')->get();

        $evaluationData = [];

        foreach ($evaluationForms as $form) {
            foreach ($instructors as $instructor) {
                foreach ($supervisors as $supervisor) {
                    // Get instructor self-evaluation responses
                    $instructorResponses = EvaluationResponse::where([
                        'evaluation_form_id' => $form->id,
                        'user_id' => $instructor->id,
                        'response_type' => 'self',
                    ])->get();

                    // Get supervisor evaluation of this instructor
                    $supervisorResponses = EvaluationResponse::where([
                        'evaluation_form_id' => $form->id,
                        'user_id' => $supervisor->id,
                        'evaluated_user_id' => $instructor->id,
                        'response_type' => 'supervisor',
                    ])->get();

                    // Calculate CPR scores
                    $instructorCPR = $instructorResponses->count() > 0 
                        ? $instructorResponses->avg('cpr_score') 
                        : null;
                    
                    $supervisorCPR = $supervisorResponses->count() > 0 
                        ? $supervisorResponses->avg('cpr_score') 
                        : null;

                    // Combined CPR (supervisor takes priority)
                    $combinedCPR = $supervisorCPR ?? $instructorCPR;

                    $evaluationData[] = [
                        'instructor_id' => $instructor->id,
                        'instructor_name' => $instructor->name,
                        'instructor_email' => $instructor->email,
                        'supervisor_id' => $supervisor->id,
                        'supervisor_name' => $supervisor->name,
                        'supervisor_email' => $supervisor->email,
                        'evaluation_form_id' => $form->id,
                        'evaluation_form_title' => $form->title,
                        'instructor_cpr' => $instructorCPR ? round($instructorCPR, 1) : null,
                        'supervisor_cpr' => $supervisorCPR ? round($supervisorCPR, 1) : null,
                        'combined_cpr' => $combinedCPR ? round($combinedCPR, 1) : null,
                        'instructor_completed' => $instructorResponses->count() > 0,
                        'supervisor_completed' => $supervisorResponses->count() > 0,
                        'needs_training' => $combinedCPR ? $combinedCPR < 21 : false,
                    ];
                }
            }
        }

        return Inertia::render('admin/evaluations/index', [
            'evaluationData' => $evaluationData,
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/admin/dashboard'],
                ['title' => 'User Evaluations', 'href' => null],
            ],
        ]);
    }
    

    /**
     * Update evaluation status for a specific session
     */
    public function updateStatus(Request $request, EvaluationSession $session)
    {
        $session->updateCompletionStatus();
        
        return response()->json([
            'message' => 'Status updated successfully',
            'session' => $session->fresh(),
        ]);
    }

    /**
     * Get detailed view of evaluation responses with CPR breakdown
     */
    public function viewDetails(Request $request)
    {
        $formId = $request->query('form');
        $instructorId = $request->query('instructor');
        $supervisorId = $request->query('supervisor');
        
        $evaluationForm = EvaluationForm::with(['competencyUnits.elements'])->findOrFail($formId);
        $instructor = User::findOrFail($instructorId);
        $supervisor = User::findOrFail($supervisorId);
        $instructor = User::findOrFail($instructorId);
        $supervisor = User::findOrFail($supervisorId);

        // Get instructor self-evaluation responses
        $instructorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $formId,
            'user_id' => $instructorId,
            'response_type' => 'self',
        ])->with(['competencyElement.competencyUnit'])->get();

        // Get supervisor evaluation responses
        $supervisorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $formId,
            'user_id' => $supervisorId,
            'evaluated_user_id' => $instructorId,
            'response_type' => 'supervisor',
        ])->with(['competencyElement.competencyUnit'])->get();

        // Group responses by competency unit and element
        $responsesByUnit = [];
        $allElements = $evaluationForm->competencyUnits->flatMap(function($unit) {
            return $unit->elements->map(function($element) use ($unit) {
                return [
                    'unit_id' => $unit->id,
                    'unit_title' => $unit->title,
                    'element_id' => $element->id,
                    'element_title' => $element->title,
                ];
            });
        });

        foreach ($allElements as $element) {
            $instructorResponse = $instructorResponses->where('competency_element_id', $element['element_id'])->first();
            $supervisorResponse = $supervisorResponses->where('competency_element_id', $element['element_id'])->first();

            // Determine final CPR (supervisor takes priority)
            $finalCPR = 0;
            $finalRatings = [
                'criticality' => 0,
                'competence' => 0,
                'frequency' => 0,
                'source' => 'none'
            ];

            if ($supervisorResponse) {
                $finalCPR = $supervisorResponse->cpr_score;
                $finalRatings = [
                    'criticality' => $supervisorResponse->criticality_rating,
                    'competence' => $supervisorResponse->competence_level_rating,
                    'frequency' => $supervisorResponse->frequency_rating,
                    'source' => 'supervisor'
                ];
            } elseif ($instructorResponse) {
                $finalCPR = $instructorResponse->cpr_score;
                $finalRatings = [
                    'criticality' => $instructorResponse->criticality_rating,
                    'competence' => $instructorResponse->competence_level_rating,
                    'frequency' => $instructorResponse->frequency_rating,
                    'source' => 'instructor'
                ];
            }

            if (!isset($responsesByUnit[$element['unit_id']])) {
                $responsesByUnit[$element['unit_id']] = [
                    'unit' => [
                        'id' => $element['unit_id'],
                        'title' => $element['unit_title']
                    ],
                    'elements' => []
                ];
            }

            $responsesByUnit[$element['unit_id']]['elements'][] = [
                'element' => [
                    'id' => $element['element_id'],
                    'title' => $element['element_title']
                ],
                'instructor_response' => $instructorResponse,
                'supervisor_response' => $supervisorResponse,
                'final_cpr' => $finalCPR,
                'final_ratings' => $finalRatings,
                'needs_training' => $finalCPR < 21
            ];
        }

        return Inertia::render('admin/evaluations/detailed-view', [
            'evaluationForm' => $evaluationForm,
            'instructor' => $instructor,
            'supervisor' => $supervisor,
            'responsesByUnit' => array_values($responsesByUnit),
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/admin/dashboard'],
                ['title' => 'User Evaluations', 'href' => '/admin/evaluations'],
                ['title' => 'Detailed View', 'href' => null],
            ],
        ]);
    }

    /**
     * Get detailed comparison view of instructor vs supervisor evaluation responses
     */
    public function show(EvaluationSession $session)
    {
        $session->load(['evaluationForm.competencyUnits.elements', 'user', 'evaluatedUser']);
        
        $evaluationForm = $session->evaluationForm;
        
        // Determine instructor and supervisor based on session type
        if ($session->session_type === 'self') {
            $instructor = $session->user;
            // Find supervisor who evaluated this instructor
            $supervisorResponse = EvaluationResponse::where([
                'evaluation_form_id' => $session->evaluation_form_id,
                'evaluated_user_id' => $instructor->id,
                'response_type' => 'supervisor',
            ])->first();
            
            $supervisor = $supervisorResponse ? User::find($supervisorResponse->user_id) : null;
        } else {
            // session_type === 'supervisor'
            $instructor = $session->evaluatedUser;
            $supervisor = $session->user;
        }

        if (!$instructor) {
            abort(404, 'Instructor not found');
        }

        // Get instructor self-evaluation responses
        $instructorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $session->evaluation_form_id,
            'user_id' => $instructor->id,
            'response_type' => 'self',
        ])->with(['competencyElement.competencyUnit'])->get()->keyBy('competency_element_id');

        // Get supervisor evaluation responses
        $supervisorResponses = collect();
        if ($supervisor) {
            $supervisorResponses = EvaluationResponse::where([
                'evaluation_form_id' => $session->evaluation_form_id,
                'user_id' => $supervisor->id,
                'evaluated_user_id' => $instructor->id,
                'response_type' => 'supervisor',
            ])->with(['competencyElement.competencyUnit'])->get()->keyBy('competency_element_id');
        }

        // Build comparison data for each competency element
        $comparisonData = [];
        foreach ($evaluationForm->competencyUnits as $unit) {
            foreach ($unit->elements as $element) {
                $instructorResponse = $instructorResponses->get($element->id);
                $supervisorResponse = $supervisorResponses->get($element->id);

                // Calculate final CPR (supervisor takes priority)
                $finalCPR = 0;
                $needsTraining = true;
                $hasDiscrepancy = false;

                if ($supervisorResponse) {
                    $finalCPR = $supervisorResponse->cpr_score;
                    $needsTraining = $finalCPR < 21;
                    
                    // Check for discrepancy if both responses exist
                    if ($instructorResponse) {
                        $hasDiscrepancy = (
                            $instructorResponse->criticality_rating !== $supervisorResponse->criticality_rating ||
                            $instructorResponse->competence_rating !== $supervisorResponse->competence_rating ||
                            $instructorResponse->frequency_rating !== $supervisorResponse->frequency_rating
                        );
                    }
                } elseif ($instructorResponse) {
                    $finalCPR = $instructorResponse->cpr_score;
                    $needsTraining = $finalCPR < 21;
                }

                $comparisonData[] = [
                    'competency_element_id' => $element->id,
                    'element_description' => $element->description,
                    'unit_title' => $unit->title,
                    'instructor_response' => $instructorResponse ? [
                        'competency_element_id' => $element->id,
                        'criticality_rating' => $instructorResponse->criticality_rating,
                        'competence_rating' => $instructorResponse->competence_rating,
                        'frequency_rating' => $instructorResponse->frequency_rating,
                        'cpr_score' => $instructorResponse->cpr_score,
                    ] : null,
                    'supervisor_response' => $supervisorResponse ? [
                        'competency_element_id' => $element->id,
                        'criticality_rating' => $supervisorResponse->criticality_rating,
                        'competence_rating' => $supervisorResponse->competence_rating,
                        'frequency_rating' => $supervisorResponse->frequency_rating,
                        'cpr_score' => $supervisorResponse->cpr_score,
                    ] : null,
                    'final_cpr' => round($finalCPR, 1),
                    'needs_training' => $needsTraining,
                    'has_discrepancy' => $hasDiscrepancy,
                ];
            }
        }

        return Inertia::render('admin/evaluations/show', [
            'evaluation_form' => $evaluationForm,
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
            ],
            'supervisor' => $supervisor ? [
                'id' => $supervisor->id,
                'name' => $supervisor->name,
                'email' => $supervisor->email,
            ] : [
                'id' => 0,
                'name' => 'Not Assigned',
                'email' => '',
            ],
            'comparison_data' => $comparisonData,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'User Evaluations', 'url' => route('admin.evaluations.index')],
                ['label' => 'Evaluation Comparison', 'url' => null],
            ],
        ]);
    }

    /**
     * Create evaluation session
     */
    private function createEvaluationSession($evaluationForm, $user, $evaluatedUser = null, $sessionType = 'self')
    {
        $totalElements = $evaluationForm->competencyUnits()
            ->withCount('elements')
            ->get()
            ->sum('elements_count');

        return EvaluationSession::create([
            'evaluation_form_id' => $evaluationForm->id,
            'user_id' => $user->id,
            'evaluated_user_id' => $evaluatedUser?->id,
            'session_type' => $sessionType,
            'status' => 'not_started',
            'total_elements' => $totalElements,
            'completed_elements' => 0,
            'completion_percentage' => 0.0,
        ]);
    }

    /**
     * Calculate combined CPR from instructor and supervisor responses
     * Supervisor responses take priority over instructor self-evaluations
     */
    private function calculateCombinedCPR($instructorResponses, $supervisorResponses)
    {
        if ($supervisorResponses->isEmpty() && $instructorResponses->isEmpty()) {
            return 0;
        }

        // If supervisor responses exist, use those (supervisor priority)
        if ($supervisorResponses->isNotEmpty()) {
            $totalCPR = $supervisorResponses->sum('cpr_score');
            return $totalCPR / $supervisorResponses->count();
        }

        // Otherwise use instructor self-evaluation
        if ($instructorResponses->isNotEmpty()) {
            $totalCPR = $instructorResponses->sum('cpr_score');
            return $totalCPR / $instructorResponses->count();
        }

        return 0;
    }
}
