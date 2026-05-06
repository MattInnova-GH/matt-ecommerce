import { Form } from '@inertiajs/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import login from '@/routes/login';

type LoginFormProps = {
    onSuccess?: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
    return (
        <div>
            <Form
                onSuccess={onSuccess}
                action={login.store()}
                className="flex flex-col gap-4"
            >
                {({ errors, processing }) => (
                    <>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                        >
                            {processing && (
                                <Loader2 className="animate-spin" size={18} />
                            )}
                            {processing ? 'Iniciando...' : 'Iniciar sesión'}
                        </button>
                    </>
                )}
            </Form>

            <p className="mt-4 text-center text-sm text-gray-500">
                No tienes una cuenta?{' '}
                <a href="/register" className="font-medium text-gray-900">
                    Registrate
                </a>
            </p>
        </div>
    );
}
