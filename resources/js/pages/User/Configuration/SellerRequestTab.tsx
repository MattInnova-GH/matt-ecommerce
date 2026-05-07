import { useState } from 'react';
import { Form } from '@inertiajs/react';
import {
    Store,
    Phone,
    Building2,
    MapPin,
    Briefcase,
    Clock,
    BadgeCheck,
    XCircle,
    TrendingUp,
    Shield,
    Truck,
    FileText,
    Globe,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import configuration from '@/routes/configuration';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | null;

type UserPrefill = {
    phone?: string | null;
    documentType?: DocumentType | null;
    documentNumber?: string | null;
    role?: string | null;
};

type Props = {
    prefill: UserPrefill;
    existingRequestStatus?: RequestStatus;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const DOCUMENT_TYPES = [
    { value: 'DNI', label: 'DNI', icon: FileText },
    { value: 'RUC', label: 'RUC', icon: Building2 },
    { value: 'CE', label: 'Carnet de Extranjería', icon: Globe },
    { value: 'PASAPORTE', label: 'Pasaporte', icon: Globe },
];

const BUSINESS_TYPES = [
    'Ropa y Moda',
    'Electrónica',
    'Hogar y Decoración',
    'Alimentos y Bebidas',
    'Salud y Belleza',
    'Deportes',
    'Tecnología',
    'Otros',
];

const INPUT_CLASS =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all duration-200 hover:border-gray-300 text-sm';

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SellerRequestTab({
    prefill,
    existingRequestStatus,
}: Props) {
    const [selectedDocType, setSelectedDocType] = useState<DocumentType>(
        prefill.documentType ?? 'DNI',
    );

    // Ya es vendedor
    if (prefill.role === 'SELLER') {
        return (
            <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="rounded-full bg-green-50 p-4">
                        <BadgeCheck className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        ¡Ya eres vendedor!
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500">
                        Tu cuenta tiene acceso de vendedor. Puedes gestionar tus
                        productos y pedidos desde el panel de vendedor.
                    </p>
                </div>
            </div>
        );
    }

    // Solicitud enviada / pendiente
    if (existingRequestStatus === 'PENDING') {
        return (
            <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="rounded-full bg-blue-50 p-4">
                        <Clock className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        Solicitud en revisión
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500">
                        Tu solicitud fue enviada correctamente. El equipo la
                        revisará en un plazo máximo de <strong>48 horas</strong>
                        . Te notificaremos por correo cuando haya una respuesta.
                    </p>
                </div>
            </div>
        );
    }

    // Solicitud aprobada (por si acaso)
    if (existingRequestStatus === 'APPROVED') {
        return (
            <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="rounded-full bg-green-50 p-4">
                        <BadgeCheck className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        ¡Solicitud aprobada!
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500">
                        Tu cuenta ha sido actualizada como vendedor. Ya puedes
                        empezar a vender.
                    </p>
                </div>
            </div>
        );
    }

    const wasRejected = existingRequestStatus === 'REJECTED';

    // ── Render principal del formulario ─────────────────────────────────────────

    return (
        <Form
            action={configuration.sellerRequest()}
            method="post"
            className="p-6 sm:p-8 lg:p-10"
        >
            {({ errors, processing, wasSuccessful }) => (
                <>
                    {/* Mensaje de éxito después de enviar */}
                    {wasSuccessful && (
                        <div className="mb-6 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
                            <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                            <p className="text-sm font-medium text-green-800">
                                ¡Solicitud enviada correctamente!
                            </p>
                        </div>
                    )}

                    {/* Banner de solicitud rechazada */}
                    {wasRejected && (
                        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    Solicitud anterior rechazada
                                </p>
                                <p className="mt-0.5 text-xs text-amber-700">
                                    Puedes enviar una nueva solicitud con
                                    información actualizada.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Banner informativo */}
                    <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <div className="flex gap-4">
                            <div className="shrink-0 rounded-xl border border-gray-200 bg-white p-2.5">
                                <Store className="h-5 w-5 text-gray-700" />
                            </div>
                            <div className="flex-1">
                                <h3 className="mb-1 font-semibold text-gray-900">
                                    ¿Por qué vender con nosotros?
                                </h3>
                                <p className="mb-3 text-sm text-gray-600">
                                    Revisaremos tu solicitud en un plazo máximo
                                    de 48 horas hábiles.
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <TrendingUp
                                            size={13}
                                            className="text-blue-500"
                                        />
                                        +10K ventas/mes
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Shield
                                            size={13}
                                            className="text-green-500"
                                        />
                                        Pagos seguros
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Truck
                                            size={13}
                                            className="text-purple-500"
                                        />
                                        Logística integrada
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* ── Información del negocio ─────────────────────────────────────── */}
                        <section>
                            <SectionTitle
                                icon={<Building2 size={18} />}
                                title="Información del negocio"
                            />
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    label="Nombre del negocio"
                                    required
                                    error={errors.business_name}
                                >
                                    <input
                                        type="text"
                                        name="business_name"
                                        defaultValue=""
                                        className={INPUT_CLASS}
                                        placeholder="Ej: Tienda Elegante SAC"
                                    />
                                </FormField>

                                <FormField
                                    label="Tipo de negocio"
                                    required
                                    error={errors.business_type}
                                >
                                    <select
                                        name="business_type"
                                        defaultValue=""
                                        className={INPUT_CLASS}
                                    >
                                        <option value="">
                                            Selecciona una categoría
                                        </option>
                                        {BUSINESS_TYPES.map((bt) => (
                                            <option key={bt} value={bt}>
                                                {bt}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                        </section>

                        {/* ── Documento tributario ────────────────────────────────────────── */}
                        <section>
                            <SectionTitle
                                icon={<FileText size={18} />}
                                title="Documento tributario"
                            />

                            {/* Selector tipo documento */}
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tipo de documento{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {DOCUMENT_TYPES.map(
                                        ({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDocType(value);
                                                    // Actualizar el input hidden
                                                    const hiddenInput =
                                                        document.querySelector(
                                                            'input[name="tax_id_type"]',
                                                        ) as HTMLInputElement;
                                                    if (hiddenInput) {
                                                        hiddenInput.value =
                                                            value;
                                                    }
                                                }}
                                                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                                                    selectedDocType === value
                                                        ? 'border-black bg-black text-white shadow-sm'
                                                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                                                }`}
                                            >
                                                <Icon size={15} />
                                                {label}
                                            </button>
                                        ),
                                    )}
                                </div>
                                <input
                                    type="hidden"
                                    name="tax_id_type"
                                    defaultValue={prefill.documentType ?? 'DNI'}
                                />
                                {errors.tax_id_type && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {errors.tax_id_type}
                                    </p>
                                )}
                            </div>

                            <FormField
                                label={`Número de ${selectedDocType}`}
                                required
                                error={errors.tax_id_number}
                            >
                                <input
                                    type="text"
                                    name="tax_id_number"
                                    defaultValue={prefill.documentNumber ?? ''}
                                    className={INPUT_CLASS}
                                    placeholder={
                                        selectedDocType === 'RUC'
                                            ? '20XXXXXXXXX'
                                            : selectedDocType === 'DNI'
                                              ? '12345678'
                                              : selectedDocType === 'PASAPORTE'
                                                ? 'AB123456'
                                                : '000123456'
                                    }
                                    maxLength={
                                        selectedDocType === 'RUC'
                                            ? 11
                                            : selectedDocType === 'DNI'
                                              ? 8
                                              : 20
                                    }
                                />
                            </FormField>

                            {/* Aviso si ya tiene documento registrado */}
                            {prefill.documentNumber && (
                                <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                                    <CheckCircle
                                        size={12}
                                        className="text-green-500"
                                    />
                                    Usando el documento registrado en tu perfil.
                                    Puedes cambiarlo si es necesario.
                                </p>
                            )}
                        </section>

                        {/* ── Contacto ────────────────────────────────────────────────────── */}
                        <section>
                            <SectionTitle
                                icon={<Phone size={18} />}
                                title="Contacto del negocio"
                            />
                            <FormField
                                label="Teléfono / Celular de contacto"
                                required
                                hint="Se usará para contactarte sobre tu solicitud"
                                error={errors.phone}
                            >
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={prefill.phone ?? ''}
                                    className={INPUT_CLASS}
                                    placeholder="+51 987 654 321"
                                />
                            </FormField>
                            {prefill.phone && (
                                <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                                    <CheckCircle
                                        size={12}
                                        className="text-green-500"
                                    />
                                    Pre-rellenado con el teléfono de tu perfil.
                                </p>
                            )}
                        </section>

                        {/* ── Ubicación ───────────────────────────────────────────────────── */}
                        <section>
                            <SectionTitle
                                icon={<MapPin size={18} />}
                                title="Ubicación del negocio"
                            />
                            <FormField
                                label="Dirección completa"
                                required
                                error={errors.address}
                            >
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue=""
                                    className={INPUT_CLASS}
                                    placeholder="Av. Principal 123, Lima, Perú"
                                />
                            </FormField>
                        </section>

                        {/* ── Experiencia y motivación ─────────────────────────────────────── */}
                        <section>
                            <SectionTitle
                                icon={<Briefcase size={18} />}
                                title="Experiencia y motivación"
                            />
                            <div className="space-y-5">
                                <FormField
                                    label="Experiencia en ventas"
                                    required
                                    hint="Mínimo 20 caracteres. Cuéntanos qué productos vendes o has vendido."
                                    error={errors.experience}
                                >
                                    <textarea
                                        name="experience"
                                        rows={3}
                                        defaultValue=""
                                        className={`${INPUT_CLASS} resize-none`}
                                        placeholder="Ej: Llevo 3 años vendiendo ropa deportiva en ferias y redes sociales..."
                                    />
                                </FormField>

                                <FormField
                                    label="¿Por qué quieres vender con nosotros?"
                                    required
                                    hint="Cuéntanos tus expectativas y cómo planeas usar la plataforma."
                                    error={errors.message}
                                >
                                    <textarea
                                        name="message"
                                        rows={3}
                                        defaultValue=""
                                        className={`${INPUT_CLASS} resize-none`}
                                        placeholder="Ej: Quiero llegar a más clientes y tener una tienda online profesional..."
                                    />
                                </FormField>
                            </div>
                        </section>
                    </div>

                    {/* Acciones */}
                    <div className="mt-8 flex flex-col justify-end gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                        <button
                            type="reset"
                            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
                        >
                            Limpiar campos
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-black px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Store size={16} />
                                    Enviar solicitud
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </Form>
    );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionTitle({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
            <div className="rounded-lg bg-gray-100 p-1.5 text-gray-600">
                {icon}
            </div>
            {title}
        </h3>
    );
}

function FormField({
    label,
    hint,
    required,
    error,
    children,
}: {
    label: string;
    hint?: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            {hint && !error && (
                <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
            )}
        </div>
    );
}
