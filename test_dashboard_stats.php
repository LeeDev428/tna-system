<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->boot();

use App\Models\User;
use App\Models\CompetencyUnit;
use App\Models\CompetencyElement;
use App\Models\EvaluationSession;
use App\Models\TrainingNeed;

echo "=== Admin Dashboard Statistics ===\n";
echo "Instructors: " . User::where('role', 'instructor')->where('is_active', true)->count() . "\n";
echo "Supervisors: " . User::where('role', 'supervisor')->where('is_active', true)->count() . "\n";
echo "Units: " . CompetencyUnit::count() . "\n";
echo "Elements: " . CompetencyElement::count() . "\n";
echo "Evaluation Sessions: " . EvaluationSession::count() . "\n";
echo "Training Needs: " . TrainingNeed::where('is_active', true)->count() . "\n";

// Test one specific supervisor statistics
$supervisor = User::where('role', 'supervisor')->first();
if ($supervisor) {
    echo "\n=== Supervisor Dashboard Statistics (for supervisor ID: {$supervisor->id}) ===\n";
    
    $assignedInstructors = User::where('role', 'instructor')
        ->where('is_active', true)
        ->whereHas('instructorProfile', function($query) use ($supervisor) {
            $query->where('supervisor_id', $supervisor->id);
        })
        ->count();
    
    $pendingEvaluations = EvaluationSession::where('supervisor_id', $supervisor->id)
        ->where('supervisor_status', 'pending')
        ->count();
    
    $completedEvaluations = EvaluationSession::where('supervisor_id', $supervisor->id)
        ->where('supervisor_status', 'completed')
        ->count();
    
    echo "Assigned Instructors: " . $assignedInstructors . "\n";
    echo "Pending Evaluations: " . $pendingEvaluations . "\n";
    echo "Completed Evaluations: " . $completedEvaluations . "\n";
    echo "Total Units: " . CompetencyUnit::count() . "\n";
}

// Test one specific instructor statistics
$instructor = User::where('role', 'instructor')->first();
if ($instructor) {
    echo "\n=== Instructor Dashboard Statistics (for instructor ID: {$instructor->id}) ===\n";
    
    $myEvaluations = EvaluationSession::where('instructor_id', $instructor->id)->count();
    
    $completedEvaluations = EvaluationSession::where('instructor_id', $instructor->id)
        ->where('instructor_status', 'completed')
        ->where('supervisor_status', 'completed')
        ->count();
    
    $pendingEvaluations = EvaluationSession::where('instructor_id', $instructor->id)
        ->where(function($query) {
            $query->where('instructor_status', 'pending')
                  ->orWhere('supervisor_status', 'pending');
        })
        ->count();
    
    echo "My Evaluations: " . $myEvaluations . "\n";
    echo "Completed Evaluations: " . $completedEvaluations . "\n";
    echo "Pending Evaluations: " . $pendingEvaluations . "\n";
}
