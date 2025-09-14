import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, AlertCircle, Calendar, Star, Users, CheckCircle } from 'lucide-react';

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
    evaluation_session?: {
        id: number;
        status: 'not_started' | 'in_progress' | 'completed';
        completion_percentage: number;
        completed_at: string | null;
    };
}

interface AssessmentIndexProps {
    evaluationForms: EvaluationForm[];
    breadcrumbs: BreadcrumbItem[];
}

export default function AssessmentIndex({ evaluationForms, breadcrumbs }: AssessmentIndexProps) {
    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title="My Evaluations" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Evaluations</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and complete your competency assessments
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
                    {evaluationForms.map((form) => {
                        const session = form.evaluation_session;
                        const isCompleted = session?.status === 'completed';
                        const isInProgress = session?.status === 'in_progress';
                        const completionPercentage = session?.completion_percentage || 0;
                        
                        return (
                            <Card key={form.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <CardTitle className="text-xl text-gray-900 dark:text-white">
                                                    {form.title}
                                                </CardTitle>
                                                <div className="flex gap-2">
                                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                        Active
                                                    </Badge>
                                                    {isCompleted && (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Completed
                                                        </Badge>
                                                    )}
                                                    {isInProgress && (
                                                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            In Progress ({completionPercentage}%)
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                {form.description || 'Competency assessment and evaluation form'}
                                            </p>
                                            
                                            {/* Progress bar for in-progress evaluations */}
                                            {isInProgress && (
                                                <div className="mb-3">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                        <span className="text-gray-900 dark:text-white font-medium">
                                                            {completionPercentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div 
                                                            className="bg-orange-500 h-2 rounded-full transition-all"
                                                            style={{ width: `${completionPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Completion info */}
                                            {isCompleted && session?.completed_at && (
                                                <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                                                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Completed on {new Date(session.completed_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            )}
                                            
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
                                            {isCompleted ? (
                                                <div className="flex gap-2">
                                                    <Link href={`/instructor/evaluations/${form.id}/results`}>
                                                       
                                                    </Link>
                                                    <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Completed
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Link href={`/instructor/evaluations/${form.id}`}>
                                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        {isInProgress ? 'Continue Assessment' : 'Take Assessment'}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
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
                                There are currently no assessment forms assigned to you
                            </p>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
                                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    Waiting for Assessment Forms
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Please check back later or contact your supervisor for available evaluation forms.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/instructor/dashboard">
                                    <Button variant="outline">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </InstructorLayout>
    );
}
