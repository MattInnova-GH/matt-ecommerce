import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { LoginForm } from '../Auth/LoginForm';
import { RegisterForm } from '../Auth/RegisterForm';
import { useAuthModalStore } from '@/stores/authModalStore';

export function AuthModal() {
    const { isOpen, tab, onSuccess, close, setTab } = useAuthModalStore();

    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    const handleLoginSuccess = () => {
        const callback = onSuccess;
        close();
        callback?.();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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

                <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setTab('login')}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                            tab === 'login'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('register')}
                        className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                            tab === 'register'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Crear cuenta
                    </button>
                </div>

                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    {tab === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </h2>

                {tab === 'login' ? (
                    <LoginForm onSuccess={handleLoginSuccess} />
                ) : (
                    <RegisterForm onSuccess={close} />
                )}
            </div>
        </div>,
        document.body,
    );
}
