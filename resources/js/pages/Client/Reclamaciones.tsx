import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
import React from 'react';

type ComplaintForm = {
    first_name: string;
    last_name: string;
    document_number: string;
    phone: string;
    email: string;
    address: string;
    asset_type: string;
    asset_description: string;
    claimed_amount: string;
    complaint_type: string;
    problem_description: string;
    consumer_request: string;
};

type FieldName = keyof ComplaintForm;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿñÑ\s]+$/;
const DOCUMENT_REGEX = /^(\d{8}|\d{11})$/;
const PHONE_REGEX = /^\d{6,9}$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

function validateField(field: FieldName, value: string): string | undefined {
    const trimmed = value.trim();

    switch (field) {
        case 'first_name':
        case 'last_name':
            if (!trimmed) return 'Este campo es obligatorio.';
            if (!NAME_REGEX.test(trimmed))
                return 'Solo se permiten letras y espacios.';
            return undefined;

        case 'document_number':
            if (!trimmed) return 'Este campo es obligatorio.';
            if (!DOCUMENT_REGEX.test(trimmed))
                return 'Ingresa un DNI (8 dígitos) o RUC (11 dígitos) válido, solo números.';
            return undefined;

        case 'phone':
            if (!trimmed) return undefined;
            if (!PHONE_REGEX.test(trimmed))
                return 'Ingresa solo números (6 a 9 dígitos).';
            return undefined;

        case 'email':
            if (!trimmed) return 'Este campo es obligatorio.';
            if (!EMAIL_REGEX.test(trimmed))
                return 'Ingresa un correo electrónico válido.';
            return undefined;

        case 'address':
            return undefined;

        case 'asset_type':
            return trimmed ? undefined : 'Selecciona una opción.';

        case 'asset_description':
            return trimmed ? undefined : 'Este campo es obligatorio.';

        case 'claimed_amount':
            if (!trimmed) return undefined;
            if (!AMOUNT_REGEX.test(trimmed) || Number(trimmed) <= 0)
                return 'Ingresa un monto válido (solo números, máx. 2 decimales).';
            return undefined;

        case 'complaint_type':
            return trimmed ? undefined : 'Selecciona una opción.';

        case 'problem_description':
            if (!trimmed) return 'Este campo es obligatorio.';
            if (trimmed.length < 10)
                return 'Describe con más detalle (mínimo 10 caracteres).';
            return undefined;

        case 'consumer_request':
            return trimmed ? undefined : 'Este campo es obligatorio.';

        default:
            return undefined;
    }
}

const FIELDS: FieldName[] = [
    'first_name',
    'last_name',
    'document_number',
    'phone',
    'email',
    'address',
    'asset_type',
    'asset_description',
    'claimed_amount',
    'complaint_type',
    'problem_description',
    'consumer_request',
];

