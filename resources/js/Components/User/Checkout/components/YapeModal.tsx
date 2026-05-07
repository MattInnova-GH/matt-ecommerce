import { useState } from 'react';
import { X, Smartphone, Check, ArrowRight } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';

type YapeStep = 'phone' | 'saved';

export function YapeModal() {
    const { closeYapeModal, setYapePhone } = useCheckoutStore();

    const [step, setStep] = useState<YapeStep>('phone');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneSubmit = async () => {
        if (phone.replace(/\s/g, '').length < 9) {
            setPhoneError('Ingresa un número válido de 9 dígitos');
            return;
        }
        setPhoneError('');
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setIsLoading(false);

        // Solo guarda el teléfono, NO procesa el pago
        setYapePhone(phone);
        setStep('saved');
        setTimeout(() => closeYapeModal(), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeYapeModal}
            />

            <div className="relative w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C1AE0]">
                            <Smartphone size={16} className="text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            {step === 'phone'
                                ? 'Vincular Yape / Plin'
                                : '¡Número vinculado!'}
                        </h3>
                    </div>
                    <button
                        onClick={closeYapeModal}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Step: Teléfono */}
                {step === 'phone' && (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-gray-500">
                            Ingresa el número asociado a tu Yape o Plin. El
                            cobro se realizará al confirmar el pedido.
                        </p>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Número de celular
                            </label>
                            <div className="flex gap-2">
                                <div className="flex flex-shrink-0 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                                    🇵🇪 +51
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 9),
                                        )
                                    }
                                    placeholder="987 654 321"
                                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:outline-none ${phoneError ? 'border-red-400' : 'border-gray-200'}`}
                                />
                            </div>
                            {phoneError && (
                                <p className="mt-1 text-xs text-red-500">
                                    {phoneError}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handlePhoneSubmit}
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition-all hover:bg-[#5a14c0] disabled:opacity-60"
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    Vincular número <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Step: Guardado */}
                {step === 'saved' && (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                            <Check size={32} className="text-[#6C1AE0]" />
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            Número vinculado
                        </p>
                        <p className="text-sm text-gray-500">
                            +51 {phone} · El cobro se realizará al confirmar tu
                            pedido desde el resumen
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
