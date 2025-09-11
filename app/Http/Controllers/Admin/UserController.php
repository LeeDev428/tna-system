<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $users = User::with(['adminProfile', 'supervisorProfile', 'instructorProfile'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'breadcrumbs' => [
                ['title' => 'Admin Dashboard', 'href' => route('admin.dashboard')],
                ['title' => 'Manage Users', 'href' => route('admin.users.index')],
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'breadcrumbs' => [
                ['title' => 'Admin Dashboard', 'href' => route('admin.dashboard')],
                ['title' => 'Manage Users', 'href' => route('admin.users.index')],
                ['title' => 'Create User', 'href' => route('admin.users.create')],
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|in:supervisor,instructor',
            'department' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'certification_level' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt('password'), // Default password
            'role' => $validated['role'],
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create role-specific profile
        if ($validated['role'] === 'supervisor') {
            $user->supervisorProfile()->create([
                'department' => $validated['department'] ?? null,
                'assigned_instructors' => [],
            ]);
        } elseif ($validated['role'] === 'instructor') {
            $user->instructorProfile()->create([
                'supervisor_id' => null,
                'specialization' => $validated['specialization'] ?? null,
                'certification_level' => $validated['certification_level'] ?? null,
                'hire_date' => now(),
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully. Default password is "password".');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load(['adminProfile', 'supervisorProfile', 'instructorProfile']);

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'breadcrumbs' => [
                ['title' => 'Admin Dashboard', 'href' => route('admin.dashboard')],
                ['title' => 'Manage Users', 'href' => route('admin.users.index')],
                ['title' => $user->name, 'href' => route('admin.users.show', $user)],
            ],
        ]);
    }

    /**
     * Update the specified user's status.
     */
    public function toggleStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return redirect()->back()
            ->with('success', 'User status updated successfully.');
    }
}
