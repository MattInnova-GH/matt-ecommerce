import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import login from '@/routes/login';

export default function Login() {
    return (
        <>
            <Head title="Iniciar sesión" />
            <main className="min-h-screen bg-white">
                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* Columna izquierda - Formulario */}
                    <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Iniciar sesión
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    ¿No tienes cuenta? href="/register"
                                    className="font-medium text-gray-900
                                    hover:underline"
                                    <a>Regístrate</a>
                                </p>
                            </div>
                        </div>

                        <LoginForm />
                    </div>

                    {/* Columna derecha */}
                    <div className="hidden flex-col justify-center bg-gray-50 px-12 lg:flex xl:px-20">
                        <div className="mx-auto max-w-md">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                                <span className="text-xl font-bold text-white">
                                    Z
                                </span>
                            </div>
                            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                                Bienvenido de vuelta
                            </h2>
                            <p className="leading-relaxed text-gray-500">
                                Accede a tu cuenta para gestionar tus pedidos,
                                favoritos y mucho más.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Form action={login.store()} className="space-y-4">
            {({ errors, processing }) => (
                <>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            placeholder="tu@email.com"
                            autoComplete="email"
                            name="email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                name="password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400"
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                            />
                            Recordarme
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >
                        {processing && (
                            <Loader2 className="animate-spin" size={18} />
                        )}
                        {processing ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </>
            )}
        </Form>
    );
}
