import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface EvaluationResponse {
    id: number;
    competency_element_id: number;
    criticality_rating: number;
    competence_level_rating: number;
    frequency_rating: number;
    cpr_score: number;
    needs_training: boolean;
    response_type: 'self' | 'supervisor';
}

interface ElementData {
    element: {
        id: number;
        title: string;
    };
    instructor_response: EvaluationResponse | null;
    supervisor_response: EvaluationResponse | null;
    final_cpr: number;
    final_ratings: {
        criticality: number;
        competence: number;
        frequency: number;
        source: 'instructor' | 'supervisor' | 'none';
    };
    needs_training: boolean;
}

interface UnitData {
    unit: {
        id: number;
        title: string;
    };
    elements: ElementData[];
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface EvaluationForm {
    id: number;
    title: string;
}

interface PageProps {
    evaluationForm: EvaluationForm;
    instructor: User;
    supervisor: User;
    responsesByUnit: UnitData[];
    breadcrumbs: BreadcrumbItem[];
}

const getCPRColor = (cpr: number) => {
    if (cpr >= 21) return 'text-green-600';
    return 'text-red-600';
};

const getCPRIcon = (cpr: number) => {
    if (cpr >= 21) {
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
};

const getSourceBadge = (source: string) => {
    switch (source) {
        case 'supervisor':
            return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Supervisor Priority</Badge>;
        case 'instructor':
            return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">Self Evaluation</Badge>;
        default:
            return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">No Response</Badge>;
    }
};

export default function DetailedEvaluationView({
    evaluationForm,
    instructor,
    supervisor,
    responsesByUnit,
    breadcrumbs
}: PageProps) {
    const totalElements = responsesByUnit.reduce((sum, unit) => sum + unit.elements.length, 0);
    const completedElements = responsesByUnit.reduce((sum, unit) => 
        sum + unit.elements.filter(el => el.final_cpr > 0).length, 0
    );
    const averageCPR = responsesByUnit.reduce((sum, unit) => 
        sum + unit.elements.reduce((unitSum, el) => unitSum + el.final_cpr, 0), 0
    ) / Math.max(totalElements, 1);
    const needsTrainingCount = responsesByUnit.reduce((sum, unit) => 
        sum + unit.elements.filter(el => el.needs_training).length, 0
    );

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Evaluation Details - ${instructor.name}`} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluation Details</h1>
                        <p className="text-gray-600 mt-1">{evaluationForm.title}</p>
                    </div>
                </div>

                {/* Participants Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Instructor (Subject)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{instructor.name}</div>
                            <div className="text-sm text-gray-600">{instructor.email}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Supervisor (Evaluator)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{supervisor.name}</div>
                            <div className="text-sm text-gray-600">{supervisor.email}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle>CPR Analysis Summary</CardTitle>
                        <CardDescription>
                            Competency Performance Ratio analysis with supervisor priority
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{averageCPR.toFixed(2)}</div>
                                <div className="text-sm text-blue-700">Average CPR Score</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">{completedElements}/{totalElements}</div>
                                <div className="text-sm text-gray-700">Completed Elements</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{totalElements - needsTrainingCount}</div>
                                <div className="text-sm text-green-700">Competent Elements</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{needsTrainingCount}</div>
                                <div className="text-sm text-red-700">Need Training</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Competency Units */}
                {responsesByUnit.map((unitData) => (
                    <Card key={unitData.unit.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {unitData.unit.title}
                            </CardTitle>
                            <CardDescription>
                                {unitData.elements.length} competency elements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Competency Element
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Self<br/>C
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Self<br/>CL
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Self<br/>FU
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Self<br/>CPR
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Sup<br/>C
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Sup<br/>CL
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Sup<br/>FU
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Sup<br/>CPR
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Final<br/>CPR
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {unitData.elements.map((elementData, index) => (
                                            <tr key={elementData.element.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="font-medium text-gray-900">
                                                        {elementData.element.title}
                                                    </div>
                                                </td>
                                                
                                                {/* Instructor Self-Evaluation */}
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.instructor_response ? 
                                                        elementData.instructor_response.criticality_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.instructor_response ? 
                                                        elementData.instructor_response.competence_level_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.instructor_response ? 
                                                        elementData.instructor_response.frequency_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.instructor_response ? 
                                                        <span className={getCPRColor(elementData.instructor_response.cpr_score)}>
                                                            {elementData.instructor_response.cpr_score}
                                                        </span> : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>

                                                {/* Supervisor Evaluation */}
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.supervisor_response ? 
                                                        elementData.supervisor_response.criticality_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.supervisor_response ? 
                                                        elementData.supervisor_response.competence_level_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.supervisor_response ? 
                                                        elementData.supervisor_response.frequency_rating : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>
                                                <td className="px-3 py-3 text-center text-sm">
                                                    {elementData.supervisor_response ? 
                                                        <span className={getCPRColor(elementData.supervisor_response.cpr_score)}>
                                                            {elementData.supervisor_response.cpr_score}
                                                        </span> : 
                                                        <span className="text-gray-400">-</span>
                                                    }
                                                </td>

                                                {/* Final CPR (with priority) */}
                                                <td className="px-3 py-3 text-center">
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <div className="flex items-center space-x-1">
                                                            {getCPRIcon(elementData.final_cpr)}
                                                            <span className={`font-bold ${getCPRColor(elementData.final_cpr)}`}>
                                                                {elementData.final_cpr}
                                                            </span>
                                                        </div>
                                                        {getSourceBadge(elementData.final_ratings.source)}
                                                    </div>
                                                </td>

                                                {/* Training Status */}
                                                <td className="px-3 py-3 text-center">
                                                    {elementData.needs_training ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Training
                                                        </Badge>
                                                    ) : elementData.final_cpr > 0 ? (
                                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                                            Competent
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Legend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Rating Scales:</strong>
                                <ul className="mt-2 space-y-1 text-gray-600">
                                    <li><strong>C (Criticality):</strong> 1=Low, 2=Medium, 3=High</li>
                                    <li><strong>CL (Competence Level):</strong> 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert</li>
                                    <li><strong>FU (Frequency of Use):</strong> 1=Rarely, 2=Sometimes, 3=Frequently</li>
                                </ul>
                            </div>
                            <div>
                                <strong>CPR Formula:</strong> C × CL × FU
                                <ul className="mt-2 space-y-1 text-gray-600">
                                    <li><strong>Green (≥21):</strong> Competent - No training needed</li>
                                    <li><strong>Red (&lt;21):</strong> Training needed</li>
                                    <li><strong>Priority:</strong> Supervisor evaluation overrides self-evaluation</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
