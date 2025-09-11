import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <>
            <Head title="Login - TNA System">
                <link rel="icon" type="image/png" href="/img/tna-logo.png" />
            </Head>

            <div className="flex min-h-screen">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-gradient-to-br lg:from-blue-600 lg:to-indigo-700 lg:px-12">
                    <div className="text-center text-white">
                        <img 
                            src="/img/tna-logo.png" 
                            alt="TNA System Logo" 
                            className="mx-auto mb-8 h-24 w-24 drop-shadow-lg filter"
                        />
                        <h1 className="mb-4 text-4xl font-bold">TNA System</h1>
                        <p className="mb-8 text-xl opacity-90">Training and Assessment Management</p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span>Comprehensive Training Management</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span>Advanced Assessment Tools</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span>Real-time Performance Analytics</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex w-full flex-col justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-8 dark:bg-slate-900">
                    <div className="mx-auto w-full max-w-sm">
                        {/* Mobile Logo */}
                        <div className="mb-8 text-center lg:hidden">
                            <img 
                                src="/img/tna-logo.png" 
                                alt="TNA System Logo" 
                                className="mx-auto mb-4 h-16 w-16"
                            />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">TNA System</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Training and Assessment</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Sign in to your TNA System account
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm font-medium text-green-800 dark:bg-green-900/50 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="mt-8 space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="Enter your email"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Checkbox 
                                                id="remember" 
                                                name="remember" 
                                                tabIndex={3}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-800"
                                            />
                                            <Label htmlFor="remember" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                                Remember me
                                            </Label>
                                        </div>

                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>

                                    <div>
                                        <Button 
                                            type="submit" 
                                            className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900" 
                                            tabIndex={4} 
                                            disabled={processing}
                                        >
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            {processing ? 'Signing in...' : 'Sign in'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        {/* Demo Credentials */}
                        <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-slate-800/50">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Demo Credentials:</h3>
                            <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <div>Admin: admin@gmail.com</div>
                                <div>Supervisor: supervisor@gmail.com</div>
                                <div>Instructor: instructor@gmail.com</div>
                                <div className="font-medium">Password: password</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
