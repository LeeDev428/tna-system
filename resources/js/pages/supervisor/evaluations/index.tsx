import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, FileText, Clock, AlertCircle, Users, Calendar } from 'lucide-react';

interface CompetencyUnit {
    id: number;
    title: string;
    description: string;
}

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    designation: string;
    office: string;
    division: string;
    period_covered: string;
    is_active: boolean;
    created_at: string;
    competency_units: CompetencyUnit[];
    created_by: {
        name: string;
    };
}

interface EvaluationIndexProps {
    evaluationForms: EvaluationForm[];
    breadcrumbs: BreadcrumbItem[];
}

export default function EvaluationIndex({ evaluationForms, breadcrumbs }: EvaluationIndexProps) {
    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluations" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and complete evaluation assessments
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{evaluationForms.length} assessment(s) available</span>
                </div>
            </div>

            {/* Evaluation Forms List */}
            {evaluationForms.length > 0 ? (
                <div className="grid gap-6">
                    {evaluationForms.map((form) => (
                        <Card key={form.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <CardTitle className="text-xl text-gray-900 dark:text-white">
                                                {form.title}
                                            </CardTitle>
                                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                Active
                                            </Badge>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                                            {form.description || 'Competency assessment and evaluation form'}
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Office:</span>
                                                <p className="text-gray-600 dark:text-gray-400">{form.office}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Division:</span>
                                                <p className="text-gray-600 dark:text-gray-400">{form.division}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Period:</span>
                                                <p className="text-gray-600 dark:text-gray-400">{form.period_covered}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Units:</span>
                                                <p className="text-gray-600 dark:text-gray-400">{form.competency_units.length} competency units</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>Created by {form.created_by.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/supervisor/evaluations/${form.id}/select-instructor`}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Take Assessment
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* No Evaluations Available */
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-900/20 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No Evaluations Available
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                There are currently no assessment forms available
                            </p>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Waiting for Assessment Forms
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Please check back later or contact your administrator for available evaluation forms.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/supervisor/dashboard">
                                    <Button variant="outline">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </SupervisorLayout>
    );
}
