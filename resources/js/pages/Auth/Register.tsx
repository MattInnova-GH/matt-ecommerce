import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, Check, Shield, DollarSign, Truck } from 'lucide-react';
import register from '@/routes/register';
import SellerRegisterForm from './SellerRegisterForm';

// ============================================
// COMPONENTE PRINCIPAL - REGISTER PAGE
// ============================================
export default function Register() {
    return (
        <>
            <Head title="Registrarse | ZonaRetail" />
            <main className="min-h-screen bg-white">
                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* Columna izquierda - Formulario */}
                    <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Crear cuenta
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    ¿Ya tienes cuenta?{' '}
                                    <a
                                        href="/login"
                                        className="font-medium text-gray-900 hover:underline"
                                    >
                                        Inicia sesión
                                    </a>
                                </p>
                            </div>
                            <RegisterTabs />
                        </div>
                    </div>

                    {/* Columna derecha - Información */}
                    <RightColumnInfo />
                </div>
            </main>
        </>
    );
}

// ============================================
// REGISTER TABS COMPONENT
// ============================================
function RegisterTabs() {
    const [tab, setTab] = useState<'client' | 'seller'>('client');

    return (
        <div>
            {/* Tabs simples */}
            <div className="mb-6 flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => setTab('client')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        tab === 'client'
                            ? 'border-b-2 border-gray-900 text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Cliente
                </button>
                <button
                    onClick={() => setTab('seller')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        tab === 'seller'
                            ? 'border-b-2 border-gray-900 text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Vendedor
                </button>
            </div>

            {/* Banner vendedor */}
            {tab === 'seller' && (
                <div className="mb-5 border-l-2 border-gray-400 bg-gray-50 p-3 text-sm text-gray-600">
                    Completa tus datos y los de tu negocio. Tu solicitud será
                    revisada en 24-48 horas.
                </div>
            )}

            {tab === 'client' ? <ClientRegisterForm /> : <SellerRegisterForm />}
        </div>
    );
}

// ============================================
// CLIENT REGISTER FORM
// ============================================
function ClientRegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Form
            action={register.store()}
            resetOnError={['password', 'password_confirmation']}
        >
            {({ errors, processing }) => (
                <>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            placeholder="Tu nombre"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            placeholder="Tu apellido"
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.last_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Celular
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            placeholder="+51 987654321"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.phone}
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
                                name="password"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                placeholder="••••••••"
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
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400"
                            >
                                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
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
                        {processing && (
                            <Loader2 className="animate-spin" size={18} />
                        )}
                        {processing ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </>
            )}
        </Form>
    );
}

// ============================================
// RIGHT COLUMN INFO COMPONENT
// ============================================
function RightColumnInfo() {
    const benefits = [
        {
            icon: <Check size={16} />,
            title: 'Llega a más clientes',
            description:
                'Miles de compradores visitan nuestra plataforma cada día',
        },
        {
            icon: <DollarSign size={16} />,
            title: 'Comisiones competitivas',
            description:
                'La comisión más baja del mercado, solo pagas por lo que vendes',
        },
        {
            icon: <Shield size={16} />,
            title: 'Pagos seguros',
            description:
                'Protegemos tu dinero y el de tus clientes en cada transacción',
        },
        {
            icon: <Truck size={16} />,
            title: 'Envíos integrados',
            description: 'Gestión de envíos fácil y con las mejores tarifas',
        },
    ];

    return (
        <div className="hidden flex-col justify-center bg-gray-50 px-12 lg:flex xl:px-20">
            <div className="mx-auto max-w-md">
                <div className="mb-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                        <span className="text-xl font-bold text-white">T</span>
                    </div>
                    <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                        Vende en la tienda más grande de Latinoamérica
                    </h2>
                    <p className="leading-relaxed text-gray-500">
                        Únete a miles de emprendedores que ya confían en
                        nosotros para hacer crecer su negocio.
                    </p>
                </div>

                <div className="space-y-6">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-300"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-900">
                                +10,000
                            </span>{' '}
                            vendedores activos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
