import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface TakeAssessmentProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function TakeAssessment({ breadcrumbs }: TakeAssessmentProps) {
    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title="Take Assessment" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/instructor/evaluations">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Assessments
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Take Assessment</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete your evaluation and self-assessment
                    </p>
                </div>
            </div>

            {/* Coming Soon Content */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Interactive Assessment Form
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Comprehensive evaluation and feedback system
                        </p>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 mb-6">
                            <AlertCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                                Assessment Form Features
                            </h3>
                            <div className="text-indigo-700 dark:text-indigo-300 space-y-2">
                                <p>• Multi-section evaluation forms with progress tracking</p>
                                <p>• Self-assessment questions and peer review components</p>
                                <p>• File uploads for supporting documentation</p>
                                <p>• Real-time form validation and auto-save functionality</p>
                                <p>• Comprehensive scoring and feedback system</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Time Management</h4>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                    Flexible timing with auto-save progress
                                </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Rich Content</h4>
                                <p className="text-blue-700 dark:text-blue-300 text-sm">
                                    Text, media, and document uploads
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-green-800 dark:text-green-200">Smart Validation</h4>
                                <p className="text-green-700 dark:text-green-300 text-sm">
                                    Real-time feedback and completion tracking
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                The assessment form will provide an intuitive and comprehensive evaluation 
                                experience. Complete sections at your own pace, receive immediate feedback, 
                                and contribute to your professional development through structured reflection.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/instructor/evaluations">
                                    <Button variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Assessments
                                    </Button>
                                </Link>
                                <Link href="/instructor/dashboard">
                                    <Button>
                                        Return to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </InstructorLayout>
    );
}
