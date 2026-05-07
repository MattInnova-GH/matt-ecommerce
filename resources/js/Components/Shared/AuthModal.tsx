import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { LoginForm } from '../Auth/LoginForm';

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register';
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md animate-in rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl duration-200 fade-in zoom-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Bienvenido de nuevo
                </h2>
                <LoginForm onSuccess={onClose} />
            </div>
        </div>,
        document.body
    );
}
