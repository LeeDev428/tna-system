<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EvaluationSession;
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

        return Inertia::render('supervisor/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Supervisor Dashboard', 'href' => route('supervisor.dashboard')],
            ],
        ]);
    }
}
