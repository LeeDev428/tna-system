<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Roles\Admin;
use App\Models\Roles\Supervisor;
use App\Models\Roles\Instructor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EvaluationSystemUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Create admin users
            $this->createAdminUsers();
            
            // Create supervisor users
            $this->createSupervisorUsers();
            
            // Create instructor users
            $this->createInstructorUsers();
            
            DB::commit();
            
            $this->command->info('Evaluation system users seeded successfully!');
            
        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error seeding evaluation system users: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Create admin users
     */
    private function createAdminUsers()
    {
        // Create main admin user
        $adminUser = User::create([
            'name' => 'TESDA Administrator',
            'email' => 'admin@tesda.gov.ph',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'user_id' => $adminUser->id,
            'department' => 'ICT Training Department',
            'permissions' => [
                'manage_evaluations',
                'view_reports',
                'manage_users',
                'system_admin'
            ]
        ]);

        // Create secondary admin
        $admin2User = User::create([
            'name' => 'Maria Santos',
            'email' => 'maria.santos@tesda.gov.ph',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'user_id' => $admin2User->id,
            'department' => 'Quality Assurance',
            'permissions' => [
                'manage_evaluations',
                'view_reports',
                'manage_assessments'
            ]
        ]);
    }
    
    /**
     * Create supervisor users
     */
    private function createSupervisorUsers()
    {
        $supervisors = [
            // [
            //     'name' => 'Juan Dela Cruz',
            //     'email' => 'juan.delacruz@tesda.gov.ph',
            //     'department' => 'Computer Hardware Servicing',
            // ],
            // [
            //     'name' => 'Ana Reyes',
            //     'email' => 'ana.reyes@tesda.gov.ph',
            //     'department' => 'ICT Training',
            // ],
            // [
            //     'name' => 'Roberto Garcia',
            //     'email' => 'roberto.garcia@tesda.gov.ph',
            //     'department' => 'Technical Training',
            // ],
        ];

        foreach ($supervisors as $supervisorData) {
            $user = User::create([
                'name' => $supervisorData['name'],
                'email' => $supervisorData['email'],
                'password' => Hash::make('supervisor123'),
                'email_verified_at' => now(),
            ]);

            Supervisor::create([
                'user_id' => $user->id,
                'department' => $supervisorData['department'],
                'assigned_instructors' => [], // Empty initially
            ]);
        }
    }
    
    /**
     * Create instructor users
     */
    private function createInstructorUsers()
    {
        $instructors = [
            [
                'name' => 'Michael Torres',
                'email' => 'michael.torres@tesda.gov.ph',
                'specialization' => 'Hardware Assembly and Testing',
                'certification_level' => 'NC II Certified',
                'hire_date' => '2019-01-10',
            ],
            [
                'name' => 'Jennifer Lim',
                'email' => 'jennifer.lim@tesda.gov.ph',
                'specialization' => 'System Troubleshooting and Repair',
                'certification_level' => 'NC III Certified',
                'hire_date' => '2020-08-15',
            ],
            [
                'name' => 'Carlos Mendoza',
                'email' => 'carlos.mendoza@tesda.gov.ph',
                'specialization' => 'Preventive and Corrective Maintenance',
                'certification_level' => 'Master Trainer',
                'hire_date' => '2016-11-20',
            ],
            [
                'name' => 'Sarah Villanueva',
                'email' => 'sarah.villanueva@tesda.gov.ph',
                'specialization' => 'Network Setup and Configuration',
                'certification_level' => 'NC II Certified',
                'hire_date' => '2019-07-05',
            ],
            [
                'name' => 'Raymond Cruz',
                'email' => 'raymond.cruz@tesda.gov.ph',
                'specialization' => 'Quality Standards and Safety Procedures',
                'certification_level' => 'NC II Certified',
                'hire_date' => '2021-04-12',
            ],
        ];

        // Get supervisor IDs for assignment
        $supervisors = Supervisor::all();
        
        foreach ($instructors as $index => $instructorData) {
            $user = User::create([
                'name' => $instructorData['name'],
                'email' => $instructorData['email'],
                'password' => Hash::make('instructor123'),
                'email_verified_at' => now(),
            ]);

            Instructor::create([
                'user_id' => $user->id,
                'supervisor_id' => $supervisors[$index % count($supervisors)]->id ?? null, // Assign supervisors cyclically
                'specialization' => $instructorData['specialization'],
                'certification_level' => $instructorData['certification_level'],
                'hire_date' => $instructorData['hire_date'],
            ]);
        }
    }
}
