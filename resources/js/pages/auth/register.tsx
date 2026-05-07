// resources/js/Pages/Auth/Register.tsx
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    EyeOff,
    Loader2,
    Check,
    Shield,
    DollarSign,
    Truck,
    Award,
} from 'lucide-react';

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
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    placeholder="Tu nombre"
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Apellido
                </label>
                <input
                    type="text"
                    value={data.last_name}
                    onChange={(e) => setData('last_name', e.target.value)}
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
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Celular
                </label>
                <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    placeholder="+51 987654321"
                />
                {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
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
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
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
                {processing && <Loader2 className="animate-spin" size={18} />}
                {processing ? 'Registrando...' : 'Crear cuenta'}
            </button>
        </form>
    );
}

// ============================================
// SELLER REGISTER FORM
// ============================================
function SellerRegisterForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        // Datos personales
        name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        // Datos del negocio
        business_name: '',
        business_type: '',
        tax_id_type: '',
        tax_id_number: '',
        address: '',
        experience: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const BUSINESS_TYPES = [
        'Tecnología',
        'Ropa y moda',
        'Alimentos',
        'Electrónica',
        'Hogar',
        'Deportes',
        'Salud',
        'Otro',
    ];

    const TAX_ID_TYPES = [
        { value: 'RUC', label: 'RUC' },
        { value: 'DNI', label: 'DNI' },
        { value: 'CE', label: 'Carnet de Extranjería' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register/seller', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datos personales */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                    Datos personales
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nombre"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
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
                            onChange={(e) =>
                                setData('last_name', e.target.value)
                            }
                            placeholder="Apellido"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                        />
                        {errors.last_name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Correo electrónico"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Celular"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Contraseña"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400"
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
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Confirmar"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400"
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
                </div>
            </div>

            {/* Datos del negocio */}
            <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                    Datos del negocio
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <input
                            type="text"
                            value={data.business_name}
                            onChange={(e) =>
                                setData('business_name', e.target.value)
                            }
                            placeholder="Nombre del negocio"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                        />
                        {errors.business_name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.business_name}
                            </p>
                        )}
                    </div>
                    <div>
                        <select
                            value={data.business_type}
                            onChange={(e) =>
                                setData('business_type', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                        >
                            <option value="">Tipo de negocio</option>
                            {BUSINESS_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errors.business_type && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.business_type}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <select
                            value={data.tax_id_type}
                            onChange={(e) =>
                                setData('tax_id_type', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                        >
                            <option value="">Tipo de documento</option>
                            {TAX_ID_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        {errors.tax_id_type && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.tax_id_type}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={data.tax_id_number}
                            onChange={(e) =>
                                setData('tax_id_number', e.target.value)
                            }
                            placeholder="Número de documento"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                        />
                        {errors.tax_id_number && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.tax_id_number}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <input
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Dirección del negocio"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                    {errors.address && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div>
                    <textarea
                        value={data.experience}
                        onChange={(e) => setData('experience', e.target.value)}
                        rows={3}
                        placeholder="Cuéntanos sobre tu experiencia y por qué quieres vender con nosotros..."
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    />
                    {errors.experience && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.experience}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
                {processing && <Loader2 className="animate-spin" size={18} />}
                {processing ? 'Enviando...' : 'Solicitar cuenta de vendedor'}
            </button>
        </form>
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
