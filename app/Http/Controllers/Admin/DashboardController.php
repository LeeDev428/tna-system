<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'units' => 0, // Will be populated when Units model is created
            'elements' => 0, // Will be populated when Elements model is created
            'evaluations' => 0, // Will be populated when Evaluations model is created
            'recommendations' => 0, // Will be populated when Recommendations model is created
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'breadcrumbs' => [
                ['title' => 'Admin Dashboard', 'href' => route('admin.dashboard')],
            ],
        ]);
    }
}
