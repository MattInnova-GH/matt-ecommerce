import { X, LogOut, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
};

const iconConfig = {
    danger: { icon: LogOut, color: 'text-red-500', bg: 'bg-red-100' },
    warning: {
        icon: AlertTriangle,
        color: 'text-amber-500',
        bg: 'bg-amber-100',
    },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
    success: {
        icon: CheckCircle,
        color: 'text-emerald-500',
        bg: 'bg-emerald-100',
    },
};

const confirmButtonClass = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
};

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar acción',
    message = '¿Estás seguro de que quieres realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    icon = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    if (!isOpen || typeof document === 'undefined') {
        return null;
    }

    const { icon: IconComponent, color, bg } = iconConfig[icon];

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => !isLoading && onClose()}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar */}
                <button
                    onClick={() => !isLoading && onClose()}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 transition hover:text-gray-600 disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                {/* Contenido */}
                <div className="p-8 text-center">
                    {/* Ícono */}
                    <div
                        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${bg}`}
                    >
                        <IconComponent className={`h-8 w-8 ${color}`} />
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <p className="mb-6 text-gray-500">{message}</p>

                    {/* Botones */}
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border border-gray-300 px-6 py-2 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex items-center gap-2 rounded-lg px-6 py-2 transition disabled:opacity-50 ${confirmButtonClass[icon]}`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Procesando...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
