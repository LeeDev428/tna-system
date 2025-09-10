import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClipboardCheck, CheckCircle, Clock, Award, Calendar } from 'lucide-react';

interface InstructorDashboardProps {
    stats: {
        my_evaluations: number;
        completed_evaluations: number;
        pending_evaluations: number;
        experience_years: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function InstructorDashboard({ stats, breadcrumbs }: InstructorDashboardProps) {
    const statCards = [
        {
            title: 'My Evaluations',
            value: stats.my_evaluations,
            icon: ClipboardCheck,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
        {
            title: 'Completed',
            value: stats.completed_evaluations,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Pending',
            value: stats.pending_evaluations,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Experience Years',
            value: stats.experience_years,
            icon: Award,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
    ];

    return (
        <InstructorLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Dashboard" />
            
            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                    <Card key={card.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {card.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Evaluations */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Upcoming Evaluations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Unit 1 Assessment</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: Tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Skills Evaluation</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: Next week</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Completed evaluation #12</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <ClipboardCheck className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Started new evaluation #13</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Overview */}
            <div className="mt-6">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            My Progress Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 mb-1">A-</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Average Grade</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.experience_years}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </InstructorLayout>
    );
}
