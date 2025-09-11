import AdminLayout from '@/layouts/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface CreateUserProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function CreateUser({ breadcrumbs }: CreateUserProps) {
    const [selectedRole, setSelectedRole] = useState<string>('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: '',
        department: '',
        specialization: '',
        certification_level: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Users
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add a new instructor or supervisor to the system
                    </p>
                </div>
            </div>

            {/* Create User Form */}
            <div className="max-w-2xl">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email address"
                                        className={errors.email ? 'border-red-500' : ''}
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => {
                                        setData('role', value);
                                        setSelectedRole(value);
                                    }}
                                    required
                                >
                                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="supervisor">Supervisor</SelectItem>
                                        <SelectItem value="instructor">Instructor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Note: Admin accounts can only be created by system administrators
                                </p>
                            </div>

                            {/* Conditional Fields Based on Role */}
                            {selectedRole === 'supervisor' && (
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        type="text"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        placeholder="Enter department name"
                                        className={errors.department ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.department} />
                                </div>
                            )}

                            {selectedRole === 'instructor' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input
                                            id="specialization"
                                            type="text"
                                            value={data.specialization}
                                            onChange={(e) => setData('specialization', e.target.value)}
                                            placeholder="e.g., Safety Training, Technical Training"
                                            className={errors.specialization ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.specialization} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="certification_level">Certification Level</Label>
                                        <Select
                                            value={data.certification_level}
                                            onValueChange={(value) => setData('certification_level', value)}
                                        >
                                            <SelectTrigger className={errors.certification_level ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select certification level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Junior">Junior</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                                <SelectItem value="Expert">Expert</SelectItem>
                                                <SelectItem value="Master">Master</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.certification_level} />
                                    </div>
                                </div>
                            )}

                            {/* Default Password Notice */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">!</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Default Password</h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                            The new user will be assigned the default password "password". 
                                            They should change this upon first login.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Link href="/admin/users">
                                    <Button type="button" variant="ghost">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Creating User...' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
