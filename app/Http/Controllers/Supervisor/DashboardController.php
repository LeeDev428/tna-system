<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\User;
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
        
        // Get statistics for supervisor dashboard
        $stats = [
            'assigned_instructors' => $user->supervisorProfile?->getAssignedInstructorsCount() ?? 0,
            'pending_evaluations' => 0, // Will be populated when evaluations are implemented
            'completed_evaluations' => 0,
            'total_units' => 0, // Units managed by this supervisor
        ];

        return Inertia::render('supervisor/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Supervisor Dashboard', 'href' => route('supervisor.dashboard')],
            ],
        ]);
    }
}
