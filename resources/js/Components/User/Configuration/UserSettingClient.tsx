'use client';

import { useRef, useState } from 'react';

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

import type {
    DocumentType,
    ActionResult,
    RequestStatus,
} from '@/lib/types/type.models';

import {
    updateProfile,
    type UpdateProfileInput,
} from '@/actions/User/config.user.action';

import { updateAvatar } from '@/actions/General/update.profile.action';

import SellerRequestTab from './SellerRequestTab.page';

// TIPOS

type UserConfig = {
    name?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?: DocumentType | null;
    documentNumber?: string | null;
    image?: string | null;
    role?: string | null;
};

type ActiveTab = 'profile' | 'seller';

type FeedbackState = {
    type: 'success' | 'error';
    message: string;
} | null;

// CONSTANTES

const DOCUMENT_TYPES: {
    value: DocumentType;
    label: string;
}[] = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
];

const INPUT_CLASS =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all text-sm';

// PROPS

type Props = {
    initialConfig: UserConfig;
    existingRequestStatus?: RequestStatus | null;
};

// COMPONENTE

export default function UserSettingClient({
    initialConfig,
    existingRequestStatus,
}: Props) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState<UpdateProfileInput>({
        name: initialConfig.name ?? '',
        lastName: initialConfig.lastName ?? '',
        phone: initialConfig.phone ?? '',
        documentType: initialConfig.documentType ?? 'DNI',
        documentNumber: initialConfig.documentNumber ?? '',
    });

    const [profileImage, setProfileImage] = useState<string>(
        initialConfig.image ?? '',
    );

    // HELPERS

    function showFeedback(fb: FeedbackState, ms = 4000) {
        setFeedback(fb);
        setTimeout(() => setFeedback(null), ms);
    }

    function handleActionResult(result: ActionResult, msg: string) {
        if (result.success) {
            showFeedback({ type: 'success', message: msg });
        } else {
            showFeedback({
                type: 'error',
                message: result.error ?? 'Error desconocido',
            });
        }
    }

    // AVATAR

    async function handleProfileImageChange(
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return showFeedback({
                type: 'error',
                message: 'Máximo 2MB',
            });
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64 = reader.result as string;

            setProfileImage(base64);

            const result = await updateAvatar(base64);

            if (result.success && result.imagePath) {
                setProfileImage(result.imagePath);
                showFeedback({
                    type: 'success',
                    message: 'Foto actualizada',
                });
            } else {
                showFeedback({
                    type: 'error',
                    message: 'Error al subir imagen',
                });

                setProfileImage(initialConfig.image ?? '');
            }
        };

        reader.readAsDataURL(file);
    }

    // SUBMIT PERFIL

    async function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateProfile(profileData);

        handleActionResult(result, 'Perfil actualizado');

        setIsLoading(false);
    }

    // RENDER

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-5xl px-4 py-10">
                {/* HEADER */}
                <h1 className="mb-2 text-3xl font-bold">Configuración</h1>
                <p className="mb-6 text-gray-500">Gestiona tu cuenta</p>

                {/* TABS */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`rounded-xl px-4 py-2 ${
                            activeTab === 'profile'
                                ? 'bg-black text-white'
                                : 'bg-white'
                        }`}
                    >
                        Perfil
                    </button>

                    {initialConfig.role !== 'admin' && (
                        <button
                            onClick={() => setActiveTab('seller')}
                            className={`rounded-xl px-4 py-2 ${
                                activeTab === 'seller'
                                    ? 'bg-black text-white'
                                    : 'bg-white'
                            }`}
                        >
                            Vendedor
                        </button>
                    )}
                </div>

                {/* CONTENT */}
                <div className="rounded-2xl bg-white p-6">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileSubmit}>
                            {/* IMAGE */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                                    {profileImage && (
                                        <img
                                            src={profileImage}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleProfileImageChange}
                                />
                            </div>

                            {/* NAME */}
                            <input
                                className={INPUT_CLASS}
                                value={profileData.name ?? ''}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nombre"
                            />

                            <button
                                disabled={isLoading}
                                className="mt-4 rounded-xl bg-black px-6 py-2 text-white"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </form>
                    ) : (
                        <SellerRequestTab
                            prefill={{
                                phone: initialConfig.phone ?? '',
                                documentType:
                                    initialConfig.documentType ?? 'DNI',
                                documentNumber:
                                    initialConfig.documentNumber ?? '',
                                role: initialConfig.role ?? '',
                            }}
                            existingRequestStatus={
                                existingRequestStatus ?? null
                            }
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
