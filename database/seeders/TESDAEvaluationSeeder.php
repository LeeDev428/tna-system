<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EvaluationForm;
use App\Models\CompetencyUnit;
use App\Models\CompetencyElement;
use App\Models\RatingCriteria;
use App\Models\RatingScaleDescription;
use Illuminate\Support\Facades\DB;

class TESDAEvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Create the main TESDA evaluation form
            $evaluationForm = EvaluationForm::create([
                'title' => 'TNA Individual Assessment Form (TIAF)',
                'description' => 'Training Needs Analysis Individual Assessment Form - Computer Hardware Servicing NC II',
                'designation' => 'Computer Hardware Servicing Technician',
                'office' => 'Technical Education and Skills Development Authority',
                'division' => 'Information and Communications Technology',
                'period_covered' => '2025',
                'is_active' => true,
                'created_by' => 1, // Assuming admin user ID 1 exists
            ]);

            // Create rating scale descriptions
            $this->createRatingScaleDescriptions($evaluationForm->id);
            
            // Create rating criteria
            $this->createRatingCriteria($evaluationForm->id);
            
            // Create competency units and their elements
            $this->createCompetencyUnitsAndElements($evaluationForm->id);
            
            DB::commit();
            
            $this->command->info('TESDA evaluation form seeded successfully!');
            
        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error('Error seeding TESDA evaluation form: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Create rating scale descriptions
     */
    private function createRatingScaleDescriptions($evaluationFormId)
    {
        // Criticality to Job Scale (1-3)
        RatingScaleDescription::create([
            'evaluation_form_id' => $evaluationFormId,
            'scale_type' => 'criticality',
            'descriptions' => [
                '1' => 'Not critical - can be performed by others or is not essential to job performance',
                '2' => 'Important - contributes to job effectiveness but not absolutely essential',
                '3' => 'Critical - essential to job performance and cannot be performed by others'
            ]
        ]);

        // Level of Competence Scale (1-4)
        RatingScaleDescription::create([
            'evaluation_form_id' => $evaluationFormId,
            'scale_type' => 'competence_level',
            'descriptions' => [
                '1' => 'Cannot perform - no knowledge or skill in this area',
                '2' => 'Can perform with close supervision - limited knowledge/skill',
                '3' => 'Can perform with minimal supervision - adequate knowledge/skill',
                '4' => 'Can perform independently - advanced knowledge/skill'
            ]
        ]);

        // Frequency of Utilization Scale (1-3)
        RatingScaleDescription::create([
            'evaluation_form_id' => $evaluationFormId,
            'scale_type' => 'frequency',
            'descriptions' => [
                '1' => 'Seldom - performed rarely or occasionally',
                '2' => 'Often - performed regularly as part of normal duties',
                '3' => 'Always - performed constantly or very frequently'
            ]
        ]);
    }
    
    /**
     * Create rating criteria
     */
    private function createRatingCriteria($evaluationFormId)
    {
        RatingCriteria::create([
            'evaluation_form_id' => $evaluationFormId,
            'type' => 'criticality',
            'label' => 'Criticality to Job',
            'scale_options' => ['1', '2', '3'],
            'order_index' => 1
        ]);

        RatingCriteria::create([
            'evaluation_form_id' => $evaluationFormId,
            'type' => 'competence_level',
            'label' => 'Level of Competence',
            'scale_options' => ['1', '2', '3', '4'],
            'order_index' => 2
        ]);

        RatingCriteria::create([
            'evaluation_form_id' => $evaluationFormId,
            'type' => 'frequency',
            'label' => 'Frequency of Utilization',
            'scale_options' => ['1', '2', '3'],
            'order_index' => 3
        ]);
    }
    
    /**
     * Create all competency units and their elements
     */
    private function createCompetencyUnitsAndElements($evaluationFormId)
    {
        $competencyData = $this->getCompetencyData();
        
        foreach ($competencyData as $unitIndex => $unitData) {
            $unit = CompetencyUnit::create([
                'evaluation_form_id' => $evaluationFormId,
                'title' => $unitData['title'],
                'description' => $unitData['description'],
                'order_index' => $unitIndex + 1
            ]);
            
            foreach ($unitData['elements'] as $elementIndex => $elementDescription) {
                CompetencyElement::create([
                    'competency_unit_id' => $unit->id,
                    'description' => $elementDescription,
                    'order_index' => $elementIndex + 1
                ]);
            }
        }
    }
    
    /**
     * Get the complete TESDA competency data based on the assessment form
     */
    private function getCompetencyData()
    {
        return [
            [
                'title' => 'Work effectively in workplace',
                'description' => 'This unit covers working effectively in workplace environment including vocational education and training roles/context.',
                'elements' => [
                    'Work within the training organisation\'s quality framework',
                    'Manage work and work responsibilities',
                    'Demonstrate a commitment to ongoing professional development',
                ]
            ],
            [
                'title' => 'Participate in workplace communication',
                'description' => 'This unit covers participation in workplace communication processes.',
                'elements' => [
                    'Obtain and convey workplace information',
                    'Participate in workplace meetings and discussions',
                    'Participate in workplace team and group activities',
                    'Exercise team and group role and function',
                ]
            ],
            [
                'title' => 'Work in team environment',
                'description' => 'This unit covers working effectively in team environment.',
                'elements' => [
                    'Identify own role and team\'s objectives',
                    'Work as a team member',
                    'Deliver services to customers',
                    'Respond to customer inquiries',
                ]
            ],
            [
                'title' => 'Interact customers',
                'description' => 'This unit covers customer interaction and service delivery.',
                'elements' => [
                    'Document the services delivered to customers',
                    'Refer customers\' special requirements to appropriate personnel',
                ]
            ],
            [
                'title' => 'Implement quality standards and procedures',
                'description' => 'This unit covers implementation of quality standards and procedures.',
                'elements' => [
                    'Review standards and procedures',
                    'Apply quality standards and procedures to work and projects',
                    'Monitors the implementation of organisational quality standards and objectives',
                    'Support the implementation of continuous improvement process',
                ]
            ],
            [
                'title' => 'Promote programs and services',
                'description' => 'This unit covers promotion of programs and services.',
                'elements' => [
                    'Develop marketing plan',
                    'Implement marketing plan',
                    'Identify current\'s training needs',
                    'Research market demand',
                ]
            ],
            [
                'title' => 'Plan training session',
                'description' => 'This unit covers planning of training sessions.',
                'elements' => [
                    'Prepare session plans',
                    'Prepare instructional materials',
                    'Organise physical resources',
                    'Prepare assessment',
                    'Organise learning and teaching resources',
                    'Organise training facilities',
                ]
            ],
            [
                'title' => 'Facilitate learning session',
                'description' => 'This unit covers facilitation of learning sessions.',
                'elements' => [
                    'Conduct pre assessment',
                    'Facilitate training session',
                    'Use a range of presentation and communication techniques',
                    'Review delivery of education and training',
                    'Complete required documentation',
                ]
            ],
            [
                'title' => 'Supervise work-based learning',
                'description' => 'This unit covers supervision of work-based learning.',
                'elements' => [
                    'Requirements for trainees',
                    'Manage work-based learning and activities',
                    'Monitor trainee performance',
                ]
            ],
            [
                'title' => 'Conduct competency assessment',
                'description' => 'This unit covers conducting competency assessment.',
                'elements' => [
                    'Organise assessment schedule',
                    'Prepare the candidate',
                    'Gather evidence through appropriate assessment methods',
                    'Make assessment decisions',
                    'Record assessment',
                    'Provide feedback to candidates',
                    'Review assessment process',
                ]
            ],
            [
                'title' => 'Maintain training facilities',
                'description' => 'This unit covers maintenance of training facilities.',
                'elements' => [
                    'Prepare schedule of equipment housekeeping',
                    'Maintain training facilities',
                    'Document maintenance undertaken',
                    'Report defective equipment',
                ]
            ],
            [
                'title' => 'Utilize electronic media in training',
                'description' => 'This unit covers utilization of electronic media in training.',
                'elements' => [
                    'Locate electronic media resources',
                    'Maintain electronic media',
                ]
            ]
        ];
    }
}
