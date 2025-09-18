import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, ClipboardCheck, CheckCircle, Clock, FileText, Mail, GraduationCap, Award, Calendar } from 'lucide-react';

interface SupervisorDashboardProps {
    stats: {
        assigned_instructors: number;
        pending_evaluations: number;
        completed_evaluations: number;
        total_units: number;
    };
    evaluatedInstructors: Array<{
        id: number;
        name: string;
        email: string;
        specialization: string;
        certification_level: string;
        last_evaluation_date: string;
        evaluation_form_title: string;
    }>;
    breadcrumbs: BreadcrumbItem[];
}

export default function SupervisorDashboard({ stats, evaluatedInstructors, breadcrumbs }: SupervisorDashboardProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const statCards = [
        {
            title: 'Assigned Instructors',
            value: stats.assigned_instructors,
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               

                {/* Evaluated Instructors - Right side */}
                <div className="lg:col-span-1">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Evaluated Instructors ({evaluatedInstructors.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {evaluatedInstructors.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto px-6 pb-6">
                                    <div className="space-y-3">
                                        {evaluatedInstructors.map((instructor) => (
                                            <div key={instructor.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-xs">
                                                            {getInitials(instructor.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                            {instructor.name}
                                                        </h4>
                                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            <Mail className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">{instructor.email}</span>
                                                        </div>
                                                        
                                                        {instructor.specialization !== 'N/A' && (
                                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">{instructor.specialization}</span>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2">
                                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                                            <span>Last evaluated: {instructor.last_evaluation_date}</span>
                                                        </div>
                                                        
                                                        {instructor.evaluation_form_title !== 'N/A' && (
                                                            <Badge variant="outline" className="text-xs mt-2 truncate">
                                                                {instructor.evaluation_form_title}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 px-6 text-gray-500 dark:text-gray-400">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="font-medium mb-1">No Evaluations Yet</p>
                                    <p className="text-sm">
                                        Start evaluating your assigned instructors to see them here.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SupervisorLayout>
    );
}
