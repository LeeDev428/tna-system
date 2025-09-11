import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, FileText, Clock, AlertCircle } from 'lucide-react';

interface EvaluationIndexProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function EvaluationIndex({ breadcrumbs }: EvaluationIndexProps) {
    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluations" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and track instructor evaluations
                    </p>
                </div>
              
            </div>

            {/* Coming Soon Content */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Evaluation Management System
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Comprehensive evaluation tracking and management tools
                        </p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                            <AlertCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                                Coming Soon Features
                            </h3>
                            <div className="text-green-700 dark:text-green-300 space-y-2">
                                <p>• View all active and completed evaluations</p>
                                <p>• Filter assessments by instructor, status, or date</p>
                                <p>• Monitor evaluation progress in real-time</p>
                                <p>• Generate comprehensive reports and analytics</p>
                                <p>• Export evaluation data for external review</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                This evaluation management system will provide you with complete oversight 
                                of all instructor assessments. Track progress, review submissions, and 
                                generate detailed reports to support your supervisory responsibilities.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/supervisor/dashboard">
                                    <Button variant="outline">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                                <Link href="/supervisor/evaluations/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Assessment
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
