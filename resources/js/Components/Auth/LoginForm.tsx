import { useForm } from '@inertiajs/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

type LoginFormProps = {
    onSuccess?: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
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
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
                        placeholder="tu@email.com"
                        required
                    />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
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
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
                        placeholder="••••••••"
                        required
                    />
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    Recordarme
                </label>
                <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
                {processing && <Loader2 className="animate-spin" size={18} />}
                {processing ? 'Iniciando...' : 'Iniciar sesión'}
            </button>

            <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link className="cursor-pointer" href="/register">
                    <button
                        type="button"
                        className="cursor-pointer font-bold text-gray-900 hover:underline"
                    >
                        Regístrate
                    </button>
                </Link>
            </p>
        </form>
    );
}
