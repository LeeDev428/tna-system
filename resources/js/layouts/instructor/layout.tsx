import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { InstructorSidebar } from '@/components/instructor/instructor-sidebar';
import { InstructorHeader } from '@/components/instructor/instructor-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

export default function InstructorLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/img/tna-logo.png" />
            </Head>
            <AppShell variant="sidebar">
                <InstructorSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <InstructorHeader breadcrumbs={breadcrumbs} />
                    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
                        {children}
                    </main>
                </AppContent>
            </AppShell>
        </>
    );
}
