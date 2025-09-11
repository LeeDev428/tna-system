import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';

interface AdminHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AdminHeader({ breadcrumbs = [] }: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left section with breadcrumbs */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Admin Dashboard
                    </h1>
                    {breadcrumbs.length > 0 && (
                        <div className="hidden md:block">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    )}
                </div>

                {/* Right section with user menu and notifications */}
                <div className="flex items-center gap-4">
                 
                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2 px-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">{getInitials(auth.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Admin</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
