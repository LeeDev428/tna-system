import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Clock, FileText, Target, BarChart3 } from 'lucide-react';

interface EvaluationSession {
    id: number;
    evaluation_form_id: number;
    user_id: number;
    evaluated_user_id?: number;
    session_type: 'self' | 'supervisor';
    status: 'not_started' | 'in_progress' | 'completed';
    total_elements: number;
    completed_elements: number;
    completion_percentage: number;
    created_at: string;
    updated_at: string;
    evaluation_form: {
        id: number;
        title: string;
        competency_units: Array<{
            id: number;
            title: string;
            elements: any[];
        }>;
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
    evaluated_user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface EvaluationResponse {
    id: number;
    competency_element_id: number;
    criticality_rating: number;
    competence_level_rating: number;
    frequency_rating: number;
    cpr_score: number;
    needs_training: boolean;
    competency_element: {
        id: number;
        title: string;
        competency_unit: {
            id: number;
            title: string;
        };
    };
}

interface PageProps {
    session: EvaluationSession;
    responses: EvaluationResponse[];
    breadcrumbs: Array<{ label: string; url?: string }>;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'not_started':
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'completed':
            return 'Completed';
        case 'in_progress':
            return 'In Progress';
        case 'not_started':
        default:
            return 'Not Started';
    }
};

const getCPRColor = (cprScore: number) => {
    if (cprScore >= 21) {
        return 'text-green-600';
    }
    return 'text-red-600';
};

export default function EvaluationShow({ session, responses, breadcrumbs }: PageProps) {
    const averageCPR = responses.length > 0 
        ? responses.reduce((sum, response) => sum + response.cpr_score, 0) / responses.length 
        : 0;

    const needsTrainingCount = responses.filter(response => response.needs_training).length;

    // Group responses by competency unit
    const responsesByUnit = responses.reduce((acc, response) => {
        const unitId = response.competency_element.competency_unit.id;
        const unitTitle = response.competency_element.competency_unit.title;
        
        if (!acc[unitId]) {
            acc[unitId] = {
                title: unitTitle,
                responses: []
            };
        }
        
        acc[unitId].responses.push(response);
        return acc;
    }, {} as Record<number, { title: string; responses: EvaluationResponse[] }>);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluation Session Details" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Evaluation Session Details</h1>
                        <p className="text-gray-600 mt-1">
                            {session.evaluation_form.title}
                        </p>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                        {getStatusText(session.status)}
                    </Badge>
                </div>

                {/* Session Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Evaluator
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{session.user.name}</div>
                            <div className="text-sm text-gray-600">{session.user.email}</div>
                            <div className="text-xs text-gray-500 mt-1 capitalize">
                                {session.session_type} evaluation
                            </div>
                        </CardContent>
                    </Card>

                    {session.evaluated_user && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Subject
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-semibold">{session.evaluated_user.name}</div>
                                <div className="text-sm text-gray-600">{session.evaluated_user.email}</div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{Math.round(session.completion_percentage)}%</div>
                            <Progress value={session.completion_percentage} className="mt-2" />
                            <div className="text-xs text-gray-500 mt-1">
                                {session.completed_elements} of {session.total_elements} elements
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Started
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">
                                {new Date(session.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                {new Date(session.created_at).toLocaleTimeString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CPR Summary */}
                {responses.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                CPR Analysis Summary
                            </CardTitle>
                            <CardDescription>
                                Competency Performance Ratio analysis and training needs identification
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{averageCPR.toFixed(2)}</div>
                                    <div className="text-sm text-blue-700">Average CPR Score</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {responses.length - needsTrainingCount}
                                    </div>
                                    <div className="text-sm text-green-700">Competent Elements</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{needsTrainingCount}</div>
                                    <div className="text-sm text-red-700">Need Training</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Responses by Unit */}
                {Object.entries(responsesByUnit).map(([unitId, unit]) => (
                    <Card key={unitId}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {unit.title}
                            </CardTitle>
                            <CardDescription>
                                {unit.responses.length} elements evaluated
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {unit.responses.map((response) => (
                                    <div
                                        key={response.id}
                                        className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-900">
                                                {response.competency_element.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-bold ${getCPRColor(response.cpr_score)}`}>
                                                    {response.cpr_score}
                                                </span>
                                                {response.needs_training && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Training Needed
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4 mt-3">
                                            <div className="text-center p-2 bg-gray-50 rounded">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {response.criticality_rating}
                                                </div>
                                                <div className="text-xs text-gray-600">Criticality</div>
                                            </div>
                                            <div className="text-center p-2 bg-gray-50 rounded">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {response.competence_level_rating}
                                                </div>
                                                <div className="text-xs text-gray-600">Competence</div>
                                            </div>
                                            <div className="text-center p-2 bg-gray-50 rounded">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {response.frequency_rating}
                                                </div>
                                                <div className="text-xs text-gray-600">Frequency</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {responses.length === 0 && session.status !== 'not_started' && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Yet</h3>
                            <p className="text-gray-600">
                                This evaluation session has been started but no responses have been recorded yet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
