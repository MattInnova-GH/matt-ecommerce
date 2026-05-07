import UserLayout from '@/layouts/UserLayout';
import React, { useState, useRef } from 'react';
import { Form, usePage } from '@inertiajs/react';
import {
    User,
    Camera,
    Store,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import SellerRequestTab from './SellerRequestTab';
import configuration from '@/routes/configuration';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';
type ActiveTab = 'profile' | 'seller';

// ─── Constantes ──────────────────────────────────────────────────────────────

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
];

const INPUT_CLASS =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all duration-200 hover:border-gray-300 text-sm';

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ConfiguracionPage() {
    const { props } = usePage();
    const { initialConfig, existingRequestStatus, flash } = props as any;

    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [profileImage, setProfileImage] = useState<string>(
        initialConfig.image ?? '/avatar-default.jpg',
    );
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Estado local para el tipo de documento (para el placeholder dinámico)
    const [selectedDocType, setSelectedDocType] = useState<DocumentType>(
        initialConfig.documentType ?? 'DNI',
    );

    // Mostrar feedback del flash
    React.useEffect(() => {
        if (flash?.success) {
            setFeedback({ type: 'success', message: flash.success });
            setTimeout(() => setFeedback(null), 4000);
        }
        if (flash?.error) {
            setFeedback({ type: 'error', message: flash.error });
            setTimeout(() => setFeedback(null), 4000);
        }
    }, [flash]);

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setFeedback({
                type: 'error',
                message: 'La imagen no debe superar los 2 MB',
            });
            setTimeout(() => setFeedback(null), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setProfileImage(base64);
            setUploadingAvatar(true);

            try {
                // ✅ CAMBIADO: URL directa en lugar de route()
                const response = await fetch('/configuracion/avatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ image: base64 }),
                });

                const result = await response.json();

                if (result.success) {
                    setProfileImage(result.imagePath);
                    setFeedback({
                        type: 'success',
                        message: '¡Foto de perfil actualizada!',
                    });
                } else {
                    setFeedback({
                        type: 'error',
                        message: result.error || 'Error al guardar la imagen',
                    });
                    setProfileImage(
                        initialConfig.image ?? '/avatar-default.jpg',
                    );
                }
            } catch {
                setFeedback({
                    type: 'error',
                    message: 'Error al guardar la imagen',
                });
                setProfileImage(initialConfig.image ?? '/avatar-default.jpg');
            } finally {
                setUploadingAvatar(false);
                setTimeout(() => setFeedback(null), 4000);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <UserLayout>
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
                <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                            Configuración
                        </h1>
                        <p className="text-sm text-gray-500 sm:text-base">
                            Gestiona tu información personal y configuración de
                            cuenta
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="flex w-fit gap-2 rounded-2xl bg-gray-100 p-1">
                            <TabButton
                                active={activeTab === 'profile'}
                                onClick={() => setActiveTab('profile')}
                                icon={<User size={17} />}
                                label="Información Personal"
                            />
                            {initialConfig.role !== 'ADMIN' && (
                                <TabButton
                                    active={activeTab === 'seller'}
                                    onClick={() => setActiveTab('seller')}
                                    icon={<Store size={17} />}
                                    label="Solicitar ser Vendedor"
                                />
                            )}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm shadow-gray-200">
                        {activeTab === 'profile' ? (
                            <Form
                                action={configuration.updateProfile()}
                                method="put"
                                className="p-6 sm:p-8 lg:p-10"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        {/* Feedback */}
                                        {feedback && (
                                            <div
                                                className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
                                                    feedback.type === 'success'
                                                        ? 'border-green-200 bg-green-50'
                                                        : 'border-red-200 bg-red-50'
                                                }`}
                                            >
                                                {feedback.type === 'success' ? (
                                                    <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                                                )}
                                                <p
                                                    className={`text-sm font-medium ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}
                                                >
                                                    {feedback.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <div className="mb-8 border-b border-gray-100 pb-8">
                                            <label className="mb-4 block text-sm font-semibold text-gray-700">
                                                Foto de perfil
                                            </label>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="group relative">
                                                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 shadow-md ring-4 ring-white">
                                                        {uploadingAvatar ? (
                                                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                                                <Loader2
                                                                    size={32}
                                                                    className="animate-spin text-gray-500"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={
                                                                    profileImage
                                                                }
                                                                alt="Foto de perfil"
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        className="absolute -right-2 -bottom-2 rounded-xl bg-black p-2 shadow-md transition-all hover:scale-105 hover:bg-gray-800"
                                                        disabled={
                                                            uploadingAvatar
                                                        }
                                                    >
                                                        <Camera
                                                            size={14}
                                                            className="text-white"
                                                        />
                                                    </button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleAvatarChange
                                                        }
                                                        className="hidden"
                                                        disabled={
                                                            uploadingAvatar
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Sube una foto para
                                                        personalizar tu cuenta
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        JPG, PNG, GIF o WebP.
                                                        Máximo 2 MB.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campos del perfil */}
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <FormField
                                                label="Nombre"
                                                icon={<User size={15} />}
                                                required
                                                error={errors.name}
                                            >
                                                <input
                                                    type="text"
                                                    required
                                                    name="name"
                                                    defaultValue={
                                                        initialConfig.name ?? ''
                                                    }
                                                    className={INPUT_CLASS}
                                                    placeholder="Tu nombre"
                                                />
                                            </FormField>

                                            <FormField
                                                label="Apellidos"
                                                icon={<User size={15} />}
                                                required
                                                error={errors.last_name}
                                            >
                                                <input
                                                    type="text"
                                                    required
                                                    name="last_name"
                                                    defaultValue={
                                                        initialConfig.last_name ??
                                                        ''
                                                    }
                                                    className={INPUT_CLASS}
                                                    placeholder="Tus apellidos"
                                                />
                                            </FormField>

                                            <FormField
                                                label="Correo electrónico"
                                                icon={<Mail size={15} />}
                                                hint="El correo no se puede modificar"
                                            >
                                                <input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={
                                                        initialConfig.email ??
                                                        ''
                                                    }
                                                    className={`${INPUT_CLASS} cursor-not-allowed opacity-60`}
                                                    disabled
                                                    readOnly
                                                />
                                            </FormField>

                                            <FormField
                                                label="Teléfono / Celular"
                                                icon={<Phone size={15} />}
                                                error={errors.phone}
                                            >
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    defaultValue={
                                                        initialConfig.phone ??
                                                        ''
                                                    }
                                                    className={INPUT_CLASS}
                                                    placeholder="+51 987 654 321"
                                                />
                                            </FormField>

                                            <FormField
                                                label="Tipo de documento"
                                                error={errors.documentType}
                                            >
                                                <select
                                                    name="documentType"
                                                    defaultValue={
                                                        initialConfig.documentType ??
                                                        'DNI'
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedDocType(
                                                            e.target
                                                                .value as DocumentType,
                                                        )
                                                    }
                                                    className={INPUT_CLASS}
                                                >
                                                    {DOCUMENT_TYPES.map(
                                                        (dt) => (
                                                            <option
                                                                key={dt.value}
                                                                value={dt.value}
                                                            >
                                                                {dt.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </FormField>

                                            <FormField
                                                label="Número de documento"
                                                error={errors.documentNumber}
                                            >
                                                <input
                                                    type="text"
                                                    name="documentNumber"
                                                    defaultValue={
                                                        initialConfig.documentNumber ??
                                                        ''
                                                    }
                                                    className={INPUT_CLASS}
                                                    placeholder={
                                                        selectedDocType ===
                                                        'RUC'
                                                            ? '20XXXXXXXXX'
                                                            : selectedDocType ===
                                                                'DNI'
                                                              ? '12345678'
                                                              : 'Número de documento'
                                                    }
                                                    maxLength={
                                                        selectedDocType ===
                                                        'RUC'
                                                            ? 11
                                                            : selectedDocType ===
                                                                'DNI'
                                                              ? 8
                                                              : 20
                                                    }
                                                />
                                            </FormField>
                                        </div>

                                        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
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
                                                        />{' '}
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        Guardar cambios{' '}
                                                        <ArrowRight size={16} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        ) : (
                            <SellerRequestTab
                                prefill={{
                                    phone: initialConfig.phone,
                                    documentType: initialConfig.documentType,
                                    documentNumber:
                                        initialConfig.documentNumber,
                                    role: initialConfig.role,
                                }}
                                existingRequestStatus={existingRequestStatus}
                            />
                        )}
                    </div>
                </main>
            </div>
        </UserLayout>
    );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function TabButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${active ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'}`}
        >
            {icon}
            {label}
        </button>
    );
}

function FormField({
    label,
    hint,
    required,
    icon,
    error,
    children,
}: {
    label: string;
    hint?: string;
    required?: boolean;
    icon?: React.ReactNode;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="group">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black">
                        {icon}
                    </div>
                )}
                <div className={icon ? '[&>input]:pl-10 [&>select]:pl-10' : ''}>
                    {children}
                </div>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            {hint && !error && (
                <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
            )}
        </div>
    );
}