export default function Reclamaciones() {
    const { flash } = usePage().props as { flash?: { success?: string } };

    const { data, setData, post, processing, errors, reset } =
        useForm<ComplaintForm>({
            first_name: '',
            last_name: '',
            document_number: '',
            phone: '',
            email: '',
            address: '',
            asset_type: 'Producto',
            asset_description: '',
            claimed_amount: '',
            complaint_type: 'Reclamo',
            problem_description: '',
            consumer_request: '',
        });

    const [touched, setTouched] = React.useState<
        Partial<Record<FieldName, boolean>>
    >({});

    const fieldErrors = React.useMemo(() => {
        const result: Partial<Record<FieldName, string>> = {};
        for (const field of FIELDS) {
            const message = validateField(field, data[field]);
            if (message) result[field] = message;
        }
        return result;
    }, [data]);

    const isFormValid = Object.keys(fieldErrors).length === 0;

    function handleBlur(field: FieldName) {
        setTouched((prev) => ({ ...prev, [field]: true }));
    }

    function getError(field: FieldName): string | undefined {
        if (touched[field] && fieldErrors[field]) return fieldErrors[field];
        return errors[field];
    }

    function setDigitsOnly(field: FieldName, value: string, maxLength: number) {
        setData(field, value.replace(/\D/g, '').slice(0, maxLength));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        setTouched(
            FIELDS.reduce(
                (acc, field) => ({ ...acc, [field]: true }),
                {} as Record<FieldName, boolean>,
            ),
        );

        if (!isFormValid) return;

        post('/libro-de-reclamaciones', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setTouched({});
            },
        });
    }

    return (
        <>
            <Head title="Libro de Reclamaciones" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-red-100">
                                <img
                                    src="/img/libro-reclamaciones.jpeg"
                                    alt="Libro de Reclamaciones"
                                    className="h-full w-full object-cover"
                                />
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
                    <form
                        onSubmit={submit}
                        noValidate
                        className="mx-auto max-w-3xl space-y-8"
                    >
                        {/* Aviso legal */}
                        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p className="text-sm text-amber-800">
                                La formulación de una reclamación no impide
                                acudir a otras vías de solución de controversias
                                ni es requisito previo para interponer una
                                denuncia ante el INDECOPI. Conforme al Código de
                                Protección y Defensa del Consumidor – Ley N°
                                29571, tenemos un plazo máximo de{' '}
                                <strong>30 días calendario</strong> para dar
                                respuesta a tu reclamo o queja.
                            </p>
                        </div>

                        {flash?.success && (
                            <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                <p className="text-sm text-green-800">
                                    {flash.success}
                                </p>
                            </div>
                        )}

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
                                        value={data.first_name}
                                        onChange={(v) =>
                                            setData('first_name', v)
                                        }
                                        onBlur={() => handleBlur('first_name')}
                                        error={getError('first_name')}
                                    />
                                    <Field
                                        label="Apellidos"
                                        placeholder="Ej: García Pérez"
                                        required
                                        value={data.last_name}
                                        onChange={(v) =>
                                            setData('last_name', v)
                                        }
                                        onBlur={() => handleBlur('last_name')}
                                        error={getError('last_name')}
                                    />
                                </div>

                                {/* Contacto */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="DNI / RUC"
                                        placeholder="12345678"
                                        required
                                        inputMode="numeric"
                                        maxLength={11}
                                        value={data.document_number}
                                        onChange={(v) =>
                                            setDigitsOnly(
                                                'document_number',
                                                v,
                                                11,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur('document_number')
                                        }
                                        error={getError('document_number')}
                                    />
                                    <Field
                                        label="Teléfono"
                                        placeholder="987654321"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={9}
                                        value={data.phone}
                                        onChange={(v) =>
                                            setDigitsOnly('phone', v, 9)
                                        }
                                        onBlur={() => handleBlur('phone')}
                                        error={getError('phone')}
                                    />
                                </div>

                                <Field
                                    label="Correo electrónico"
                                    placeholder="correo@ejemplo.com"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(v) => setData('email', v)}
                                    onBlur={() => handleBlur('email')}
                                    error={getError('email')}
                                />

                                <Field
                                    label="Dirección"
                                    placeholder="Calle, número, distrito, ciudad"
                                    value={data.address}
                                    onChange={(v) => setData('address', v)}
                                    onBlur={() => handleBlur('address')}
                                    error={getError('address')}
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
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
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
                                                        name="asset_type"
                                                        value={tipo}
                                                        checked={
                                                            data.asset_type ===
                                                            tipo
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'asset_type',
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            handleBlur(
                                                                'asset_type',
                                                            )
                                                        }
                                                        className="accent-gray-900"
                                                    />
                                                    {tipo}
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    {getError('asset_type') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {getError('asset_type')}
                                        </p>
                                    )}
                                </div>

                                <Field
                                    label="Descripción del bien o servicio"
                                    placeholder="Describe brevemente el producto o servicio adquirido"
                                    required
                                    value={data.asset_description}
                                    onChange={(v) =>
                                        setData('asset_description', v)
                                    }
                                    onBlur={() =>
                                        handleBlur('asset_description')
                                    }
                                    error={getError('asset_description')}
                                />

                                <Field
                                    label="Monto reclamado (S/)"
                                    placeholder="0.00"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={data.claimed_amount}
                                    onChange={(v) =>
                                        setData('claimed_amount', v)
                                    }
                                    onBlur={() => handleBlur('claimed_amount')}
                                    error={getError('claimed_amount')}
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
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <div className="flex gap-4">
                                        {['Reclamo', 'Queja'].map((t) => (
                                            <label
                                                key={t}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <input
                                                    type="radio"
                                                    name="complaint_type"
                                                    value={t}
                                                    checked={
                                                        data.complaint_type ===
                                                        t
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'complaint_type',
                                                            e.target.value,
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        handleBlur(
                                                            'complaint_type',
                                                        )
                                                    }
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
                                    {getError('complaint_type') && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {getError('complaint_type')}
                                        </p>
                                    )}
                                </div>

                                <TextAreaField
                                    label="Descripción del problema"
                                    placeholder="Describe con detalle lo ocurrido, incluyendo fechas y circunstancias relevantes..."
                                    required
                                    rows={5}
                                    value={data.problem_description}
                                    onChange={(v) =>
                                        setData('problem_description', v)
                                    }
                                    onBlur={() =>
                                        handleBlur('problem_description')
                                    }
                                    error={getError('problem_description')}
                                />

                                <TextAreaField
                                    label="Pedido del consumidor"
                                    placeholder="¿Qué solución esperas? (reembolso, cambio, reparación, etc.)"
                                    required
                                    rows={3}
                                    value={data.consumer_request}
                                    onChange={(v) =>
                                        setData('consumer_request', v)
                                    }
                                    onBlur={() =>
                                        handleBlur('consumer_request')
                                    }
                                    error={getError('consumer_request')}
                                />
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="submit"
                                disabled={processing || !isFormValid}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-16"
                            >
                                {processing && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Enviar reclamación
                            </button>
                            <p className="text-center text-xs text-gray-400">
                                {isFormValid
                                    ? 'Al enviar, te llegará un correo de confirmación con el código de tu reclamación.'
                                    : 'Completa correctamente todos los campos obligatorios (*) para poder enviar tu reclamación.'}
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
                                    <span>+51 953 260 120</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>contacto@makitoolsperu.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>Av. La Esperanza 543 Ate -Lima</span>
                                </div>
                            </div>
                        </div>
                    </form>
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
    inputMode,
    maxLength,
    min,
    step,
    value,
    onChange,
    onBlur,
    error,
}: {
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    maxLength?: number;
    min?: number;
    step?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
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
                inputMode={inputMode}
                maxLength={maxLength}
                min={min}
                step={step}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm transition outline-none focus:ring-2 ${
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
                }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function TextAreaField({
    label,
    placeholder,
    required = false,
    rows = 4,
    value,
    onChange,
    onBlur,
    error,
}: {
    label: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition outline-none focus:ring-2 ${
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
                }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
