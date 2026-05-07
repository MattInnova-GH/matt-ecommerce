import { useState } from 'react';
import { X, CreditCard, Lock, Check } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';

export function CardModal() {
    const { closeCardModal, setCardData } = useCheckoutStore();

    const [form, setForm] = useState({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaved, setIsSaved] = useState(false); // guardado, no "procesando pago"

    const formatCardNumber = (value: string) =>
        value
            .replace(/\D/g, '')
            .slice(0, 16)
            .replace(/(.{4})/g, '$1 ')
            .trim();

    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3)
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (form.cardNumber.replace(/\s/g, '').length < 16)
            newErrors.cardNumber = 'Número de tarjeta inválido';
        if (!form.cardHolder.trim())
            newErrors.cardHolder = 'Ingresa el nombre del titular';
        if (form.expiry.length < 5) newErrors.expiry = 'Fecha inválida';
        if (form.cvv.length < 3) newErrors.cvv = 'CVV inválido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getCardType = () => {
        const num = form.cardNumber.replace(/\s/g, '');
        if (num.startsWith('4')) return 'VISA';
        if (num.startsWith('5')) return 'MASTERCARD';
        return null;
    };

    // Solo guarda los datos, cierra el modal
    const handleSaveCard = () => {
        if (!validate()) return;
        setCardData({
            cardNumber: form.cardNumber,
            cardHolder: form.cardHolder,
            expiry: form.expiry,
            cvv: form.cvv,
        });
        setIsSaved(true);
        setTimeout(() => closeCardModal(), 1500); // cierra tras mostrar confirmación
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeCardModal}
            />

            <div className="relative w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard size={20} className="text-gray-700" />
                        <h3 className="text-base font-semibold text-gray-900">
                            Datos de tarjeta
                        </h3>
                    </div>
                    <button
                        onClick={closeCardModal}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isSaved ? (
                    // Confirmación de datos guardados (no de pago procesado)
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            ¡Datos guardados!
                        </p>
                        <p className="text-sm text-gray-500">
                            Confirma tu pedido desde el resumen para completar
                            la compra
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Vista previa tarjeta */}
                        <div className="space-y-4 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="h-7 w-10 rounded-md bg-yellow-400 opacity-80" />
                                <span className="text-xs font-medium opacity-70">
                                    {getCardType() || 'TARJETA'}
                                </span>
                            </div>
                            <p className="font-mono text-lg tracking-widest">
                                {form.cardNumber || '•••• •••• •••• ••••'}
                            </p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs opacity-50">
                                        Titular
                                    </p>
                                    <p className="text-sm font-medium uppercase">
                                        {form.cardHolder || 'NOMBRE APELLIDO'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-50">Vence</p>
                                    <p className="text-sm font-medium">
                                        {form.expiry || 'MM/AA'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Número de tarjeta
                                </label>
                                <input
                                    type="text"
                                    value={form.cardNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cardNumber: formatCardNumber(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    placeholder="1234 5678 9012 3456"
                                    className={`w-full rounded-xl border px-4 py-2.5 font-mono text-sm transition-colors focus:border-gray-900 focus:outline-none ${errors.cardNumber ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.cardNumber && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.cardNumber}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">
                                    Nombre del titular
                                </label>
                                <input
                                    type="text"
                                    value={form.cardHolder}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cardHolder:
                                                e.target.value.toUpperCase(),
                                        })
                                    }
                                    placeholder="JUAN PÉREZ"
                                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none ${errors.cardHolder ? 'border-red-400' : 'border-gray-200'}`}
                                />
                                {errors.cardHolder && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.cardHolder}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-700">
                                        Fecha de vencimiento
                                    </label>
                                    <input
                                        type="text"
                                        value={form.expiry}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                expiry: formatExpiry(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        placeholder="MM/AA"
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none ${errors.expiry ? 'border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.expiry && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.expiry}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-700">
                                        CVV
                                    </label>
                                    <input
                                        type="password"
                                        value={form.cvv}
                                        maxLength={4}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                cvv: e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            })
                                        }
                                        placeholder="•••"
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none ${errors.cvv ? 'border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.cvv && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.cvv}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón guarda datos, NO procesa pago */}
                        <button
                            onClick={handleSaveCard}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700"
                        >
                            <Lock size={14} />
                            Guardar datos de tarjeta
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Lock size={12} />
                            Tus datos están cifrados y protegidos
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
