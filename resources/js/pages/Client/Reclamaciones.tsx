import { Head } from '@inertiajs/react';
import { ClipboardList, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Reclamaciones() {
    return (
        <>
            <Head title="Libro de Reclamaciones" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                                <ClipboardList className="h-7 w-7 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Libro de Reclamaciones
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Conforme al Código de Protección y Defensa
                                    del Consumidor – Ley N° 29571
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        {/* Aviso legal */}
                        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p className="text-sm text-amber-800">
                                La formulación de una reclamación no impide
                                acudir a otras vías de solución de
                                controversias ni es requisito previo para
                                interponer una denuncia ante el INDECOPI.
                            </p>
                        </div>

                        {/* Formulario */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                Datos del consumidor
                            </h2>

                            <div className="space-y-5">
                                {/* Nombre */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Nombres"
                                        placeholder="Ej: Juan"
                                        required
                                    />
                                    <Field
                                        label="Apellidos"
                                        placeholder="Ej: García Pérez"
                                        required
                                    />
                                </div>

                                {/* Contacto */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="DNI / RUC"
                                        placeholder="12345678"
                                        required
                                    />
                                    <Field
                                        label="Teléfono"
                                        placeholder="+51 987 654 321"
                                        type="tel"
                                    />
                                </div>

                                <Field
                                    label="Correo electrónico"
                                    placeholder="correo@ejemplo.com"
                                    type="email"
                                    required
                                />

                                <Field
                                    label="Dirección"
                                    placeholder="Calle, número, distrito, ciudad"
                                />
                            </div>
                        </div>

                        {/* Bien / Servicio */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                Identificación del bien contratado
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Tipo
                                    </label>
                                    <div className="flex gap-4">
                                        {['Producto', 'Servicio'].map(
                                            (tipo) => (
                                                <label
                                                    key={tipo}
                                                    className="flex cursor-pointer items-center gap-2 text-sm"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="tipo"
                                                        value={tipo}
                                                        className="accent-gray-900"
                                                    />
                                                    {tipo}
                                                </label>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <Field
                                    label="Descripción del bien o servicio"
                                    placeholder="Describe brevemente el producto o servicio adquirido"
                                    required
                                />

                                <Field
                                    label="Monto reclamado (S/)"
                                    placeholder="0.00"
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Reclamación */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                Detalle de la reclamación
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Tipo de reclamación
                                    </label>
                                    <div className="flex gap-4">
                                        {['Reclamo', 'Queja'].map((t) => (
                                            <label
                                                key={t}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <input
                                                    type="radio"
                                                    name="tipo_reclamo"
                                                    value={t}
                                                    className="accent-gray-900"
                                                />
                                                {t}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-400">
                                        <strong>Reclamo:</strong> disconformidad
                                        con el producto/servicio.{' '}
                                        <strong>Queja:</strong> malestar con la
                                        atención al cliente.
                                    </p>
                                </div>

                                <TextAreaField
                                    label="Descripción del problema"
                                    placeholder="Describe con detalle lo ocurrido, incluyendo fechas y circunstancias relevantes..."
                                    required
                                    rows={5}
                                />

                                <TextAreaField
                                    label="Pedido del consumidor"
                                    placeholder="¿Qué solución esperas? (reembolso, cambio, reparación, etc.)"
                                    required
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="button"
                                disabled
                                className="w-full cursor-not-allowed rounded-xl bg-gray-300 py-4 text-sm font-semibold text-gray-500 sm:w-auto sm:px-16"
                            >
                                Enviar reclamación
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                Esta funcionalidad estará disponible próximamente.
                                Por ahora, puedes contactarnos directamente.
                            </p>
                        </div>

                        {/* Contacto alternativo */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold text-gray-900">
                                Contacto directo
                            </h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>+51 XXX XXX XXX</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>reclamaciones@empresa.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>Dirección de la empresa, Lima – Perú</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Field({
    label,
    placeholder,
    type = 'text',
    required = false,
}: {
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
        </div>
    );
}

function TextAreaField({
    label,
    placeholder,
    required = false,
    rows = 4,
}: {
    label: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <textarea
                rows={rows}
                placeholder={placeholder}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
        </div>
    );
}
