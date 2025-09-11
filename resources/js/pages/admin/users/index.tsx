import AdminLayout from '@/layouts/admin/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, ToggleLeft, ToggleRight, Mail, Calendar } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    email_verified_at: string | null;
    admin_profile?: any;
    supervisor_profile?: any;
    instructor_profile?: any;
}

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function UsersIndex({ users, breadcrumbs }: UsersIndexProps) {
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'supervisor':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'instructor':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const handleToggleStatus = (userId: number) => {
        router.patch(`/admin/users/${userId}/toggle-status`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Total users: {users.total}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        All Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge className={`capitalize ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {user.is_active ? (
                                                    <>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-green-600 dark:text-green-400 text-sm">Active</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                        <span className="text-red-600 dark:text-red-400 text-sm">Inactive</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                >
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                
                                                {user.role !== 'admin' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className={user.is_active 
                                                            ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                            : "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                                        }
                                                    >
                                                        {user.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {users.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No users found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Floating Add Button */}
            <Link href="/admin/users/create">
                <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-6 h-6" />
                </Button>
            </Link>
        </AdminLayout>
    );
}
