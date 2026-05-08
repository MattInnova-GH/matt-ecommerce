import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Iniciar Sesión | ZonaRetail" />
            <main className="min-h-screen bg-white">
                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* Columna izquierda - Formulario */}
                    <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Bienvenido de nuevo
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    ¿No tienes cuenta?{' '}
                                    <a
                                        href="/register"
                                        className="font-medium text-gray-900 hover:underline"
                                    >
                                        Regístrate gratis
                                    </a>
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <Form action="/login" className="space-y-6">
                                {({ errors, processing }) => (
                                    <>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Correo electrónico
                                            </label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoComplete="username"
                                                    className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none sm:text-sm"
                                                    placeholder="tu@email.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Contraseña
                                                </label>
                                                {canResetPassword && (
                                                    <a
                                                        href="/forgot-password"
                                                        className="text-xs font-medium text-gray-600 hover:text-gray-900"
                                                    >
                                                        ¿Olvidaste tu contraseña?
                                                    </a>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    autoComplete="current-password"
                                                    className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none sm:text-sm"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400"
                                                >
                                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="remember"
                                                name="remember"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                                Recordarme
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin" size={18} />
                                            )}
                                            {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    {/* Columna derecha - Imagen/Info */}
                    <div className="hidden bg-gray-50 lg:block">
                        <div className="flex h-full flex-col items-center justify-center px-12 xl:px-24">
                             <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 shadow-xl">
                                <ShieldCheck className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900">
                                Tu compra segura está aquí
                            </h2>
                            <p className="max-w-md text-center text-lg leading-relaxed text-gray-500">
                                Accede a miles de productos con la garantía y seguridad que solo nosotros te ofrecemos.
                            </p>
                            
                            <div className="mt-12 grid grid-cols-2 gap-6">
                                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                    <p className="text-2xl font-bold text-gray-900">100%</p>
                                    <p className="text-sm text-gray-500">Garantía</p>
                                </div>
                                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                                    <p className="text-sm text-gray-500">Soporte</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
