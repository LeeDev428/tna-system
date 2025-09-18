<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EvaluationSession;
use App\Models\EvaluationResponse;
use App\Models\CompetencyUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the supervisor dashboard.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $supervisorId = $user->id;
        
        // Get statistics for supervisor dashboard
        $stats = [
            // Count instructors assigned to this supervisor
            'assigned_instructors' => User::where('role', User::ROLE_INSTRUCTOR)
                ->where('is_active', true)
                ->whereHas('instructorProfile', function($query) use ($supervisorId) {
                    $query->where('supervisor_id', $supervisorId);
                })
                ->count(),
            
            // Count pending evaluations where supervisor hasn't completed evaluation
            // These are supervisor evaluation sessions where status is not completed
            'pending_evaluations' => EvaluationSession::where('user_id', $supervisorId)
                ->where('session_type', 'supervisor')
                ->where('status', '!=', 'completed')
                ->count(),
            
            // Count completed evaluations by this supervisor
            'completed_evaluations' => EvaluationSession::where('user_id', $supervisorId)
                ->where('session_type', 'supervisor')
                ->where('status', 'completed')
                ->count(),
            
            // Total competency units available
            'total_units' => CompetencyUnit::count(),
        ];

        // Get instructors that this supervisor has evaluated
        $evaluatedInstructors = User::where('role', User::ROLE_INSTRUCTOR)
            ->where('is_active', true)
            ->whereHas('evaluationResponsesAsEvaluated', function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('response_type', 'supervisor');
            })
            ->with(['instructorProfile', 'evaluationResponsesAsEvaluated' => function($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('response_type', 'supervisor')
                      ->with('evaluationForm')
                      ->orderBy('created_at', 'desc');
            }])
            ->get()
            ->map(function ($instructor) {
                $latestEvaluation = $instructor->evaluationResponsesAsEvaluated->first();
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'specialization' => $instructor->instructorProfile->specialization ?? 'N/A',
                    'certification_level' => $instructor->instructorProfile->certification_level ?? 'N/A',
                    'last_evaluation_date' => $latestEvaluation ? $latestEvaluation->created_at->format('M d, Y') : 'N/A',
                    'evaluation_form_title' => $latestEvaluation && $latestEvaluation->evaluationForm ? $latestEvaluation->evaluationForm->title : 'N/A',
                ];
            });

        return Inertia::render('supervisor/dashboard', [
            'stats' => $stats,
            'evaluatedInstructors' => $evaluatedInstructors,
            'breadcrumbs' => [
                ['title' => 'Supervisor Dashboard', 'href' => route('supervisor.dashboard')],
            ],
        ]);
    }
}
