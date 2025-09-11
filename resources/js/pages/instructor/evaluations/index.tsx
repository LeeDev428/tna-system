import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, AlertCircle, Calendar, Star } from 'lucide-react';

interface AssessmentIndexProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function AssessmentIndex({ breadcrumbs }: AssessmentIndexProps) {
    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title="My Assessments" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assessments</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and complete your assigned evaluations
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>No pending assessments</span>
                </div>
            </div>

            {/* Coming Soon Content */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                            <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Assessment Center
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Your personalized evaluation and assessment dashboard
                        </p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
                            <AlertCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                Assessment Features Coming Soon
                            </h3>
                            <div className="text-purple-700 dark:text-purple-300 space-y-2">
                                <p>• View assigned evaluations from supervisors</p>
                                <p>• Complete self-assessments and peer reviews</p>
                                <p>• Track your progress and performance metrics</p>
                                <p>• Access feedback and development recommendations</p>
                                <p>• Schedule follow-up meetings and discussions</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-orange-800 dark:text-orange-200">Pending Assessments</h4>
                                <p className="text-orange-700 dark:text-orange-300 text-sm">
                                    View and complete evaluations assigned to you
                                </p>
                            </div>
                            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                                <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-teal-800 dark:text-teal-200">Completed Reviews</h4>
                                <p className="text-teal-700 dark:text-teal-300 text-sm">
                                    Access your evaluation history and feedback
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                Your assessment center will provide a comprehensive view of all evaluations, 
                                feedback, and development opportunities. Stay on track with your professional 
                                growth through structured assessments and actionable insights.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/instructor/dashboard">
                                    <Button variant="outline">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                                <Button disabled className="cursor-not-allowed opacity-50">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Take Assessment (Coming Soon)
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </InstructorLayout>
    );
}
