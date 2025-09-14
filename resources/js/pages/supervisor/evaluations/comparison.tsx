import SupervisorLayout from '@/layouts/supervisor/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    TrendingUp, 
    TrendingDown,
    ArrowLeft,
    FileText,
    User,
    Award,
    AlertCircle
} from 'lucide-react';

interface CompetencyElement {
    id: number;
    title: string;
    description: string;
}

interface CompetencyUnit {
    id: number;
    title: string;
    elements: CompetencyElement[];
}

interface EvaluationForm {
    id: number;
    title: string;
    description: string;
    office: string;
    division: string;
    period_covered: string;
    competency_units: CompetencyUnit[];
}

interface Instructor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    certification_level: string;
}

interface EvaluationComparison {
    competency_element_id: number;
    element_title: string;
    element_description: string;
    unit_title: string;
    self_criticality: number | null;
    self_competence: number | null;
    self_frequency: number | null;
    self_cpr: number | null;
    supervisor_criticality: number | null;
    supervisor_competence: number | null;
    supervisor_frequency: number | null;
    supervisor_cpr: number | null;
    final_cpr: number | null;
    needs_training: boolean;
    rating_difference: 'match' | 'higher_self' | 'higher_supervisor' | 'missing_data';
}

interface ComparisonResultsProps {
    evaluationForm: EvaluationForm;
    instructor: Instructor;
    comparisons: EvaluationComparison[];
    breadcrumbs: BreadcrumbItem[];
}

export default function ComparisonResults({ 
    evaluationForm, 
    instructor, 
    comparisons, 
    breadcrumbs 
}: ComparisonResultsProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getCprColor = (cpr: number | null) => {
        if (cpr === null) return 'text-gray-400';
        if (cpr >= 21) return 'text-green-600';
        if (cpr >= 12) return 'text-orange-500';
        return 'text-red-600';
    };

    const getCprBadge = (cpr: number | null, needsTraining: boolean) => {
        if (cpr === null) return <Badge variant="outline">No Data</Badge>;
        if (needsTraining) {
            return <Badge className="bg-red-100 text-red-800 border-red-300">Needs Training</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800 border-green-300">Competent</Badge>;
    };

    const getDifferenceIcon = (difference: string) => {
        switch (difference) {
            case 'match':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'higher_supervisor':
                return <TrendingDown className="w-4 h-4 text-blue-600" />;
            case 'higher_self':
                return <TrendingUp className="w-4 h-4 text-orange-500" />;
            case 'missing_data':
                return <XCircle className="w-4 h-4 text-gray-400" />;
            default:
                return null;
        }
    };

    const trainingNeeded = comparisons.filter(c => c.needs_training).length;
    const totalElements = comparisons.length;
    const competencyRate = totalElements > 0 ? ((totalElements - trainingNeeded) / totalElements * 100).toFixed(1) : '0';

    const ratingMatches = comparisons.filter(c => c.rating_difference === 'match').length;
    const agreementRate = totalElements > 0 ? (ratingMatches / totalElements * 100).toFixed(1) : '0';

    return (
        <SupervisorLayout breadcrumbs={breadcrumbs}>
            <Head title={`Evaluation Results - ${instructor.name}`} />
            
            {/* Header */}
            <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-lg">
                                {getInitials(instructor.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Evaluation Results
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300 text-lg">
                                {instructor.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {instructor.email} • {instructor.specialization}
                            </p>
                        </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Competency Rate</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{competencyRate}%</p>
                            <p className="text-xs text-gray-500">
                                {totalElements - trainingNeeded} of {totalElements} elements
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Training Needed</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{trainingNeeded}</p>
                            <p className="text-xs text-gray-500">elements require training</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating Agreement</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{agreementRate}%</p>
                            <p className="text-xs text-gray-500">
                                {ratingMatches} of {totalElements} match
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Elements</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{totalElements}</p>
                            <p className="text-xs text-gray-500">competency elements</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Rating Comparison Legend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Ratings Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span>Self-Rating Higher</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-blue-600" />
                            <span>Supervisor Rating Higher</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-gray-400" />
                            <span>Incomplete Data</span>
                        </div>
                    </div>
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Final Decision:</strong> Supervisor ratings take priority. 
                                CPR score below 21 indicates training is needed.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Comparison */}
            <div className="space-y-6">
                {evaluationForm.competency_units.map((unit) => {
                    const unitComparisons = comparisons.filter(c => c.unit_title === unit.title);
                    
                    return (
                        <Card key={unit.id} className="bg-white dark:bg-gray-800">
                            <CardHeader className="bg-gray-50 dark:bg-gray-900/50">
                                <CardTitle className="text-lg text-gray-900 dark:text-white">
                                    {unit.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 dark:bg-gray-900">
                                            <tr>
                                                <th className="text-left p-3 font-medium">Element</th>
                                                <th className="text-center p-3 font-medium min-w-24">Sr (Self)</th>
                                                <th className="text-center p-3 font-medium min-w-24">Sp (Supervisor)</th>
                                                <th className="text-center p-3 font-medium min-w-20">Final CPR</th>
                                                <th className="text-center p-3 font-medium min-w-32">Status</th>
                                                <th className="text-center p-3 font-medium min-w-20">Agreement</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unitComparisons.map((comparison) => (
                                                <tr key={comparison.competency_element_id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="p-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                {comparison.element_title}
                                                            </p>
                                                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                                                {comparison.element_description}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {comparison.self_cpr !== null ? (
                                                            <div className="space-y-1">
                                                                <div className="text-xs text-gray-500">
                                                                    {comparison.self_criticality} × {comparison.self_competence} × {comparison.self_frequency}
                                                                </div>
                                                                <div className={`font-bold ${getCprColor(comparison.self_cpr)}`}>
                                                                    {comparison.self_cpr}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No data</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {comparison.supervisor_cpr !== null ? (
                                                            <div className="space-y-1">
                                                                <div className="text-xs text-gray-500">
                                                                    {comparison.supervisor_criticality} × {comparison.supervisor_competence} × {comparison.supervisor_frequency}
                                                                </div>
                                                                <div className={`font-bold ${getCprColor(comparison.supervisor_cpr)}`}>
                                                                    {comparison.supervisor_cpr}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No data</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className={`font-bold text-lg ${getCprColor(comparison.final_cpr)}`}>
                                                            {comparison.final_cpr || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {getCprBadge(comparison.final_cpr, comparison.needs_training)}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex justify-center">
                                                            {getDifferenceIcon(comparison.rating_difference)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6">
                <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Evaluations
                </Button>
                
                {trainingNeeded > 0 && (
                    <div className="flex gap-2">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Generate Training Plan
                        </Button>
                        <Button variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                )}
            </div>
        </SupervisorLayout>
    );
}
