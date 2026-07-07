import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Loader2,
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    Truck,
    Shield,
    Headphones,
    Star,
    Check,
    X,
} from 'lucide-react';
import register from '@/routes/register';

const PASSWORD_RULES: { label: string; test: (v: string) => boolean }[] = [
    { label: 'Mínimo 12 caracteres', test: (v) => v.length >= 12 },
    { label: 'Una letra mayúscula', test: (v) => /[A-Z]/.test(v) },
    { label: 'Una letra minúscula', test: (v) => /[a-z]/.test(v) },
    { label: 'Un número', test: (v) => /[0-9]/.test(v) },
    {
        label: 'Un símbolo (ej: ! @ # $ %)',
        test: (v) => /[^A-Za-z0-9]/.test(v),
    },
];

function PasswordRequirements({ password }: { password: string }) {
    return (
        <ul className="mt-2 grid gap-1 rounded-lg bg-gray-50 p-3 text-xs">
            {PASSWORD_RULES.map((rule) => {
                const passed = password.length > 0 && rule.test(password);
                return (
                    <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 ${
                            passed ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                        {passed ? (
                            <Check className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                            <X className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                        )}
                        {rule.label}
                    </li>
                );
            })}
        </ul>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <>
            <Head title="Registrarse | ZonaRetail" />
            <main className="min-h-screen bg-white">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    {/* Columna izquierda - Formulario */}
                    <div className="flex flex-1 items-center justify-center px-4 py-12 lg:px-8">
                        <div className="w-full max-w-md">
                            {/* Card del formulario */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-xl lg:shadow-none">
                                <div className="p-8">
                                    <div className="mb-8 text-center lg:text-left">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            Crear cuenta
                                        </h1>
                                        <p className="mt-2 text-gray-500">
                                            Únete a ZonaRetail y comienza a
                                            comprar
                                        </p>
                                    </div>

                                    <Form
                                        action={register.store()}
                                        resetOnError={[
                                            'password',
                                            'password_confirmation',
                                        ]}
                                        className="space-y-5"
                                    >
                                        {({ errors, processing }) => (
                                            <>
                                                {/* Nombres */}
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Nombres
                                                    </label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                                                            placeholder="Juan Carlos"
                                                            autoComplete="given-name"
                                                        />
                                                    </div>
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Apellidos */}
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Apellidos
                                                    </label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                                                            placeholder="Pérez González"
                                                            autoComplete="family-name"
                                                        />
                                                    </div>
                                                    {errors.last_name && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {errors.last_name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Correo electrónico */}
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
                                                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                                                            placeholder="tu@email.com"
                                                            autoComplete="email"
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Contraseña */}
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Lock className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type={
                                                                showPassword
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            name="password"
                                                            value={password}
                                                            onChange={(e) =>
                                                                setPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-12 pl-10 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                                                            placeholder="••••••••"
                                                            autoComplete="new-password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword,
                                                                )
                                                            }
                                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                <Eye className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <PasswordRequirements
                                                        password={password}
                                                    />
                                                    {errors.password && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {errors.password}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Confirmar contraseña */}
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        Confirmar contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Lock className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type={
                                                                showConfirmPassword
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            name="password_confirmation"
                                                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-12 pl-10 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 focus:outline-none"
                                                            placeholder="••••••••"
                                                            autoComplete="new-password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword,
                                                                )
                                                            }
                                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-5 w-5" />
                                                            ) : (
                                                                <Eye className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.password_confirmation && (
                                                        <p className="mt-1 text-sm text-red-500">
                                                            {
                                                                errors.password_confirmation
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Botón de registro */}
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {processing && (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    )}
                                                    {processing
                                                        ? 'Creando cuenta...'
                                                        : 'Registrarse'}
                                                </button>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Información del ecommerce */}
                    <div className="hidden lg:flex lg:flex-1 lg:bg-gradient-to-br lg:from-gray-900 lg:to-gray-800">
                        <div className="flex flex-col justify-center px-12 py-12 text-white">
                            {/* Testimonio o mensaje principal */}
                            <div className="mb-12">
                                <h2 className="mb-4 text-3xl font-bold">
                                    Bienvenido a tu tienda de confianza
                                </h2>
                                <p className="text-lg text-gray-300">
                                    Únete a miles de clientes satisfechos que ya
                                    disfrutan de las mejores ofertas y productos
                                    de calidad.
                                </p>
                            </div>

                            {/* Lista de beneficios */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-white/10 p-2">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Envíos rápidos y seguros
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            Recibe tus productos en la puerta de
                                            tu casa
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-white/10 p-2">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Compra 100% segura
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            Tus datos están protegidos con
                                            nosotros
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-white/10 p-2">
                                        <Headphones className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Soporte 24/7
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            Estamos aquí para ayudarte cuando lo
                                            necesites
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-white/10 p-2">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Garantía de satisfacción
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            Tu opinión es importante para
                                            nosotros
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas o badges */}
                            <div className="mt-12 border-t border-white/10 pt-8">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="text-2xl font-bold">
                                            +10,000
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Clientes felices
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">
                                            +500
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Productos
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">
                                            4.9
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Calificación
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
