import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface EvaluationPair {
    instructor_id: number;
    instructor_name: string;
    instructor_email: string;
    supervisor_id: number;
    supervisor_name: string;
    supervisor_email: string;
    evaluation_form_id: number;
    evaluation_form_title: string;
    instructor_cpr: number | null;
    supervisor_cpr: number | null;
    combined_cpr: number | null;
    instructor_completed: boolean;
    supervisor_completed: boolean;
    needs_training: boolean;
}

interface PageProps {
    evaluationData: EvaluationPair[];
    breadcrumbs: BreadcrumbItem[];
}

const getStatusColor = (completed: boolean) => {
    return completed 
        ? 'bg-green-100 text-green-800 border-green-200'
        : 'bg-gray-100 text-gray-800 border-gray-200';
};

const getStatusText = (completed: boolean) => {
    return completed ? 'Completed' : 'Not Completed';
};

const getCPRColor = (cpr: number | null) => {
    if (cpr === null) return 'text-gray-500';
    return cpr >= 21 ? 'text-green-600' : 'text-red-600';
};

const getCPRIcon = (cpr: number | null) => {
    if (cpr === null) return null;
    return cpr >= 21 
        ? <CheckCircle className="w-4 h-4 text-green-600" />
        : <AlertTriangle className="w-4 h-4 text-red-600" />;
};

export default function EvaluationIndex({ evaluationData, breadcrumbs }: PageProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="User Evaluations" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Evaluations</h1>
                        <p className="text-gray-600 mt-1">
                            Monitor evaluation completion status and CPR scores for all instructor-supervisor pairs
                        </p>
                    </div>
                </div>

                {evaluationData.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluation Data</h3>
                            <p className="text-gray-600 mb-4">
                                Create evaluation forms and assign instructors/supervisors first.
                            </p>
                            <Link
                                href="/admin/evaluation-forms/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create Evaluation Form
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Evaluation Status Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-2 px-2 font-semibold min-w-[150px]">Instructor</th>
                                            <th className="text-left py-2 px-2 font-semibold min-w-[150px]">Supervisor</th>
                                            <th className="text-left py-2 px-2 font-semibold min-w-[120px]">Form</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[80px]">I-Status</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[80px]">S-Status</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[60px]">I-CPR</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[60px]">S-CPR</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[80px]">Final CPR</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[90px]">Training</th>
                                            <th className="text-center py-2 px-2 font-semibold min-w-[90px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluationData.map((pair, index) => (
                                            <tr key={`${pair.instructor_id}-${pair.supervisor_id}-${pair.evaluation_form_id}`} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-2">
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-xs">{pair.instructor_name}</div>
                                                        <div className="text-xs text-gray-600 truncate">{pair.instructor_email}</div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2">
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-xs">{pair.supervisor_name}</div>
                                                        <div className="text-xs text-gray-600 truncate">{pair.supervisor_email}</div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2">
                                                    <div className="font-medium text-gray-900 text-xs truncate">{pair.evaluation_form_title}</div>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <Badge className={`text-xs ${getStatusColor(pair.instructor_completed)}`}>
                                                        {pair.instructor_completed ? 'Done' : 'Pending'}
                                                    </Badge>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <Badge className={`text-xs ${getStatusColor(pair.supervisor_completed)}`}>
                                                        {pair.supervisor_completed ? 'Done' : 'Pending'}
                                                    </Badge>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <div className={`flex items-center justify-center gap-1 font-semibold text-sm ${getCPRColor(pair.instructor_cpr)}`}>
                                                        {getCPRIcon(pair.instructor_cpr)}
                                                        {pair.instructor_cpr !== null ? pair.instructor_cpr.toFixed(1) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <div className={`flex items-center justify-center gap-1 font-semibold text-sm ${getCPRColor(pair.supervisor_cpr)}`}>
                                                        {getCPRIcon(pair.supervisor_cpr)}
                                                        {pair.supervisor_cpr !== null ? pair.supervisor_cpr.toFixed(1) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <div className={`flex items-center justify-center gap-1 font-bold text-lg ${getCPRColor(pair.combined_cpr)}`}>
                                                        {getCPRIcon(pair.combined_cpr)}
                                                        {pair.combined_cpr !== null ? pair.combined_cpr.toFixed(1) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    {pair.combined_cpr !== null ? (
                                                        <Badge className={`text-xs ${pair.needs_training ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                                            {pair.needs_training ? 'Required' : 'Good'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <Link
                                                        href={`/admin/evaluations/details?instructor=${pair.instructor_id}&supervisor=${pair.supervisor_id}&form=${pair.evaluation_form_id}`}
                                                        className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}