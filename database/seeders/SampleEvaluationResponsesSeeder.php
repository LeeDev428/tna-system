<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EvaluationForm;
use App\Models\CompetencyElement;
use App\Models\EvaluationResponse;
use App\Models\Roles\Instructor;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SampleEvaluationResponsesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Get the TESDA evaluation form
            $tesdaForm = EvaluationForm::where('title', 'TNA Individual Assessment Form (TIAF)')->first();
            
            if (!$tesdaForm) {
                $this->command->error('TESDA evaluation form not found. Please run TESDAEvaluationSeeder first.');
                return;
            }
            
            // Get all competency elements for this form
            $elements = CompetencyElement::whereHas('competencyUnit', function ($query) use ($tesdaForm) {
                $query->where('evaluation_form_id', $tesdaForm->id);
            })->get();
            
            // Get some instructors to create responses for
            $instructors = Instructor::with('user')->limit(3)->get();
            
            if ($instructors->count() == 0) {
                $this->command->error('No instructors found. Please run EvaluationSystemUsersSeeder first.');
                return;
            }
            
            // Create sample responses for each instructor
            foreach ($instructors as $instructor) {
                $this->createResponsesForUser($tesdaForm->id, $instructor->user->id, $elements);
            }
            
            DB::commit();
            
            $this->command->info('Sample evaluation responses seeded successfully!');
            $this->command->info('Created responses for ' . $instructors->count() . ' instructors across ' . $elements->count() . ' competency elements.');
            
        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error seeding sample evaluation responses: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Create evaluation responses for a specific user
     */
    private function createResponsesForUser($evaluationFormId, $userId, $elements)
    {
        foreach ($elements as $element) {
            // Generate realistic ratings based on competency type
            $ratings = $this->generateRealisticRatings($element->description);
            
            EvaluationResponse::create([
                'evaluation_form_id' => $evaluationFormId,
                'user_id' => $userId,
                'competency_element_id' => $element->id,
                'evaluated_user_id' => null, // Self evaluation
                'response_type' => 'self',
                'criticality_rating' => $ratings['criticality'],
                'competence_rating' => $ratings['competence'],
                'frequency_rating' => $ratings['frequency'],
            ]);
        }
    }
    
    /**
     * Generate realistic ratings based on competency element content
     */
    private function generateRealisticRatings($elementDescription)
    {
        $description = strtolower($elementDescription);
        
        // Initialize with default ratings
        $criticality = 2; // Important by default
        $competence = 3;  // Can perform with minimal supervision
        $frequency = 2;   // Often performed
        
        // Adjust ratings based on keywords in description
        
        // Critical tasks (high criticality)
        if (str_contains($description, 'safety') || 
            str_contains($description, 'test') || 
            str_contains($description, 'diagnose') ||
            str_contains($description, 'quality')) {
            $criticality = 3; // Critical
        }
        
        // Basic planning tasks (lower criticality but still important)
        if (str_contains($description, 'plan') || 
            str_contains($description, 'prepare') ||
            str_contains($description, 'document')) {
            $criticality = 2; // Important
        }
        
        // Access/information tasks (lower criticality)
        if (str_contains($description, 'access') || 
            str_contains($description, 'information')) {
            $criticality = 1; // Not critical - others can do this
        }
        
        // Complex technical tasks (higher competence required)
        if (str_contains($description, 'troubleshoot') || 
            str_contains($description, 'diagnose') ||
            str_contains($description, 'configure') ||
            str_contains($description, 'install')) {
            $competence = mt_rand(3, 4); // Advanced skills needed
        }
        
        // Basic maintenance tasks
        if (str_contains($description, 'routine') || 
            str_contains($description, 'preventive') ||
            str_contains($description, 'clean')) {
            $competence = mt_rand(2, 3); // Adequate to good skills
            $frequency = 3; // Always performed
        }
        
        // Documentation and reporting tasks
        if (str_contains($description, 'document') || 
            str_contains($description, 'report')) {
            $competence = mt_rand(2, 4); // Varies by person
            $frequency = mt_rand(1, 2); // Seldom to often
        }
        
        // Planning tasks are done frequently
        if (str_contains($description, 'plan') || 
            str_contains($description, 'schedule')) {
            $frequency = mt_rand(2, 3); // Often to always
        }
        
        // Emergency/corrective tasks are done seldom
        if (str_contains($description, 'corrective') || 
            str_contains($description, 'defective') ||
            str_contains($description, 'malfunction')) {
            $frequency = 1; // Seldom
        }
        
        // Add some randomness but keep it realistic
        $criticality = max(1, min(3, $criticality + mt_rand(-1, 1)));
        $competence = max(1, min(4, $competence + mt_rand(-1, 1)));
        $frequency = max(1, min(3, $frequency + mt_rand(-1, 1)));
        
        return [
            'criticality' => $criticality,
            'competence' => $competence,
            'frequency' => $frequency,
        ];
    }
}
