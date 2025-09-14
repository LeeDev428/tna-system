<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Roles\Admin;
use App\Models\Roles\Supervisor;
use App\Models\Roles\Instructor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'user_id' => $admin->id,
            'permissions' => ['manage_users', 'manage_units', 'manage_elements', 'view_reports'],
            'department' => 'Administration',
        ]);

        // Create Supervisor User
        $supervisor = User::create([
            'name' => 'Training Supervisor',
            'email' => 'supervisor@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SUPERVISOR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Supervisor::create([
            'user_id' => $supervisor->id,
            'department' => 'Training Department',
            'assigned_instructors' => [],
        ]);

        // Create Instructor User
        $instructor = User::create([
            'name' => 'Senior Instructor',
            'email' => 'instructor@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_INSTRUCTOR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Instructor::create([
            'user_id' => $instructor->id,
            'supervisor_id' => null, // Will be assigned later
            'specialization' => 'General Training',
            'certification_level' => 'Senior',
            'hire_date' => now()->subYears(2),
        ]);

        // Create additional test users
        // $supervisor2 = User::create([
        //     'name' => 'John Smith',
        //     'email' => 'john.supervisor@gmail.com',
        //     'password' => Hash::make('password'),
        //     'role' => User::ROLE_SUPERVISOR,
        //     'is_active' => true,
        //     'email_verified_at' => now(),
        // ]);

        // Supervisor::create([
        //     'user_id' => $supervisor2->id,
        //     'department' => 'Quality Assurance',
        //     'assigned_instructors' => [],
        // ]);

        $instructor2 = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane.instructor@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_INSTRUCTOR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Instructor::create([
            'user_id' => $instructor2->id,
            'supervisor_id' => null,
            'specialization' => 'Technical Training',
            'certification_level' => 'Junior',
            'hire_date' => now()->subMonths(6),
        ]);

        $instructor3 = User::create([
            'name' => 'Mike Johnson',
            'email' => 'mike.instructor@gmail.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_INSTRUCTOR,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Instructor::create([
            'user_id' => $instructor3->id,
            'supervisor_id' => null,
            'specialization' => 'Safety Training',
            'certification_level' => 'Expert',
            'hire_date' => now()->subYears(5),
        ]);

        echo "Seeded users with roles:\n";
        echo "Admin: admin@gmail.com (password: password)\n";
        echo "Supervisor: supervisor@gmail.com (password: password)\n";
        echo "Instructor: instructor@gmail.com (password: password)\n";
        echo "Additional users: john.supervisor@gmail.com, jane.instructor@gmail.com, mike.instructor@gmail.com\n";
    }
}
