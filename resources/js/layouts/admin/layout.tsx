import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

export default function AdminLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/img/tna-logo.png" />
            </Head>
            <AppShell variant="sidebar">
                <AdminSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AdminHeader breadcrumbs={breadcrumbs} />
                    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
                        {children}
                    </main>
                </AppContent>
            </AppShell>
        </>
    );
}
