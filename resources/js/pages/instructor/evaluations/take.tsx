import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import React from 'react';

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
    competency_units: CompetencyUnit[];
}

interface ExistingResponse {
    competency_element_id: number;
    criticality_rating: number;
    competence_rating: number;
    frequency_rating: number;
}

interface TakeEvaluationProps {
    evaluationForm: EvaluationForm;
    existingResponses: { [key: number]: ExistingResponse };
    breadcrumbs: BreadcrumbItem[];
}

export default function TakeEvaluation({ evaluationForm, existingResponses, breadcrumbs }: TakeEvaluationProps) {
    const [responses, setResponses] = useState<{ [key: number]: { criticality: string; competence: string; frequency: string } }>({});

    const { post, processing } = useForm();

    // LocalStorage key for this form
    const storageKey = `evaluation_${evaluationForm.id}_instructor_${JSON.parse(document.querySelector('meta[name="user"]')?.getAttribute('content') || '{}').id || 'unknown'}`;

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

        // Submit with Inertia router post
        router.post(`/instructor/evaluations/${evaluationForm.id}/responses`, {
            responses: formattedResponses,
            evaluated_user_id: null,
            response_type: 'self'
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

    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title={evaluationForm.title} />
            
            <div className="max-w-7xl mx-auto">
                {/* Header - Exact TESDA Format */}
                <Card className="mb-6">
                    <CardHeader className="text-center border-b">
                        <div className="border border-gray-400 p-4">
                            <h1 className="text-lg font-bold mb-2">TECHNICAL EDUCATION AND SKILLS DEVELOPMENT AUTHORITY</h1>
                            <h2 className="text-base font-bold mb-4">{evaluationForm.title}</h2>
                            <div className="text-sm text-left">
                                <p className="mb-1">for the period: <span className="font-semibold">{evaluationForm.period_covered}</span></p>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <span className="font-semibold">Name:</span><br />
                                        <span className="text-blue-600">ANGELICA L. SORIANO</span><br />
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

                {/* Instructions */}
                <Card className="mb-6">
                    <CardContent className="pt-4">
                        <p className="text-sm">
                            <span className="font-semibold">INSTRUCTIONS:</span> Below are the units of competencies required in the performance of your job. 
                            Indicate in the numerical rating corresponding to each element, your level of <span className="font-semibold">CRITICALITY to job</span>, 
                            your level of <span className="font-semibold">COMPETENCY</span> and <span className="font-semibold">FREQUENCY</span> of utilization. 
                            Please answer carefully as this assessment will determine your Professional Development Plan.
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
                                        <tr className="bg-gray-50">
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
                                        {evaluationForm.competency_units.map((unit) => (
                                            unit.elements.map((element, elementIndex) => (
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
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end space-x-4">
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            {processing ? 'Saving...' : 'Save Evaluation'}
                        </Button>
                    </div>
                </form>
            </div>
        </InstructorLayout>
    );
}
