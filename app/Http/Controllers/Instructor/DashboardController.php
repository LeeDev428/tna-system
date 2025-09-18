<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\EvaluationSession;
use App\Models\EvaluationResponse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the instructor dashboard.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $instructorId = $user->id;
        
        // Get statistics for instructor dashboard
        $stats = [
            // Total evaluation sessions for this instructor (both self and supervisor evaluations)
            'my_evaluations' => EvaluationSession::where(function($query) use ($instructorId) {
                $query->where('user_id', $instructorId)->where('session_type', 'self')
                      ->orWhere('evaluated_user_id', $instructorId)->where('session_type', 'supervisor');
            })->count(),
            
            // Completed evaluations (both instructor and supervisor completed)
            'completed_evaluations' => EvaluationSession::where(function($query) use ($instructorId) {
                $query->where('user_id', $instructorId)->where('session_type', 'self')
                      ->orWhere('evaluated_user_id', $instructorId)->where('session_type', 'supervisor');
            })->where('status', 'completed')->count(),
            
            // Pending evaluations (not completed)
            'pending_evaluations' => EvaluationSession::where(function($query) use ($instructorId) {
                $query->where('user_id', $instructorId)->where('session_type', 'self')
                      ->orWhere('evaluated_user_id', $instructorId)->where('session_type', 'supervisor');
            })->where('status', '!=', 'completed')->count(),
            
            // Experience years (calculate from hire_date if available, otherwise use a default)
            'experience_years' => $user->instructorProfile?->getExperienceYears() ?? 
                                  ($user->instructorProfile?->hire_date ? 
                                   Carbon::parse($user->instructorProfile->hire_date)->diffInYears(Carbon::now()) : 0),
        ];

        // Get supervisor who evaluated this instructor
        $evaluatingSupervisor = null;
        $latestSupervisorEvaluation = EvaluationResponse::where('evaluated_user_id', $instructorId)
            ->where('response_type', 'supervisor')
            ->with(['user.supervisorProfile', 'evaluationForm'])
            ->orderBy('created_at', 'desc')
            ->first();

        if ($latestSupervisorEvaluation && $latestSupervisorEvaluation->user) {
            $supervisor = $latestSupervisorEvaluation->user;
            $evaluatingSupervisor = [
                'id' => $supervisor->id,
                'name' => $supervisor->name,
                'email' => $supervisor->email,
                'department' => $supervisor->supervisorProfile->department ?? 'N/A',
                'last_evaluation_date' => $latestSupervisorEvaluation->created_at->format('M d, Y'),
                'evaluation_form_title' => $latestSupervisorEvaluation->evaluationForm ? $latestSupervisorEvaluation->evaluationForm->title : 'N/A',
                'total_evaluations_given' => EvaluationResponse::where('user_id', $supervisor->id)
                    ->where('response_type', 'supervisor')
                    ->distinct('evaluated_user_id')
                    ->count(),
            ];
        }

        return Inertia::render('instructor/dashboard', [
            'stats' => $stats,
            'evaluatingSupervisor' => $evaluatingSupervisor,
            'breadcrumbs' => [
                ['title' => 'Instructor Dashboard', 'href' => route('instructor.dashboard')],
            ],
        ]);
    }
}
