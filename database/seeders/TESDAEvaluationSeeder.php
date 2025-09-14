<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EvaluationForm;
use App\Models\CompetencyUnit;
use App\Models\CompetencyElement;
use App\Models\TrainingNeed;
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
            
            // Create training needs for each competency element
            $this->createTrainingNeeds();
            
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
                // Clean up the element description by removing line breaks and extra spaces
                $cleanedDescription = preg_replace('/\s+/', ' ', trim($elementDescription));
                
                CompetencyElement::create([
                    'competency_unit_id' => $unit->id,
                    'description' => $cleanedDescription, // Only use description, not title
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
                'title' => 'Work Effectively in Vocational Education and Training',
                'description' => 'This unit covers working effectively in workplace environment including vocational education and training roles/context.',
                'elements' => [
                    'Work within the
vocational education
and training policy
framework', 
                    'Work within the training
organization’s quality
framework',
                    'Manage work and work
relationships',
                ]
            ],
            [
                'title' => 'Participate in Workplace Communication',
                'description' => 'This unit covers participation in workplace communication processes.',
                'elements' => [
                    'Demonstrate a clientfocused approach to
work',
                    'Obtain and convey
workplace information',
                    'Complete relevant work',
                    'Participate in workplace
meetings',
                ]
            ],
            [
                'title' => 'Work in Team
Environment',
                'description' => 'This unit covers working effectively in team environment.',
                'elements' => [
                    'Describe team role and
scope',
                    'Identify own role and
responsibility as team
member.',
                    'Work as a team
member.',
                ]
            ],
            [
                'title' => 'Interact with Customers',
                'description' => 'This unit covers customer interaction and service delivery.',
                'elements' => [
                    'Deliver services to
customers',
                    'Respond to customer
complaints',
                    'Document services
delivered',
                'Identify customers\' special requirements',
                ]
            ],
            [
                'title' => 'Implement Quality Standards and Procedures',
                'description' => 'This unit covers implementation of quality standards and procedures.',
                'elements' => [
                    'Review standards and
procedures.',
                    'Deploy standards and
procedures.',
                    'Monitor
implementation',
                ]
            ],
            [
                'title' => 'Promote Programs and
Services',
                'description' => 'This unit covers promotion of programs and services.',
                'elements' => [
                    'Segment the market',
                    'Determine products &
services’ value
proposition',
                    'Develop marketing plan',
                    'Implement marketing
plan',
                ]
            ],
            [
                'title' => 'Plan Training Session',
                'description' => 'This unit covers planning of training sessions.',
                'elements' => [
                    'Identify learner’s
training requirements',
                    'Prepare session plans',
                    'Prepare instructional
materials',
                ]
            ],
            [
                'title' => 'Facilitate Training
Session',
                'description' => 'This unit covers facilitation of learning sessions.',
                'elements' => [
                    'Prepare training
facilities/resource.',
                    'Conduct pre- assessment',
                    'Facilitate training
session.',
                    'Review delivery of
training',
                ]
            ],
            [
                'title' => 'Supervise Work-Based
Learning',
                'description' => 'This unit covers supervision of work-based learning.',
                'elements' => [
                    'Establish training
requirements for
trainees',
                    'Review and evaluate
WBL activities',
                ]
            ],
            [
                'title' => 'Conduct Competency
Assessment',
                'description' => 'This unit covers conducting competency assessment.',
                'elements' => [
                    'Prepare candidate for
assessment',
                    'Gather evidence',
                    'Make assessment
decision',
                    'Record assessment
results',
                    'Provide feedback',
                ]
            ],
            [
                'title' => 'Maintain Training
Facilities',
                'description' => 'This unit covers maintenance of training facilities.',
                'elements' => [
                    'Plan maintenance
activities',
                    'Implement
housekeeping',
                    'Maintain training
equipment',
                    'Document maintenance',
                ]
            ],
            [
                'title' => 'Utilize Electronic Media in Training',
                'description' => 'This unit covers utilization of electronic media in training.',
                'elements' => [
                    'Operate electronic media',
                    'Maintain electronic media equipment',
                ]
            ],
            [
                'title' => 'Perform Computer Operations (Elective)',
                'description' => 'This unit covers performing computer operations including planning, inputting data, accessing information, producing output, and maintaining computer equipment and systems.',
                'elements' => [
                    'Plan & prepare task to be undertaken',
                    'Input data into computer',
                    'Access information using computer',
                    'Produce output/data using computer',
                    'Maintain computer equipment & systems',
                ]
            ],
            [
                'title' => 'Compile Records',
                'description' => 'This unit covers compiling records, updating information, and generating reports from the records system.',
                'elements' => [
                    'Collate records',
                    'Update information in records system',
                    'Generate reports from the record system',
                ]
            ],
            [
                'title' => 'Perform Clerical Procedures (Elective)',
                'description' => 'This unit covers performing clerical procedures such as processing office documents, drafting communications, and maintaining document filing systems.',
                'elements' => [
                    'Process office documents',
                    'Draft simple communication',
                    'Maintain document filing system',
                ]
            ],
        ];
    }

    /**
     * Create training needs for each competency element
     */
    private function createTrainingNeeds(): void
    {
        // Exact training needs mapping from the 6 images provided
        $trainingNeedsMap = [
            // Unit 1: Work Effectively in Vocational Education and Training
            'Work within the vocational education and training policy framework' => 'Training on TESDA Policies & Quality Standards',
            'Work within the training organisation\'s quality framework' => 'Training on Organizational Quality Assurance',  
            'Manage work and work relationships' => 'Training on Workplace Relationship & Management',

            // Unit 2: Participate in Workplace Communication  
            'Demonstrate a client-focused approach to work' => 'Customer Service Skills Training',
            'Obtain and convey workplace information' => 'Workplace Communication Skills',
            'Complete relevant work' => 'Work Documentation & Reporting',

            // Unit 3: Work in Team Environment
            'Participate in workplace meetings' => 'Effective Meeting Participation',
            'Describe team role and scope' => 'Team Role Familiarization Workshop',
            'Identify own role and responsibility as team member' => 'Workplace Roles & Accountability',
            'Work as a team member' => 'Team Building & Collaboration Training',

            // Unit 4: Interact with Customers
            'Deliver services to customers' => 'Service Delivery Skills Training',
            'Respond to customer complaints' => 'Customer Complaint Handling',
            'Document services delivered' => 'Service Documentation & Reporting',
            'Identify customers\' special requirements' => 'Needs Analysis Training',

            // Unit 5: Implement Quality Standards and Procedures
            'Review standards and procedures' => 'QA/QC Familiarization',
            'Deploy standards and procedures' => 'Implementation of Standards',
            'Monitor implementation' => 'Monitoring & Evaluation Training',

            // Unit 6: Promote Programs and Services
            'Segment the market' => 'Market Segmentation Training',
            'Determine products & services\' value proposition' => 'Marketing Value Proposition Workshop',
            'Develop marketing plan' => 'Marketing Plan Development',
            'Implement marketing plan' => 'Marketing Plan Execution',

            // Unit 7: Plan Training Session
            'Identify learner\'s training requirements' => 'Training Needs Analysis (TNA) Workshop',
            'Prepare session plans' => 'Session Planning Workshop',
            'Prepare instructional materials' => 'Instructional Material Development',

            // Unit 8: Facilitate Training Session
            'Prepare training facilities/resource' => 'Training Resource Management',
            'Conduct pre-assessment' => 'Assessment Preparation Training',
            'Facilitate training session' => 'Facilitation Skills Training',
            'Review delivery of training' => 'Delivery Evaluation Workshop',

            // Unit 9: Supervise Work-Based Learning
            'Establish training requirements for trainees' => 'WBL Monitoring Training',
            'Review and evaluate WBL activities' => 'WBL Evaluation Workshop',

            // Unit 10: Conduct Competency Assessment
            'Prepare candidate for assessment' => 'Assessment Preparation Skills',
            'Gather evidence' => 'Evidence Collection & Portfolio Building',
            'Make assessment decision' => 'Decision-Making in Competency Assessment',
            'Record assessment results' => 'Assessment Documentation',
            'Provide feedback' => 'Assessment Feedback Skills',

            // Unit 11: Maintain Training Facilities
            'Plan maintenance activities' => 'Training Facility Maintenance',
            'Implement housekeeping' => 'Housekeeping Standards Training',
            'Maintain training equipment' => 'Equipment Maintenance Training',
            'Document maintenance' => 'Maintenance Recordkeeping',

            // Unit 12: Utilize Electronic Media in Training
            'Operate electronic media' => 'ICT in Education Training',
            'Maintain electronic media equipment' => 'ICT Equipment Maintenance',

            // Unit 13: Perform Computer Operations (Elective)
            'Plan & prepare task to be undertaken' => 'Task Planning Training',
            'Input data into computer' => 'Basic Computer Skills',
            'Access information using computer' => 'Digital Literacy Training',
            'Produce output/data using computer' => 'MS Office Productivity Training',
            'Maintain computer equipment & systems' => 'Basic Troubleshooting & Maintenance',

            // Unit 14: Compile Records
            'Collate records' => 'Records Management',
            'Update information in records system' => 'Database Updating Training',
            'Generate reports from the record system' => 'Report Writing Skills',

            // Unit 15: Perform Clerical Procedures (Elective)
            'Process office documents' => 'Document Processing Training',
            'Draft simple communication' => 'Business Communication Writing',
            'Maintain document filing system' => 'Records Filing & Archiving',
        ];

        $competencyElements = CompetencyElement::all();

        foreach ($competencyElements as $element) {
            $trainingNeed = null;
            
            // Clean the element description for better matching
            $cleanElementDescription = trim($element->description);
            
            // Find exact matching training need
            foreach ($trainingNeedsMap as $elementPattern => $trainingDescription) {
                // Try exact match first
                if (strtolower($cleanElementDescription) === strtolower(trim($elementPattern))) {
                    $trainingNeed = $trainingDescription;
                    break;
                }
                // Try partial matching
                if (stripos($cleanElementDescription, $elementPattern) !== false || 
                    stripos($elementPattern, $cleanElementDescription) !== false) {
                    $trainingNeed = $trainingDescription;
                    break;
                }
            }

            // If no match found, create a generic training need
            if (!$trainingNeed) {
                $trainingNeed = 'Specialized Training for ' . $cleanElementDescription;
            }

            TrainingNeed::create([
                'competency_element_id' => $element->id,
                'training_title' => $trainingNeed,
                'training_description' => 'Training program designed to address competency gaps in: ' . $cleanElementDescription,
                'training_type' => 'Professional Development',
                'duration_hours' => 16,
                'is_active' => true,
            ]);
        }
    }
}
