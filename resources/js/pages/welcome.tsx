import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="TNA System - Training and Assessment">
                <link rel="icon" type="image/png" href="/img/tna-logo.png" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {/* Header */}
                <header className="w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-3">
                            <img src="/img/tna-logo.png" alt="TNA Logo" className="h-10 w-10" />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">TNA System</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Training and Assessment</p>
                            </div>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                >
                                    Log in
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-4xl text-center">
                        <div className="mb-8">
                            <img 
                                src="/img/tna-logo.png" 
                                alt="TNA System Logo" 
                                className="mx-auto mb-6 h-24 w-24 drop-shadow-lg"
                            />
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                TNA System
                            </h1>
                            <p className="mb-2 text-xl text-gray-600 dark:text-gray-400">
                                Training and Assessment Management
                            </p>
                            <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-500">
                                A comprehensive platform for managing training programs, conducting assessments, 
                                and tracking performance across your organization.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="mb-12 grid gap-8 sm:grid-cols-3">
                            <div className="rounded-xl bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Training Management</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Organize and track training programs for instructors and supervisors.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Assessment Tools</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Create and conduct comprehensive evaluations and assessments.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Track progress and generate detailed performance reports.
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth.user && (
                            <div className="space-y-4">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Get Started
                                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Contact your administrator for access credentials
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-slate-900/80">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                © 2025 TNA System. Training and Assessment Management Platform.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
