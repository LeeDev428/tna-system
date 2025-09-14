import AdminLayout from '@/layouts/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, MoreHorizontal, Edit, Eye, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    designation: string;
    office: string;
    division: string;
    period_covered: string;
    is_active: boolean;
    created_by: {
        name: string;
        email: string;
    };
    competency_units: Array<{
        id: number;
        title: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface EvaluationFormIndexProps {
    evaluationForms: {
        data: EvaluationForm[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function EvaluationFormIndex({ evaluationForms, breadcrumbs }: EvaluationFormIndexProps) {
    const handleDelete = (formId: number, formTitle: string) => {
        if (confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
            router.delete(`/admin/evaluation-forms/${formId}`, {
                onSuccess: () => {
                    // Success message will be shown via flash message
                },
                onError: () => {
                    alert('Failed to delete the evaluation form. Please try again.');
                }
            });
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Evaluation Forms" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Evaluation Forms
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage competency assessment forms and questionnaires
                    </p>
                </div>
                <Link href="/admin/evaluation-forms/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Form
                    </Button>
                </Link>
            </div>

            {/* Forms Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        All Evaluation Forms ({evaluationForms.total})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {evaluationForms.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Designation</TableHead>
                                        <TableHead>Office/Division</TableHead>
                                        <TableHead>Units</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {evaluationForms.data.map((form) => (
                                        <TableRow key={form.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {form.title}
                                                    </p>
                                                    {form.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                                                            {form.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {form.designation || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {form.office && (
                                                        <div className="font-medium">{form.office}</div>
                                                    )}
                                                    {form.division && (
                                                        <div className="text-gray-600 dark:text-gray-400">
                                                            {form.division}
                                                        </div>
                                                    )}
                                                    {!form.office && !form.division && '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {form.competency_units.length} units
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={form.is_active ? "default" : "secondary"}
                                                    className={form.is_active ? "bg-green-100 text-green-800" : ""}
                                                >
                                                    {form.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                                <div>{format(new Date(form.created_at), 'MMM d, yyyy')}</div>
                                                <div className="text-xs">by {form.created_by.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/evaluation-forms/${form.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/evaluation-forms/${form.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-red-600"
                                                            onClick={() => handleDelete(form.id, form.title)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No Evaluation Forms
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Get started by creating your first evaluation form.
                            </p>
                            <Link href="/admin/evaluation-forms/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Form
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {evaluationForms.last_page > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2">
                        {Array.from({ length: evaluationForms.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/evaluation-forms?page=${page}`}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    page === evaluationForms.current_page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}