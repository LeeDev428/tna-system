<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\EvaluationSession;
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

        return Inertia::render('instructor/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Instructor Dashboard', 'href' => route('instructor.dashboard')],
            ],
        ]);
    }
}
