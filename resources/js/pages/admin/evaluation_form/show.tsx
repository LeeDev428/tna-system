import AdminLayout from '@/layouts/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FileText, Users, Calendar, Building } from 'lucide-react';

interface CompetencyElement {
    id: number;
    description: string;
}

interface CompetencyUnit {
    id: number;
    title: string;
    description: string;
    elements: CompetencyElement[];
}

interface RatingCriteria {
    id: number;
    type: string;
    label: string;
    scale_options: string[];
}

interface RatingScaleDescription {
    id: number;
    scale_type: string;
    descriptions: { [scale: string]: string };
}

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    designation: string;
    office: string;
    division: string;
    period_covered: string;
    is_active: boolean;
    competency_units: CompetencyUnit[];
    rating_criteria: RatingCriteria[];
    rating_scale_descriptions: RatingScaleDescription[];
    created_by: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}

interface ShowEvaluationFormProps {
    evaluationForm: EvaluationForm;
    breadcrumbs: BreadcrumbItem[];
}

export default function ShowEvaluationForm({ evaluationForm, breadcrumbs }: ShowEvaluationFormProps) {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={evaluationForm.title} />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/evaluation-forms">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Forms
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {evaluationForm.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            View evaluation form details
                        </p>
                    </div>
                </div>
                <Link href={`/admin/evaluation-forms/${evaluationForm.id}/edit`}>
                    <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Form
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {/* Form Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Form Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                                <Badge 
                                    variant={evaluationForm.is_active ? "default" : "secondary"}
                                    className={evaluationForm.is_active ? "bg-green-100 text-green-800 mt-1" : "mt-1"}
                                >
                                    {evaluationForm.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            
                            {evaluationForm.description && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                                    <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.description}</p>
                                </div>
                            )}

                            {evaluationForm.designation && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Designation</h4>
                                    <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.designation}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Office</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.office}</p>
                            </div>

                            {evaluationForm.division && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Division</h4>
                                    <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.division}</p>
                                </div>
                            )}

                            {evaluationForm.period_covered && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Period Covered</h4>
                                    <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.period_covered}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Competency Units */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Competency Units ({evaluationForm.competency_units.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {evaluationForm.competency_units.map((unit, index) => (
                                <div key={unit.id} className="border-l-4 border-l-blue-500 pl-4">
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            Unit {index + 1}: {unit.title}
                                        </h3>
                                        {unit.description && (
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">{unit.description}</p>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Elements:</h4>
                                        <div className="space-y-2">
                                            {unit.elements.map((element, elementIndex) => (
                                                <div key={element.id} className="flex gap-2">
                                                    <span className="text-sm text-gray-500 mt-0.5 font-medium">
                                                        {elementIndex + 1}.
                                                    </span>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                        {element.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Rating Criteria */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Rating Criteria
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {evaluationForm.rating_criteria.map((criteria, index) => (
                                <div key={criteria.id}>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {criteria.label}
                                    </h4>
                                    <div className="space-y-2">
                                        {criteria.scale_options.map((option) => {
                                            const scaleDesc = evaluationForm.rating_scale_descriptions.find(
                                                desc => desc.scale_type === criteria.type
                                            );
                                            const description = scaleDesc?.descriptions[option] || '';
                                            
                                            return (
                                                <div key={option} className="flex items-center gap-2">
                                                    <Badge variant="outline" className="min-w-6 h-6 text-xs">
                                                        {option}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {description}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Meta Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Form Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">{evaluationForm.created_by.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{evaluationForm.created_by.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">
                                    {new Date(evaluationForm.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
