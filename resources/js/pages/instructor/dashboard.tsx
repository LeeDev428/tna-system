import InstructorLayout from '@/layouts/instructor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClipboardCheck, CheckCircle, Clock, Award, Calendar, User, Mail, Building2, FileText, Star } from 'lucide-react';

interface InstructorDashboardProps {
    stats: {
        my_evaluations: number;
        completed_evaluations: number;
        pending_evaluations: number;
        experience_years: number;
    };
    evaluatingSupervisor?: {
        id: number;
        name: string;
        email: string;
        department: string;
        last_evaluation_date: string;
        evaluation_form_title: string;
        total_evaluations_given: number;
    } | null;
    breadcrumbs: BreadcrumbItem[];
}

export default function InstructorDashboard({ stats, evaluatingSupervisor, breadcrumbs }: InstructorDashboardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

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

            {/* Supervisor Who Evaluated Me - Landscape Layout */}
            {evaluatingSupervisor && (
                <div className="mb-6">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                My Evaluating Supervisor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                {/* Avatar */}
                                <Avatar className="w-16 h-16 flex-shrink-0">
                                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-lg">
                                        {getInitials(evaluatingSupervisor.name)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                {/* Supervisor Details - Landscape Layout */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Basic Info */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {evaluatingSupervisor.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4" />
                                            <span>{evaluatingSupervisor.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Building2 className="w-4 h-4" />
                                            <span>{evaluatingSupervisor.department}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Evaluation Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                Last Evaluation: <strong>{evaluatingSupervisor.last_evaluation_date}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                Form: <strong>{evaluatingSupervisor.evaluation_form_title}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {evaluatingSupervisor.total_evaluations_given}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Total Evaluations Given
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <Star className="w-3 h-3 mr-1" />
                                            Active Supervisor
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Evaluations */}
               

                {/* Recent Activity */}
                
            </div>

         
        </InstructorLayout>
    );
}
