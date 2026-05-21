import { useForm } from '@inertiajs/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { register } from '@/routes';

type RegisterFormProps = {
    onSuccess?: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(register.url(), {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nombre"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus:ring-2 focus:ring-gray-900"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        placeholder="Apellido"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus:ring-2 focus:ring-gray-900"
                    />
                    {errors.last_name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.last_name}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="relative">
                    <Mail
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Correo electrónico"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:ring-2 focus:ring-gray-900"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
            </div>

            <div>
                <div className="relative">
                    <Lock
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Contraseña"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:ring-2 focus:ring-gray-900"
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

            <div>
                <div className="relative">
                    <Lock
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="Confirmar contraseña"
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 focus:ring-2 focus:ring-gray-900"
                    />
                </div>
                {errors.password_confirmation && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
                {processing && <Loader2 className="animate-spin" size={18} />}
                {processing ? 'Registrando...' : 'Crear cuenta'}
            </button>
        </form>
    );
}
