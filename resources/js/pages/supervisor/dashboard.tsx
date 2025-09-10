import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, ClipboardCheck, CheckCircle, Clock, FileText } from 'lucide-react';

interface SupervisorDashboardProps {
    stats: {
        assigned_instructors: number;
        pending_evaluations: number;
        completed_evaluations: number;
        total_units: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function SupervisorDashboard({ stats, breadcrumbs }: SupervisorDashboardProps) {
    const statCards = [
        {
            title: 'Assigned Instructors',
            value: stats.assigned_instructors,
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Pending Evaluations',
            value: stats.pending_evaluations,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Completed Evaluations',
            value: stats.completed_evaluations,
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Total Units',
            value: stats.total_units,
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];

    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisor Dashboard" />
            
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
                {/* Recent Instructor Activity */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Instructor Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe completed evaluation</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Jane Smith started new evaluation</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Tasks */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ClipboardCheck className="w-5 h-5 text-yellow-600" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Review evaluations</span>
                                </div>
                                <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                    3 pending
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Assign new instructors</span>
                                </div>
                                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                    2 pending
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SupervisorLayout>
    );
}
