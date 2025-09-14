import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { 
    FileText, 
    Save, 
    AlertCircle, 
    User, 
    CheckCircle2,
    ArrowLeft,
    Info
} from 'lucide-react';

interface CompetencyElement {
    id: number;
    description: string;
    order_index: number;
}

interface CompetencyUnit {
    id: number;
    title: string;
    description: string;
    order_index: number;
    elements: CompetencyElement[];
}

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    designation: string;
    office: string;
    division: string;
    period_covered: string;
    competencyUnits: CompetencyUnit[];
    ratingCriteria?: any[];
    ratingScaleDescriptions?: any[];
}

interface Instructor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    certification_level: string;
}

interface ExistingResponse {
    competency_element_id: number;
    criticality_rating: number;
    competence_rating: number;
    frequency_rating: number;
}

interface TakeEvaluationProps {
    evaluationForm: EvaluationForm;
    instructor: Instructor;
    existingResponses: { [key: number]: ExistingResponse };
    breadcrumbs: BreadcrumbItem[];
}

export default function TakeEvaluation({ evaluationForm, instructor, existingResponses, breadcrumbs }: TakeEvaluationProps) {
    const [responses, setResponses] = useState<{ [key: number]: { criticality: string; competence: string; frequency: string } }>({});

    const { post, processing } = useForm();

    // Add error checking for required props
    if (!evaluationForm || !instructor) {
        return (
            <SupervisorLayout breadcrumbs={breadcrumbs || []}>
                <Head title="Loading..." />
                <div className="max-w-7xl mx-auto">
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-6">
                            <h1 className="text-red-800 font-bold mb-2">Error Loading Evaluation</h1>
                            <p className="text-red-600">
                                Missing required data. Please go back and try again.
                            </p>
                            <Button 
                                onClick={() => window.history.back()} 
                                className="mt-4"
                                variant="outline"
                            >
                                Go Back
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </SupervisorLayout>
        );
    }

    // LocalStorage key for this form and instructor
    const storageKey = `supervisor_evaluation_${evaluationForm.id}_instructor_${instructor.id}_supervisor_${JSON.parse(document.querySelector('meta[name="user"]')?.getAttribute('content') || '{}').id || 'unknown'}`;

    // Save to localStorage whenever responses change
    const saveToLocalStorage = (newResponses: typeof responses) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newResponses));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    };

    // Load from localStorage
    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsedData = JSON.parse(saved);
                setResponses(parsedData);
                return parsedData;
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
        return {};
    };

    const handleInputChange = (elementId: number, ratingType: 'criticality' | 'competence' | 'frequency', value: string) => {
        const newResponses = {
            ...responses,
            [elementId]: {
                ...responses[elementId],
                [ratingType]: value
            }
        };
        setResponses(newResponses);
        saveToLocalStorage(newResponses);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formattedResponses = Object.entries(responses).map(([elementId, ratings]) => ({
            competency_element_id: parseInt(elementId),
            criticality_rating: parseInt(ratings.criticality) || null,
            competence_rating: parseInt(ratings.competence) || null,
            frequency_rating: parseInt(ratings.frequency) || null,
        })).filter(response => 
            response.criticality_rating || response.competence_rating || response.frequency_rating
        );

        if (formattedResponses.length === 0) {
            alert('Please fill in at least one evaluation response before submitting.');
            return;
        }

        // Submit with Inertia router post - supervisor version
        router.post(`/supervisor/evaluations/${evaluationForm.id}/responses`, {
            responses: formattedResponses,
            evaluated_user_id: instructor.id, // Important: This is who we're evaluating
            response_type: 'supervisor' // Important: This is supervisor rating
        }, {
            onStart: () => {
                // Clear localStorage on submission start
                try {
                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.warn('Failed to clear localStorage:', error);
                }
            },
            onError: (errors: any) => {
                console.error('Submission errors:', errors);
                alert('There was an error saving your evaluation. Please check your responses and try again.');
            }
        });
    };

    // Initialize responses from localStorage and existing data
    React.useEffect(() => {
        // First try to load from localStorage
        const savedResponses = loadFromLocalStorage();
        
        // Then merge with existing responses from server (server data takes priority)
        const initialResponses: { [key: number]: { criticality: string; competence: string; frequency: string } } = { ...savedResponses };
        
        Object.values(existingResponses).forEach((response) => {
            initialResponses[response.competency_element_id] = {
                criticality: response.criticality_rating?.toString() || '',
                competence: response.competence_rating?.toString() || '',
                frequency: response.frequency_rating?.toString() || '',
            };
        });
        
        setResponses(initialResponses);
        // Save the merged data back to localStorage
        if (Object.keys(initialResponses).length > 0) {
            saveToLocalStorage(initialResponses);
        }
    }, [existingResponses]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Evaluate ${instructor.name} - ${evaluationForm.title}`} />
            
            <div className="max-w-7xl mx-auto">
                {/* Supervisor Evaluation Header */}
                <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-lg">
                                    {getInitials(instructor.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    Supervisor Evaluation
                                </h1>
                                <p className="text-blue-700 dark:text-blue-300 text-lg">
                                    Evaluating: <strong>{instructor.name}</strong>
                                </p>
                                <p className="text-blue-600 dark:text-blue-400 text-sm">
                                    {instructor.email}
                                    {instructor.specialization && ` • ${instructor.specialization}`}
                                </p>
                            </div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                        Supervisor Rating Guidelines
                                    </h3>
                                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                                        <strong>Your ratings will be the final assessment.</strong> Rate based on your observation 
                                        of the instructor's actual performance and competency level. This will be compared with 
                                        the instructor's self-evaluation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Header - TESDA Format but for Supervisor */}
                <Card className="mb-6">
                    <CardHeader className="text-center border-b">
                        <div className="border border-gray-400 p-4">
                            <h1 className="text-lg font-bold mb-2">TECHNICAL EDUCATION AND SKILLS DEVELOPMENT AUTHORITY</h1>
                            <h2 className="text-base font-bold mb-4">{evaluationForm.title}</h2>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-4">
                                <h3 className="font-bold text-red-800 dark:text-red-200">SUPERVISOR EVALUATION FORM</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm">
                                    Rating the competencies of: <strong>{instructor.name}</strong>
                                </p>
                            </div>
                            <div className="text-sm text-left">
                                <p className="mb-1">for the period: <span className="font-semibold">{evaluationForm.period_covered}</span></p>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <span className="font-semibold">Instructor Being Evaluated:</span><br />
                                        <span className="text-blue-600">{instructor.name.toUpperCase()}</span><br />
                                        <span className="font-semibold">Position/Title:</span><br />
                                        <span>INSTRUCTOR</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Office:</span> {evaluationForm.office}<br />
                                        <span className="font-semibold">Division:</span> {evaluationForm.division}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Designation:</span><br />
                                        <span>{evaluationForm.designation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Instructions for Supervisor */}
                <Card className="mb-6">
                    <CardContent className="pt-4">
                        <p className="text-sm">
                            <span className="font-semibold">SUPERVISOR INSTRUCTIONS:</span> Below are the units of competencies required in the performance of the instructor's job. 
                            Indicate in the numerical rating corresponding to each element, your assessment of the instructor's level of <span className="font-semibold">CRITICALITY to job</span>, 
                            their level of <span className="font-semibold">COMPETENCY</span> and <span className="font-semibold">FREQUENCY</span> of utilization based on your observation and supervision.
                            <br /><br />
                            <span className="text-red-600 font-semibold">Note:</span> Your ratings will be the final assessment and will be compared with the instructor's self-evaluation to determine training needs.
                        </p>
                    </CardContent>
                </Card>

                {/* Scale Guide */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-center text-sm bg-gray-100 p-2">CRITICALITY TO JOB</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1">
                            <div>1 - Slightly important</div>
                            <div>2 - Moderately important</div>
                            <div>3 - Very important</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-center text-sm bg-gray-100 p-2">LEVEL OF COMPETENCE</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1">
                            <div>1 - Not competent</div>
                            <div>2 - Slightly competent</div>
                            <div>3 - Moderately competent</div>
                            <div>4 - Highly competent</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-center text-sm bg-gray-100 p-2">FREQUENCY OF UTILIZATION</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1">
                            <div>1 - Rarely</div>
                            <div>2 - Occasionally</div>
                            <div>3 - Frequently</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evaluation Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-400 text-sm">
                                    <thead>
                                        <tr className="bg-red-50 dark:bg-red-900/20">
                                            <th className="border border-gray-400 p-2 text-left font-semibold">Unit of Competency</th>
                                            <th className="border border-gray-400 p-2 text-left font-semibold">Elements</th>
                                            <th className="border border-gray-400 p-1 text-center font-semibold w-24">
                                                <div>Criticality</div>
                                                <div>to Job</div>
                                                <div className="flex justify-center space-x-1 mt-1">
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">1</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">2</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">3</span>
                                                </div>
                                            </th>
                                            <th className="border border-gray-400 p-1 text-center font-semibold w-32">
                                                <div>Level of</div>
                                                <div>Competence</div>
                                                <div className="flex justify-center space-x-1 mt-1">
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">1</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">2</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">3</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">4</span>
                                                </div>
                                            </th>
                                            <th className="border border-gray-400 p-1 text-center font-semibold w-24">
                                                <div>Frequency</div>
                                                <div>of</div>
                                                <div>utilization</div>
                                                <div className="flex justify-center space-x-1 mt-1">
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">1</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">2</span>
                                                    <span className="w-6 h-6 border border-gray-400 flex items-center justify-center text-xs">3</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluationForm.competencyUnits?.length > 0 ? (
                                            evaluationForm.competencyUnits.map((unit) => 
                                                unit.elements?.map((element, elementIndex) => (
                                                    <tr key={element.id} className="hover:bg-gray-50">
                                                        <td className="border border-gray-400 p-2 align-top">
                                                            {elementIndex === 0 && (
                                                                <div className="text-xs font-medium text-blue-600">
                                                                    {unit.title}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-400 p-2 text-xs">
                                                            {element.description}
                                                        </td>
                                                        <td className="border border-gray-400 p-1">
                                                            <div className="flex justify-center space-x-1">
                                                                {[1, 2, 3].map((rating) => (
                                                                    <Input
                                                                        key={rating}
                                                                        type="text"
                                                                        className="w-6 h-6 text-center text-xs border border-gray-300 p-0"
                                                                        maxLength={1}
                                                                        value={responses[element.id]?.criticality === rating.toString() ? rating.toString() : ''}
                                                                        onChange={(e) => {
                                                                            if (e.target.value === '' || e.target.value === rating.toString()) {
                                                                                handleInputChange(element.id, 'criticality', e.target.value === rating.toString() ? rating.toString() : '');
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="border border-gray-400 p-1">
                                                            <div className="flex justify-center space-x-1">
                                                                {[1, 2, 3, 4].map((rating) => (
                                                                    <Input
                                                                        key={rating}
                                                                        type="text"
                                                                        className="w-6 h-6 text-center text-xs border border-gray-300 p-0"
                                                                        maxLength={1}
                                                                        value={responses[element.id]?.competence === rating.toString() ? rating.toString() : ''}
                                                                        onChange={(e) => {
                                                                            if (e.target.value === '' || e.target.value === rating.toString()) {
                                                                                handleInputChange(element.id, 'competence', e.target.value === rating.toString() ? rating.toString() : '');
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="border border-gray-400 p-1">
                                                            <div className="flex justify-center space-x-1">
                                                                {[1, 2, 3].map((rating) => (
                                                                    <Input
                                                                        key={rating}
                                                                        type="text"
                                                                        className="w-6 h-6 text-center text-xs border border-gray-300 p-0"
                                                                        maxLength={1}
                                                                        value={responses[element.id]?.frequency === rating.toString() ? rating.toString() : ''}
                                                                        onChange={(e) => {
                                                                            if (e.target.value === '' || e.target.value === rating.toString()) {
                                                                                handleInputChange(element.id, 'frequency', e.target.value === rating.toString() ? rating.toString() : '');
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => e.target.select()}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )).flat()
                                            ).flat()
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="border border-gray-400 p-4 text-center text-gray-500">
                                                    No competency units available for evaluation.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-between">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        <div className="flex gap-2">
                            <Link href={`/supervisor/evaluations/${evaluationForm.id}/results/${instructor.id}`}>
                                <Button variant="outline">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Results
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Supervisor Evaluation'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </SupervisorLayout>
    );
}
