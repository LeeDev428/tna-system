<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EvaluationForm;
use App\Models\CompetencyUnit;
use App\Models\CompetencyElement;
use App\Models\RatingCriteria;
use App\Models\RatingScaleDescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EvaluationFormController extends Controller
{
    public function index()
    {
        $evaluationForms = EvaluationForm::with(['createdBy', 'competencyUnits'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/evaluation_form/index', [
            'evaluationForms' => $evaluationForms,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'Evaluation Forms', 'url' => null],
            ],
        ]);
    }

    public function create()
    {
        // Default scale descriptions for the form
        $defaultScales = [
            'criticality' => [
                '4' => 'Highly competent',
                '3' => 'Competent',
                '2' => 'Slightly competent',
                '1' => 'Not competent'
            ],
            'competence_level' => [
                '4' => 'Always',
                '3' => 'Frequently',
                '2' => 'Occasionally',
                '1' => 'Rarely'
            ],
            'frequency' => [
                '4' => 'Highly important',
                '3' => 'Moderately important',
                '2' => 'Important',
                '1' => 'Slightly important'
            ]
        ];

        return Inertia::render('admin/evaluation_form/create', [
            'defaultScales' => $defaultScales,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'Evaluation Forms', 'url' => route('admin.evaluation-forms.index')],
                ['label' => 'Create', 'url' => null],
            ],
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Evaluation form store method called', ['data' => $request->all()]);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'designation' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
            'period_covered' => 'nullable|string|max:255',
            'competency_units' => 'required|array|min:1',
            'competency_units.*.title' => 'required|string|max:255',
            'competency_units.*.description' => 'nullable|string',
            'competency_units.*.elements' => 'required|array|min:1',
            'competency_units.*.elements.*.description' => 'required|string',
            'rating_criteria' => 'required|array|size:3',
            'scale_descriptions' => 'required|array|size:3',
        ]);

        try {
            DB::beginTransaction();
            Log::info('Starting database transaction');

            // Create evaluation form
            $evaluationForm = EvaluationForm::create([
                'title' => $request->title,
                'description' => $request->description,
                'designation' => $request->designation,
                'office' => $request->office,
                'division' => $request->division,
                'period_covered' => $request->period_covered,
                'is_active' => true,
                'created_by' => Auth::id(),
            ]);

            Log::info('Evaluation form created', ['form_id' => $evaluationForm->id]);

            // Create competency units and their elements
            foreach ($request->competency_units as $unitIndex => $unitData) {
                $unit = CompetencyUnit::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'title' => $unitData['title'],
                    'description' => $unitData['description'] ?? null,
                    'order_index' => $unitIndex,
                ]);

                Log::info('Competency unit created', ['unit_id' => $unit->id]);

                foreach ($unitData['elements'] as $elementIndex => $elementData) {
                    CompetencyElement::create([
                        'competency_unit_id' => $unit->id,
                        'description' => $elementData['description'],
                        'order_index' => $elementIndex,
                    ]);
                }
            }

            // Create rating criteria
            $criteriaTypes = ['criticality', 'competence_level', 'frequency'];
            foreach ($request->rating_criteria as $index => $criteriaData) {
                RatingCriteria::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'type' => $criteriaTypes[$index],
                    'label' => $criteriaData['label'],
                    'scale_options' => $criteriaData['scale_options'],
                    'order_index' => $index,
                ]);
            }

            // Create scale descriptions
            foreach ($request->scale_descriptions as $type => $descriptions) {
                RatingScaleDescription::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'scale_type' => $type,
                    'descriptions' => $descriptions,
                ]);
            }

            DB::commit();
            Log::info('Transaction committed successfully');

            return redirect()->route('admin.evaluation-forms.index')
                ->with('success', 'Evaluation form created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create evaluation form', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create evaluation form: ' . $e->getMessage()]);
        }
    }

    public function show(EvaluationForm $evaluationForm)
    {
        $evaluationForm->load([
            'competencyUnits.elements',
            'ratingCriteria',
            'ratingScaleDescriptions',
            'createdBy'
        ]);

        return Inertia::render('admin/evaluation_form/show', [
            'evaluationForm' => $evaluationForm,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'Evaluation Forms', 'url' => route('admin.evaluation-forms.index')],
                ['label' => $evaluationForm->title, 'url' => null],
            ],
        ]);
    }

    public function edit(EvaluationForm $evaluationForm)
    {
        $evaluationForm->load([
            'competencyUnits.elements',
            'ratingCriteria',
            'ratingScaleDescriptions'
        ]);

        return Inertia::render('admin/evaluation_form/update', [
            'evaluationForm' => $evaluationForm,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'Evaluation Forms', 'url' => route('admin.evaluation-forms.index')],
                ['label' => $evaluationForm->title, 'url' => route('admin.evaluation-forms.show', $evaluationForm)],
                ['label' => 'Edit', 'url' => null],
            ],
        ]);
    }

    public function update(Request $request, EvaluationForm $evaluationForm)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'designation' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'division' => 'nullable|string|max:255',
            'period_covered' => 'nullable|string|max:255',
            'competency_units' => 'required|array|min:1',
            'competency_units.*.title' => 'required|string|max:255',
            'competency_units.*.description' => 'nullable|string',
            'competency_units.*.elements' => 'required|array|min:1',
            'competency_units.*.elements.*.description' => 'required|string',
            'rating_criteria' => 'required|array|size:3',
            'scale_descriptions' => 'required|array|size:3',
        ]);

        try {
            DB::beginTransaction();

            // Update evaluation form
            $evaluationForm->update([
                'title' => $request->title,
                'description' => $request->description,
                'designation' => $request->designation,
                'office' => $request->office,
                'division' => $request->division,
                'period_covered' => $request->period_covered,
            ]);

            // Delete existing units, elements, criteria, and descriptions
            $evaluationForm->competencyUnits()->delete();
            $evaluationForm->ratingCriteria()->delete();
            $evaluationForm->ratingScaleDescriptions()->delete();

            // Recreate competency units and their elements
            foreach ($request->competency_units as $unitIndex => $unitData) {
                $unit = CompetencyUnit::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'title' => $unitData['title'],
                    'description' => $unitData['description'] ?? null,
                    'order_index' => $unitIndex,
                ]);

                foreach ($unitData['elements'] as $elementIndex => $elementData) {
                    CompetencyElement::create([
                        'competency_unit_id' => $unit->id,
                        'description' => $elementData['description'],
                        'order_index' => $elementIndex,
                    ]);
                }
            }

            // Recreate rating criteria
            $criteriaTypes = ['criticality', 'competence_level', 'frequency'];
            foreach ($request->rating_criteria as $index => $criteriaData) {
                RatingCriteria::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'type' => $criteriaTypes[$index],
                    'label' => $criteriaData['label'],
                    'scale_options' => $criteriaData['scale_options'],
                    'order_index' => $index,
                ]);
            }

            // Recreate scale descriptions
            foreach ($request->scale_descriptions as $type => $descriptions) {
                RatingScaleDescription::create([
                    'evaluation_form_id' => $evaluationForm->id,
                    'scale_type' => $type,
                    'descriptions' => $descriptions,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.evaluation-forms.index')
                ->with('success', 'Evaluation form updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update evaluation form: ' . $e->getMessage()]);
        }
    }

    public function destroy(EvaluationForm $evaluationForm)
    {
        try {
            $evaluationForm->delete();
            return redirect()->route('admin.evaluation-forms.index')
                ->with('success', 'Evaluation form deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete evaluation form: ' . $e->getMessage()]);
        }
    }

    /**
     * Show evaluation form responses with CPR calculations
     */
    public function showResponses(EvaluationForm $evaluationForm)
    {
        // Get all responses with user details and competency elements
        $responses = DB::table('evaluation_responses as er')
            ->join('users as u', 'er.user_id', '=', 'u.id')
            ->join('competency_elements as ce', 'er.competency_element_id', '=', 'ce.id')
            ->join('competency_units as cu', 'ce.competency_unit_id', '=', 'cu.id')
            ->leftJoin('users as evaluated_user', 'er.evaluated_user_id', '=', 'evaluated_user.id')
            ->where('er.evaluation_form_id', $evaluationForm->id)
            ->select(
                'er.*',
                'u.name as respondent_name',
                'evaluated_user.name as evaluated_name',
                'ce.description as element_description',
                'cu.title as unit_title',
                'cu.order_index as unit_order',
                'ce.order_index as element_order'
            )
            ->orderBy('cu.order_index')
            ->orderBy('ce.order_index')
            ->get();

        // Group responses by evaluation type and calculate CPR
        $responsesByUser = [];

        foreach ($responses as $response) {
            $key = $response->response_type === 'self' 
                ? 'instructor_' . $response->user_id 
                : 'supervisor_' . $response->user_id . '_evaluating_' . $response->evaluated_user_id;
            
            if (!isset($responsesByUser[$key])) {
                $responsesByUser[$key] = [
                    'type' => $response->response_type,
                    'respondent_name' => $response->respondent_name,
                    'evaluated_name' => $response->evaluated_name ?? $response->respondent_name,
                    'user_id' => $response->user_id,
                    'evaluated_user_id' => $response->evaluated_user_id,
                    'responses' => [],
                    'total_cpr' => 0,
                    'needs_training_count' => 0,
                ];
            }

            // Calculate CPR for this response
            $cpr = ($response->criticality_rating ?? 1) * 
                   ($response->competence_rating ?? 1) * 
                   ($response->frequency_rating ?? 1);
            
            $needsTraining = $cpr < 21;

            $responsesByUser[$key]['responses'][] = [
                'unit_title' => $response->unit_title,
                'element_description' => $response->element_description,
                'criticality_rating' => $response->criticality_rating,
                'competence_rating' => $response->competence_rating,
                'frequency_rating' => $response->frequency_rating,
                'cpr_score' => $cpr,
                'needs_training' => $needsTraining,
                'unit_order' => $response->unit_order,
                'element_order' => $response->element_order,
            ];

            $responsesByUser[$key]['total_cpr'] += $cpr;
            if ($needsTraining) {
                $responsesByUser[$key]['needs_training_count']++;
            }
        }

        // Calculate final scores using supervisor priority logic
        $finalScores = [];
        $instructorIds = [];
        
        foreach ($responsesByUser as $key => $data) {
            if ($data['type'] === 'self') {
                $instructorIds[] = $data['user_id'];
            }
        }

        foreach ($instructorIds as $instructorId) {
            $instructorKey = 'instructor_' . $instructorId;
            $supervisorKey = null;
            
            // Find supervisor evaluation for this instructor
            foreach ($responsesByUser as $key => $data) {
                if ($data['type'] === 'supervisor' && $data['evaluated_user_id'] == $instructorId) {
                    $supervisorKey = $key;
                    break;
                }
            }

            if ($supervisorKey && isset($responsesByUser[$supervisorKey])) {
                // Use supervisor ratings (supervisor priority)
                $finalScores[$instructorId] = [
                    'instructor_name' => $responsesByUser[$instructorKey]['respondent_name'],
                    'instructor_responses' => $responsesByUser[$instructorKey]['responses'],
                    'supervisor_responses' => $responsesByUser[$supervisorKey]['responses'],
                    'supervisor_name' => $responsesByUser[$supervisorKey]['respondent_name'],
                    'final_cpr' => $responsesByUser[$supervisorKey]['total_cpr'],
                    'needs_training_count' => $responsesByUser[$supervisorKey]['needs_training_count'],
                    'has_supervisor_evaluation' => true,
                ];
            } else if (isset($responsesByUser[$instructorKey])) {
                // Use instructor self-rating only
                $finalScores[$instructorId] = [
                    'instructor_name' => $responsesByUser[$instructorKey]['respondent_name'],
                    'instructor_responses' => $responsesByUser[$instructorKey]['responses'],
                    'supervisor_responses' => null,
                    'supervisor_name' => null,
                    'final_cpr' => $responsesByUser[$instructorKey]['total_cpr'],
                    'needs_training_count' => $responsesByUser[$instructorKey]['needs_training_count'],
                    'has_supervisor_evaluation' => false,
                ];
            }
        }

        return Inertia::render('admin/evaluation_form_view/index', [
            'evaluationForm' => $evaluationForm->load(['competencyUnits.elements']),
            'finalScores' => $finalScores,
            'breadcrumbs' => [
                ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
                ['label' => 'Evaluation Forms', 'url' => route('admin.evaluation_forms.index')],
                ['label' => 'View Responses', 'url' => null],
            ],
        ]);
    }
}
