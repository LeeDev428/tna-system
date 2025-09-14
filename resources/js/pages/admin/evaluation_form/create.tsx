import AdminLayout from '@/layouts/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft, FileText, Grid, Settings } from 'lucide-react';
import { useState } from 'react';

interface CompetencyElement {
    id?: number;
    description: string;
}

interface CompetencyUnit {
    id?: number;
    title: string;
    description: string;
    elements: CompetencyElement[];
}

interface RatingCriteria {
    label: string;
    scale_options: string[];
}

interface ScaleDescriptions {
    [key: string]: {
        [scale: string]: string;
    };
}

interface CreateEvaluationFormProps {
    defaultScales: ScaleDescriptions;
    breadcrumbs: BreadcrumbItem[];
}

export default function CreateEvaluationForm({ defaultScales, breadcrumbs }: CreateEvaluationFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: 'ASSESSMENT OF CURRENT COMPETENCIES',
        description: 'Self-Rated',
        designation: '',
        office: 'TESDA-CAR',
        division: '',
        period_covered: 'for the period January-December 2025',
        competency_units: [
            {
                title: 'Work within the vocational education and training policy framework',
                description: '',
                elements: [
                    { description: 'Work effectively in the vocational education and training policy framework' },
                    { description: "Manage work and work life to support the organisation's quality framework" },
                ]
            }
        ] as CompetencyUnit[],
        rating_criteria: [
            {
                label: 'Criticality to Job',
                scale_options: ['1', '2', '3', '4']
            },
            {
                label: 'Level of Competence',
                scale_options: ['1', '2', '3', '4']
            },
            {
                label: 'Frequency of Utilization',
                scale_options: ['1', '2', '3', '4']
            }
        ] as RatingCriteria[],
        scale_descriptions: defaultScales
    });

    const [activeTab, setActiveTab] = useState<'basic' | 'units' | 'criteria'>('basic');

    const addCompetencyUnit = () => {
        setData('competency_units', [
            ...data.competency_units,
            {
                title: '',
                description: '',
                elements: [{ description: '' }]
            }
        ]);
    };

    const removeCompetencyUnit = (unitIndex: number) => {
        if (data.competency_units.length > 1) {
            const newUnits = data.competency_units.filter((_, index) => index !== unitIndex);
            setData('competency_units', newUnits);
        }
    };

    const updateCompetencyUnit = (unitIndex: number, field: keyof CompetencyUnit, value: any) => {
        const newUnits = [...data.competency_units];
        newUnits[unitIndex] = { ...newUnits[unitIndex], [field]: value };
        setData('competency_units', newUnits);
    };

    const addElement = (unitIndex: number) => {
        const newUnits = [...data.competency_units];
        newUnits[unitIndex].elements.push({ description: '' });
        setData('competency_units', newUnits);
    };

    const removeElement = (unitIndex: number, elementIndex: number) => {
        const newUnits = [...data.competency_units];
        if (newUnits[unitIndex].elements.length > 1) {
            newUnits[unitIndex].elements = newUnits[unitIndex].elements.filter((_, index) => index !== elementIndex);
            setData('competency_units', newUnits);
        }
    };

    const updateElement = (unitIndex: number, elementIndex: number, description: string) => {
        const newUnits = [...data.competency_units];
        newUnits[unitIndex].elements[elementIndex].description = description;
        setData('competency_units', newUnits);
    };

    const updateRatingCriteria = (criteriaIndex: number, field: keyof RatingCriteria, value: any) => {
        const newCriteria = [...data.rating_criteria];
        newCriteria[criteriaIndex] = { ...newCriteria[criteriaIndex], [field]: value };
        setData('rating_criteria', newCriteria);
    };

    const updateScaleDescription = (scaleType: string, scale: string, description: string) => {
        setData('scale_descriptions', {
            ...data.scale_descriptions,
            [scaleType]: {
                ...data.scale_descriptions[scaleType],
                [scale]: description
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);
        post('/admin/evaluation-forms', {
            onSuccess: () => {
                console.log('Form submitted successfully');
                router.visit('/admin/evaluation-forms');
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            }
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Evaluation Form" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.visit('/admin/evaluation-forms')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Forms
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create Evaluation Form
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Build a comprehensive competency assessment questionnaire
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Navigation Tabs */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex space-x-8">
                            <button
                                type="button"
                                onClick={() => setActiveTab('basic')}
                                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                                    activeTab === 'basic'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <FileText className="w-4 h-4" />
                                Basic Information
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('units')}
                                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                                    activeTab === 'units'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Grid className="w-4 h-4" />
                                Competency Units ({data.competency_units.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('criteria')}
                                className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                                    activeTab === 'criteria'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Settings className="w-4 h-4" />
                                Rating Criteria
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Header Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="title">Form Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1"
                                        placeholder="ASSESSMENT OF CURRENT COMPETENCIES"
                                    />
                                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1"
                                        placeholder="Self-Rated"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                        id="designation"
                                        value={data.designation}
                                        onChange={(e) => setData('designation', e.target.value)}
                                        className="mt-1"
                                        placeholder="Position/Role"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="office">Office *</Label>
                                    <Input
                                        id="office"
                                        value={data.office}
                                        onChange={(e) => setData('office', e.target.value)}
                                        className="mt-1"
                                        placeholder="TESDA-CAR"
                                    />
                                    {errors.office && <p className="text-red-600 text-sm mt-1">{errors.office}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="division">Division</Label>
                                    <Input
                                        id="division"
                                        value={data.division}
                                        onChange={(e) => setData('division', e.target.value)}
                                        className="mt-1"
                                        placeholder="Department/Division"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="period_covered">Period Covered</Label>
                                    <Input
                                        id="period_covered"
                                        value={data.period_covered}
                                        onChange={(e) => setData('period_covered', e.target.value)}
                                        className="mt-1"
                                        placeholder="for the period January-December 2025"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Competency Units Tab */}
                {activeTab === 'units' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Unit of Competency & Elements</h2>
                            <Button type="button" onClick={addCompetencyUnit}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Unit
                            </Button>
                        </div>

                        {data.competency_units.map((unit, unitIndex) => (
                            <Card key={unitIndex} className="border-l-4 border-l-blue-500">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                            Unit {unitIndex + 1}
                                        </CardTitle>
                                        {data.competency_units.length > 1 && (
                                            <Button 
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeCompetencyUnit(unitIndex)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Unit Title *</Label>
                                        <Input
                                            value={unit.title}
                                            onChange={(e) => updateCompetencyUnit(unitIndex, 'title', e.target.value)}
                                            placeholder="e.g., Work within the vocational education and training policy framework"
                                            className="mt-1"
                                        />
                                        {errors[`competency_units.${unitIndex}.title`] && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors[`competency_units.${unitIndex}.title`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Unit Description</Label>
                                        <Textarea
                                            value={unit.description}
                                            onChange={(e) => updateCompetencyUnit(unitIndex, 'description', e.target.value)}
                                            placeholder="Optional description of this competency unit"
                                            className="mt-1"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-base font-medium">Elements</Label>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => addElement(unitIndex)}
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Element
                                            </Button>
                                        </div>

                                        {unit.elements.map((element, elementIndex) => (
                                            <div key={elementIndex} className="flex gap-2">
                                                <div className="flex-1">
                                                    <Textarea
                                                        value={element.description}
                                                        onChange={(e) => updateElement(unitIndex, elementIndex, e.target.value)}
                                                        placeholder="Element description..."
                                                        className="resize-none"
                                                        rows={2}
                                                    />
                                                    {errors[`competency_units.${unitIndex}.elements.${elementIndex}.description`] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {errors[`competency_units.${unitIndex}.elements.${elementIndex}.description`]}
                                                        </p>
                                                    )}
                                                </div>
                                                {unit.elements.length > 1 && (
                                                    <Button 
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeElement(unitIndex, elementIndex)}
                                                        className="text-red-600 hover:text-red-700 self-start mt-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Rating Criteria Tab */}
                {activeTab === 'criteria' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Rating Scale Configuration</h2>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Rating Criteria Labels</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.rating_criteria.map((criteria, index) => (
                                    <div key={index}>
                                        <Label>{['Criticality to Job', 'Level of Competence', 'Frequency of Utilization'][index]}</Label>
                                        <Input
                                            value={criteria.label}
                                            onChange={(e) => updateRatingCriteria(index, 'label', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Scale Descriptions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {Object.entries(data.scale_descriptions).map(([scaleType, descriptions]) => (
                                    <div key={scaleType}>
                                        <Label className="text-base font-medium capitalize">
                                            {scaleType.replace('_', ' ')} Scale
                                        </Label>
                                        <div className="grid grid-cols-4 gap-4 mt-2">
                                            {Object.entries(descriptions).map(([scale, description]) => (
                                                <div key={scale}>
                                                    <Label className="text-sm">Level {scale}</Label>
                                                    <Textarea
                                                        value={description}
                                                        onChange={(e) => updateScaleDescription(scaleType, scale, e.target.value)}
                                                        className="mt-1"
                                                        rows={3}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Submit Section */}
                <Card>
                    <CardContent className="py-6">
                        <div className="flex justify-end space-x-4">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => router.visit('/admin/evaluation-forms')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create Form
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
