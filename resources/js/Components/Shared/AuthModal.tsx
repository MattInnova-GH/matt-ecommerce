import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { LoginForm } from '../Auth/LoginForm';
import { useAuthModalStore } from '@/stores/authModalStore';

export function AuthModal() {
    const { isOpen, onSuccess, close } = useAuthModalStore();

    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    const handleSuccess = () => {
        const callback = onSuccess;
        close();
        callback?.();
    };

    return createPortal(
        <div className="fixed inset-0 z-1030 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={close}
            />
            <div className="relative w-full max-w-md animate-in rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl duration-200 fade-in zoom-in">
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Bienvenido de nuevo
                </h2>
                <LoginForm onSuccess={handleSuccess} />
            </div>
        </div>,
        document.body,
    );
}
