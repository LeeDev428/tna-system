import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, ChevronRight, GraduationCap, Award, Mail, CheckCircle2, FileText } from 'lucide-react';

interface Instructor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    certification_level: string;
    self_evaluation_completed: boolean;
    supervisor_evaluation_completed: boolean;
    has_comparison_results: boolean;
}

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    designation: string;
    office: string;
    division: string;
    period_covered: string;
}

interface SelectInstructorProps {
    instructors: Instructor[];
    evaluationForm: EvaluationForm;
    breadcrumbs: BreadcrumbItem[];
}

export default function SelectInstructor({ instructors, evaluationForm, breadcrumbs }: SelectInstructorProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Select Instructor - ${evaluationForm.title}`} />
            
            {/* Header */}
            <div className="mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                        Select Instructor to Evaluate
                    </h1>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Choose which instructor you want to evaluate using: <strong>{evaluationForm.title}</strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-blue-800 dark:text-blue-200">Office:</span>
                            <p className="text-blue-600 dark:text-blue-300">{evaluationForm.office}</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-800 dark:text-blue-200">Division:</span>
                            <p className="text-blue-600 dark:text-blue-300">{evaluationForm.division}</p>
                        </div>
                        <div>
                            <span className="font-medium text-blue-800 dark:text-blue-200">Period:</span>
                            <p className="text-blue-600 dark:text-blue-300">{evaluationForm.period_covered}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                Evaluation Process
                            </h3>
                            <p className="text-amber-800 dark:text-amber-200 text-sm">
                                As a supervisor, you will evaluate the selected instructor's competencies. 
                                Your ratings will be compared with the instructor's self-evaluation to determine training needs.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Instructors List */}
            {instructors.length > 0 ? (
                <div className="grid gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Available Instructors ({instructors.length})
                        </h2>
                    </div>
                    
                    {instructors.map((instructor) => (
                        <Card key={instructor.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                                                {getInitials(instructor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {instructor.name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{instructor.email}</span>
                                                </div>
                                                {instructor.specialization && (
                                                    <div className="flex items-center gap-1">
                                                        <GraduationCap className="w-4 h-4" />
                                                        <span>{instructor.specialization}</span>
                                                    </div>
                                                )}
                                                {instructor.certification_level && (
                                                    <div className="flex items-center gap-1">
                                                        <Award className="w-4 h-4" />
                                                        <Badge variant="outline" className="text-xs">
                                                            {instructor.certification_level}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Evaluation Status */}
                                            <div className="flex gap-2 text-xs">
                                                <div className="flex items-center gap-1">
                                                    {instructor.self_evaluation_completed ? (
                                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <span className={instructor.self_evaluation_completed ? 'text-green-600' : 'text-gray-500'}>
                                                        Self-evaluation
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {instructor.supervisor_evaluation_completed ? (
                                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                    ) : (
                                                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <span className={instructor.supervisor_evaluation_completed ? 'text-green-600' : 'text-gray-500'}>
                                                        Supervisor evaluation
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {instructor.has_comparison_results && (
                                            <Link href={`/supervisor/evaluations/${evaluationForm.id}/results/${instructor.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View Results
                                                </Button>
                                            </Link>
                                        )}
                                        <Link 
                                            href={`/supervisor/evaluations/${evaluationForm.id}/evaluate/${instructor.id}`}
                                        >
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <span>
                                                    {instructor.supervisor_evaluation_completed ? 'Edit Evaluation' : 'Evaluate'}
                                                </span>
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* No Instructors Available */
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-900/20 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No Instructors Available
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            There are currently no instructors available to evaluate
                        </p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/supervisor/evaluations">
                                <Button variant="outline">
                                    Back to Evaluations
                                </Button>
                            </Link>
                            <Link href="/supervisor/dashboard">
                                <Button variant="outline">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </SupervisorLayout>
    );
}
