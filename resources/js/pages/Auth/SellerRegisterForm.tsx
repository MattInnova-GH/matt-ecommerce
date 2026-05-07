import register from '@/routes/register';
import { Form } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SellerRegisterForm() {
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

    return (
        <Form action={register.seller()} className="space-y-4">
            {({ errors, processing }) => (
                <>
                    {/* Datos personales */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                            Datos personales
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    name="name"
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
                                    name="last_name"
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
                                name="email"
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
                                name="phone"
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
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        placeholder="Contraseña"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                                        name="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Confirmar"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400"
                                    >
                                        {showConfirmPassword
                                            ? 'Ocultar'
                                            : 'Mostrar'}
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
                                    name="business_name"
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
                                    name="business_type"
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
                                    name="tax_id_type"
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
                                    name="tax_id_number"
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
                                name="address"
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
                                name="experience"
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
                        {processing && (
                            <Loader2 className="animate-spin" size={18} />
                        )}
                        {processing
                            ? 'Enviando...'
                            : 'Solicitar cuenta de vendedor'}
                    </button>
                </>
            )}
        </Form>
    );
}
