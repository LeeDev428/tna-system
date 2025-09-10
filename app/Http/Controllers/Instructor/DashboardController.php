<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
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
        
        // Get statistics for instructor dashboard
        $stats = [
            'my_evaluations' => 0, // Evaluations assigned to this instructor
            'completed_evaluations' => 0,
            'pending_evaluations' => 0,
            'experience_years' => $user->instructorProfile?->getExperienceYears() ?? 0,
        ];

        return Inertia::render('instructor/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Instructor Dashboard', 'href' => route('instructor.dashboard')],
            ],
        ]);
    }
}
