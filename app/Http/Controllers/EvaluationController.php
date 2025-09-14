<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EvaluationForm;
use App\Models\EvaluationResponse;
use App\Models\EvaluationSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    public function showEvaluation($id)
    {
        $evaluationForm = EvaluationForm::with([
            'competencyUnits.elements',
            'ratingCriteria',
            'ratingScaleDescriptions'
        ])->findOrFail($id);

        // Get existing responses for the current user
        $existingResponses = EvaluationResponse::where('evaluation_form_id', $id)
            ->where('user_id', Auth::id())
            ->get()
            ->keyBy('competency_element_id');

        // Determine user role from URL or request
        $viewName = 'instructor/evaluations/take';
        $dashboardRoute = 'instructor.dashboard';
        $evaluationsRoute = 'instructor.evaluations.index';

        // Check if user is a supervisor (you can modify this logic based on your user model)
        if (request()->is('supervisor/*') || request()->routeIs('supervisor.*')) {
            $viewName = 'supervisor/evaluations/take';
            $dashboardRoute = 'supervisor.dashboard';
            $evaluationsRoute = 'supervisor.evaluations.index';
        }

        return Inertia::render($viewName, [
            'evaluationForm' => $evaluationForm,
            'existingResponses' => $existingResponses,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route($dashboardRoute)],
                ['label' => 'Evaluations', 'url' => route($evaluationsRoute)],
                ['label' => $evaluationForm->title, 'url' => null],
            ],
        ]);
    }

    /**
     * Show evaluation form for supervisor to evaluate a specific instructor
     */
    public function showSupervisorEvaluation($evaluationFormId, $instructorId)
    {
        $evaluationForm = EvaluationForm::with([
            'competencyUnits.elements',
            'ratingCriteria',
            'ratingScaleDescriptions'
        ])->findOrFail($evaluationFormId);

        $instructor = User::with('instructorProfile')->findOrFail($instructorId);

        // Check supervisor status for this evaluation
        $supervisorSession = EvaluationSession::where('evaluation_form_id', $evaluationFormId)
            ->where('user_id', Auth::id()) // Current supervisor
            ->where('evaluated_user_id', $instructorId) // Instructor being evaluated  
            ->where('session_type', 'supervisor')
            ->first();

        // If supervisor already completed, redirect back
        if ($supervisorSession && $supervisorSession->supervisor_status === 'completed') {
            return redirect()->route('supervisor.evaluations.comparison', [$evaluationFormId, $instructorId])
                           ->with('info', 'You have already completed this evaluation.');
        }

        // Create or update supervisor session
        if (!$supervisorSession) {
            $supervisorSession = EvaluationSession::create([
                'evaluation_form_id' => $evaluationFormId,
                'user_id' => Auth::id(),
                'evaluated_user_id' => $instructorId,
                'session_type' => 'supervisor',
                'response_type' => 'supervisor',
                'status' => 'in_progress',
                'supervisor_status' => 'in_progress',
                'started_at' => now(),
            ]);
        } elseif ($supervisorSession->supervisor_status === 'not_evaluated') {
            $supervisorSession->update([
                'supervisor_status' => 'in_progress',
                'started_at' => now(),
            ]);
        }

        // Get existing supervisor responses for this instructor
        $existingResponses = EvaluationResponse::where('evaluation_form_id', $evaluationFormId)
            ->where('user_id', Auth::id()) // Current supervisor
            ->where('evaluated_user_id', $instructorId) // Instructor being evaluated
            ->where('response_type', 'supervisor')
            ->get()
            ->keyBy('competency_element_id');

        return Inertia::render('supervisor/evaluations/take', [
            'evaluationForm' => [
                'id' => $evaluationForm->id,
                'title' => $evaluationForm->title,
                'description' => $evaluationForm->description,
                'designation' => $evaluationForm->designation,
                'office' => $evaluationForm->office,
                'division' => $evaluationForm->division,
                'period_covered' => $evaluationForm->period_covered,
                'competencyUnits' => $evaluationForm->competencyUnits->map(function ($unit) {
                    return [
                        'id' => $unit->id,
                        'title' => $unit->title,
                        'description' => $unit->description,
                        'order_index' => $unit->order_index,
                        'elements' => $unit->elements->map(function ($element) {
                            return [
                                'id' => $element->id,
                                'description' => $element->description,
                                'order_index' => $element->order_index,
                            ];
                        }),
                    ];
                }),
                'ratingCriteria' => $evaluationForm->ratingCriteria,
                'ratingScaleDescriptions' => $evaluationForm->ratingScaleDescriptions,
            ],
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'specialization' => $instructor->instructorProfile->specialization ?? 'N/A',
                'certification_level' => $instructor->instructorProfile->certification_level ?? 'N/A',
            ],
            'existingResponses' => $existingResponses,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('supervisor.dashboard')],
                ['label' => 'Evaluations', 'url' => route('supervisor.evaluations.index')],
                ['label' => $evaluationForm->title, 'url' => route('supervisor.evaluations.select-instructor', $evaluationFormId)],
                ['label' => "Evaluating {$instructor->name}", 'url' => null],
            ],
        ]);
    }

    public function storeResponses(Request $request, $id)
    {
        $request->validate([
            'responses' => 'required|array',
            'responses.*.competency_element_id' => 'required|exists:competency_elements,id',
            'responses.*.criticality_rating' => 'nullable|integer|min:1|max:3',
            'responses.*.competence_rating' => 'nullable|integer|min:1|max:4',
            'responses.*.frequency_rating' => 'nullable|integer|min:1|max:3',
            'evaluated_user_id' => 'nullable|exists:users,id', // For supervisor evaluations
            'response_type' => 'required|in:self,supervisor',
        ]);

        try {
            DB::beginTransaction();

            $evaluatedUserId = $request->input('evaluated_user_id');
            $responseType = $request->input('response_type');
            $responses = [];

            // Create or get evaluation session
            $evaluationSession = EvaluationSession::firstOrCreate([
                'evaluation_form_id' => $id,
                'user_id' => Auth::id(),
                'evaluated_user_id' => $evaluatedUserId,
                'session_type' => $responseType,
            ], [
                'status' => 'not_started',
                'total_elements' => 0,
                'completed_elements' => 0,
                'completion_percentage' => 0.00,
            ]);

            foreach ($request->responses as $responseData) {
                if (!empty($responseData['criticality_rating']) || 
                    !empty($responseData['competence_rating']) || 
                    !empty($responseData['frequency_rating'])) {
                    
                    // Create or update response
                    $response = EvaluationResponse::updateOrCreate([
                        'evaluation_form_id' => $id,
                        'user_id' => Auth::id(),
                        'competency_element_id' => $responseData['competency_element_id'],
                        'evaluated_user_id' => $evaluatedUserId,
                        'response_type' => $responseType,
                    ], [
                        'criticality_rating' => $responseData['criticality_rating'],
                        'competence_rating' => $responseData['competence_rating'],
                        'frequency_rating' => $responseData['frequency_rating'],
                    ]);

                    // Calculate CPR score
                    $response->calculateCPR();
                    $response->save();

                    $responses[] = $response;
                }
            }

            // Update evaluation session completion status
            $evaluationSession->updateCompletionStatus();
            
            // If this is a supervisor evaluation, update supervisor_status
            if ($responseType === 'supervisor') {
                $evaluationSession->update([
                    'supervisor_status' => 'completed',
                    'completed_at' => now(),
                ]);
            }

            // Process supervisor priority logic
            if ($responseType === 'supervisor' && $evaluatedUserId) {
                $this->processSupervisorPriority($id, $evaluatedUserId, Auth::id());
            }

            DB::commit();

            Log::info('Evaluation responses saved successfully', [
                'evaluation_form_id' => $id,
                'user_id' => Auth::id(),
                'evaluated_user_id' => $evaluatedUserId,
                'response_type' => $responseType,
                'responses_count' => count($responses),
                'session_id' => $evaluationSession->id,
                'completion_percentage' => $evaluationSession->completion_percentage,
            ]);

            // Return appropriate redirect based on user type
            if (request()->routeIs('instructor.*')) {
                return redirect()->route('instructor.dashboard')
                    ->with('message', 'Evaluation responses saved successfully!');
            } elseif (request()->routeIs('supervisor.*')) {
                return redirect()->route('supervisor.dashboard')
                    ->with('message', 'Evaluation responses saved successfully!');
            } else {
                return redirect()->back()
                    ->with('message', 'Evaluation responses saved successfully!');
            }

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Log the error for debugging
            Log::error('Failed to save evaluation responses', [
                'user_id' => Auth::id(),
                'evaluation_form_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => [
                    'responses' => $request->responses,
                    'evaluated_user_id' => $request->evaluated_user_id,
                    'response_type' => $request->response_type,
                ]
            ]);
            
            // Return appropriate redirect with error message based on user type
            if (request()->routeIs('instructor.*')) {
                return redirect()->back()
                    ->withErrors(['error' => 'Failed to save evaluation responses. Please try again.']);
            } elseif (request()->routeIs('supervisor.*')) {
                return redirect()->back()
                    ->withErrors(['error' => 'Failed to save evaluation responses. Please try again.']);
            } else {
                return redirect()->back()
                    ->withErrors(['error' => 'Failed to save evaluation responses. Please try again.']);
            }
        }
    }

    /**
     * Process supervisor priority logic - supervisor rating overrides instructor rating
     */
    private function processSupervisorPriority($evaluationFormId, $instructorId, $supervisorId)
    {
        // Get all supervisor responses for this evaluation
        $supervisorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $evaluationFormId,
            'user_id' => $supervisorId,
            'evaluated_user_id' => $instructorId,
            'response_type' => 'supervisor',
        ])->get();

        foreach ($supervisorResponses as $supervisorResponse) {
            // Find corresponding instructor self-rating
            $instructorResponse = EvaluationResponse::where([
                'evaluation_form_id' => $evaluationFormId,
                'user_id' => $instructorId,
                'competency_element_id' => $supervisorResponse->competency_element_id,
                'response_type' => 'self',
            ])->first();

            if ($instructorResponse) {
                // Create final response using supervisor ratings (supervisor priority)
                $finalResponse = EvaluationResponse::updateOrCreate([
                    'evaluation_form_id' => $evaluationFormId,
                    'user_id' => $instructorId,
                    'competency_element_id' => $supervisorResponse->competency_element_id,
                    'evaluated_user_id' => null,
                    'response_type' => 'final',
                ], [
                    'criticality_rating' => $supervisorResponse->criticality_rating,
                    'competence_rating' => $supervisorResponse->competence_rating,
                    'frequency_rating' => $supervisorResponse->frequency_rating,
                ]);

                $finalResponse->calculateCPR();
                $finalResponse->save();
            }
        }
    }

    /**
     * Get instructors for supervisor evaluation selection
     */
    public function getInstructors()
    {
        $instructors = User::whereHas('instructorProfile')->with('instructorProfile')->get();
        
        return response()->json($instructors->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'specialization' => $user->instructorProfile->specialization ?? 'N/A',
                'certification_level' => $user->instructorProfile->certification_level ?? 'N/A',
            ];
        }));
    }

    /**
     * Show comparison results between instructor self-rating and supervisor rating
     */
    public function showComparisonResults($evaluationFormId, $instructorId)
    {
        $evaluationForm = EvaluationForm::with([
            'competencyUnits.elements'
        ])->findOrFail($evaluationFormId);

        $instructor = User::with('instructorProfile')->findOrFail($instructorId);

        // Get all responses for comparison
        $instructorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $evaluationFormId,
            'user_id' => $instructorId,
            'response_type' => 'self',
        ])->get()->keyBy('competency_element_id');

        $supervisorResponses = EvaluationResponse::where([
            'evaluation_form_id' => $evaluationFormId,
            'evaluated_user_id' => $instructorId,
            'response_type' => 'supervisor',
        ])->get()->keyBy('competency_element_id');

        $finalResponses = EvaluationResponse::where([
            'evaluation_form_id' => $evaluationFormId,
            'user_id' => $instructorId,
            'response_type' => 'final',
        ])->get()->keyBy('competency_element_id');

        // Build comparison data
        $comparisons = [];
        foreach ($evaluationForm->competencyUnits as $unit) {
            foreach ($unit->elements as $element) {
                $selfResponse = $instructorResponses->get($element->id);
                $supervisorResponse = $supervisorResponses->get($element->id);
                $finalResponse = $finalResponses->get($element->id);

                // Determine rating difference
                $ratingDifference = 'missing_data';
                if ($selfResponse && $supervisorResponse) {
                    $selfCpr = $selfResponse->cpr_score;
                    $supervisorCpr = $supervisorResponse->cpr_score;
                    
                    if ($selfCpr && $supervisorCpr) {
                        if (abs($selfCpr - $supervisorCpr) <= 2) {
                            $ratingDifference = 'match';
                        } elseif ($selfCpr > $supervisorCpr) {
                            $ratingDifference = 'higher_self';
                        } else {
                            $ratingDifference = 'higher_supervisor';
                        }
                    }
                }

                $comparisons[] = [
                    'competency_element_id' => $element->id,
                    'element_title' => $element->title ?? 'Element',
                    'element_description' => $element->description,
                    'unit_title' => $unit->title,
                    'self_criticality' => $selfResponse?->criticality_rating,
                    'self_competence' => $selfResponse?->competence_rating,
                    'self_frequency' => $selfResponse?->frequency_rating,
                    'self_cpr' => $selfResponse?->cpr_score,
                    'supervisor_criticality' => $supervisorResponse?->criticality_rating,
                    'supervisor_competence' => $supervisorResponse?->competence_rating,
                    'supervisor_frequency' => $supervisorResponse?->frequency_rating,
                    'supervisor_cpr' => $supervisorResponse?->cpr_score,
                    'final_cpr' => $finalResponse?->cpr_score ?? $supervisorResponse?->cpr_score ?? $selfResponse?->cpr_score,
                    'needs_training' => $finalResponse?->needs_training ?? $supervisorResponse?->needs_training ?? $selfResponse?->needs_training ?? false,
                    'rating_difference' => $ratingDifference,
                ];
            }
        }

        return Inertia::render('supervisor/evaluations/comparison', [
            'evaluationForm' => $evaluationForm,
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'specialization' => $instructor->instructorProfile->specialization ?? 'N/A',
                'certification_level' => $instructor->instructorProfile->certification_level ?? 'N/A',
            ],
            'comparisons' => $comparisons,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('supervisor.dashboard')],
                ['label' => 'Evaluations', 'url' => route('supervisor.evaluations.index')],
                ['label' => $evaluationForm->title, 'url' => route('supervisor.evaluations.select-instructor', $evaluationFormId)],
                ['label' => "Results: {$instructor->name}", 'url' => null],
            ],
        ]);
    }
}
