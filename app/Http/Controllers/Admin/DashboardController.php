<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CompetencyUnit;
use App\Models\CompetencyElement;
use App\Models\EvaluationSession;
use App\Models\TrainingNeed;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        // Get statistics for dashboard
        $stats = [
            'instructors' => User::where('role', User::ROLE_INSTRUCTOR)->where('is_active', true)->count(),
            'supervisors' => User::where('role', User::ROLE_SUPERVISOR)->where('is_active', true)->count(),
            'units' => CompetencyUnit::count(),
            'elements' => CompetencyElement::count(),
            'evaluations' => EvaluationSession::count(),
            'recommendations' => TrainingNeed::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Admin Dashboard', 'href' => route('admin.dashboard')],
            ],
        ]);
    }
}
