'use client';

import { useState } from 'react';
import {
    Store,
    Phone,
    Building2,
    MapPin,
    Briefcase,
    CheckCircle,
    XCircle,
    Loader2,
    TrendingUp,
    Shield,
    Truck,
    FileText,
    Globe,
    Clock,
    BadgeCheck,
} from 'lucide-react';

import {
    createSellerRequest,
    type SellerRequestInput,
} from '@/actions/User/seller.request.action';

import type { DocumentType } from '@/lib/types/type.models';

// Tipos

type FeedbackState = {
    type: 'success' | 'error';
    message: string;
} | null;

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

// Constantes

const DOCUMENT_TYPES: {
    value: DocumentType;
    label: string;
    icon: React.ElementType;
}[] = [
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

//  Componente principal

export default function SellerRequestTab({
    prefill,
    existingRequestStatus,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);

    const [submitted, setSubmitted] = useState(
        existingRequestStatus === 'PENDING' ||
            existingRequestStatus === 'APPROVED',
    );

    const [form, setForm] = useState<SellerRequestInput>({
        businessName: '',
        businessType: '',
        address: '',
        phone: prefill.phone ?? '',
        taxIdType: prefill.documentType ?? 'DNI',
        taxIdNumber: prefill.documentNumber ?? '',
        experience: '',
        message: '',
    });

    function showFeedback(fb: FeedbackState, ms = 5000) {
        setFeedback(fb);
        setTimeout(() => setFeedback(null), ms);
    }

    function setField<K extends keyof SellerRequestInput>(
        key: K,
        value: SellerRequestInput[K],
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const completionPercentage = Math.round(
        (Object.values(form).filter((v) => String(v).trim() !== '').length /
            Object.keys(form).length) *
            100,
    );

    // ❌ SOLO lógica aquí, NO JSX
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsLoading(true);
        setFeedback(null);

        const result = await createSellerRequest(form);

        setIsLoading(false);

        if (result.success) {
            setSubmitted(true);
        } else {
            showFeedback({
                type: 'error',
                message: result.error ?? 'Error inesperado',
            });
        }
    }

    // ============================
    // ESTADOS (CORRECTO AQUÍ)
    // ============================

    if (prefill.role === 'SELLER') {
        return (
            <div className="p-6 text-center">
                <BadgeCheck className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-2 text-xl font-semibold">Ya eres vendedor</h3>
            </div>
        );
    }

    if (submitted || existingRequestStatus === 'PENDING') {
        return (
            <div className="p-6 text-center">
                <Clock className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="mt-2 text-xl font-semibold">
                    Solicitud en revisión
                </h3>
            </div>
        );
    }

    const wasRejected = existingRequestStatus === 'REJECTED';

    // ============================
    // UI PRINCIPAL
    // ============================

    return (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            {/* RECHAZO */}
            {wasRejected && (
                <div className="mb-6 rounded-xl bg-amber-50 p-4">
                    <XCircle className="text-amber-600" />
                    Solicitud rechazada
                </div>
            )}

            {/* FEEDBACK */}
            {feedback && (
                <div className="mb-6 rounded-xl p-4">{feedback.message}</div>
            )}

            {/* PROGRESS */}
            <div className="mb-6">
                <div>{completionPercentage}%</div>
            </div>

            {/* FORM */}
            <input
                value={form.businessName}
                onChange={(e) => setField('businessName', e.target.value)}
            />

            {/* SUBMIT */}
            <button disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
        </form>
    );
}
