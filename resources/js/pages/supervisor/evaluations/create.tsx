import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Clock, AlertCircle } from 'lucide-react';

interface CreateEvaluationProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function CreateEvaluation({ breadcrumbs }: CreateEvaluationProps) {
    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Assessment" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/supervisor/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Assessment</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create and assign evaluations to your instructors
                    </p>
                </div>
            </div>

            {/* Coming Soon Content */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Assessment Creation Coming Soon
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            This feature is currently under development
                        </p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                            <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                What's Coming
                            </h3>
                            <div className="text-blue-700 dark:text-blue-300 space-y-2">
                                <p>• Create custom evaluation forms</p>
                                <p>• Assign assessments to specific instructors</p>
                                <p>• Set deadlines and notifications</p>
                                <p>• Track assessment progress in real-time</p>
                                <p>• Generate detailed evaluation reports</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                The assessment creation functionality will be added in the next update. 
                                You'll be able to create comprehensive evaluations with custom questions, 
                                scoring criteria, and automated reporting.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/supervisor/dashboard">
                                    <Button variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Return to Dashboard
                                    </Button>
                                </Link>
                                <Link href="/supervisor/evaluations">
                                    <Button>
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Existing Evaluations
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SupervisorLayout>
    );
}
