import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Home, LogOut, Users, FileText, ClipboardCheck } from 'lucide-react';

const supervisorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
        icon: Home,
    },
    {
        title: 'Evaluations',
        href: '/supervisor/evaluations',
        icon: ClipboardCheck,
    },
 
];

export function SupervisorSidebar() {
    const { url } = usePage();

    return (
        <Sidebar className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Supervisor Panel</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">TNA System</p>
                    </div>
                </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
                <SidebarMenu>
                    {supervisorNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                                asChild 
                                className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    url === item.href 
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <Link href={item.href}>
                                    {item.icon && <item.icon className="w-5 h-5" />}
                                    <span className="font-medium">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    asChild
                >
                    <Link href="/logout" method="post">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Link>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
