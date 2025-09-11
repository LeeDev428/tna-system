import AdminLayout from '@/layouts/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Building2, Layers3, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        instructors: number;
        supervisors: number;
        units: number;
        elements: number;
        evaluations: number;
        recommendations: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function AdminDashboard({ stats, breadcrumbs }: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Instructors',
            value: stats.instructors,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: 'Units',
            value: stats.units,
            icon: Building2,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: 'Elements',
            value: stats.elements,
            icon: Layers3,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        },
        {
            title: 'Evaluations',
            value: stats.evaluations,
            icon: FileText,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            title: 'Recommendations',
            value: stats.recommendations,
            icon: CheckCircle,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
         

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Additional Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              

                {/* Quick Actions Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Add New User</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Create Unit</span>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-yellow-600" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">View Reports</span>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
