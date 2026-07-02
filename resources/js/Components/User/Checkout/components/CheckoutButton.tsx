import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { router } from '@inertiajs/react';
import { calcOrderTotals, formatPrice } from '../utils/checkout.utils';

export function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState(false);

    const { items, clearCart } = useCartStore();
    const {
        deliveryMethod,
        paymentMethod,
        deliveryAddress,
        selectedStore,
        transferConfirmed,
        yapePhone,
        yapeCode,
        yapeMode,
        voucherFile,
    } = useCheckoutStore();

    const { total } = calcOrderTotals(items, deliveryMethod);
    const isEmpty = items.length === 0;

    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const getPaymentWarning = (): string | null => {
        if (paymentMethod === 'transfer') {
            if (!transferConfirmed)
                return 'Completa los datos de transferencia haciendo clic en "Transferencia"';
            if (!voucherFile)
                return 'Debes subir el comprobante de la transferencia';
        }
        if (paymentMethod === 'yape') {
            if (!yapePhone)
                return 'Vincula tu número Yape haciendo clic en "Yape"';
            if (yapeMode === 'code' && !yapeCode)
                return 'Ingresa el código de aprobación Yape';
            if (!voucherFile) return 'Debes subir el comprobante de pago Yape';
        }
        return null;
    };

    const paymentWarning = getPaymentWarning();

    const handleConfirmOrder = async () => {
        if (!email.trim()) {
            setEmailError('Ingresa tu correo electrónico');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Ingresa un correo válido');
            return;
        }
        if (!termsAccepted) {
            setTermsError(true);
            return;
        }
        if (paymentWarning) return;

        setEmailError('');
        setIsLoading(true);

        router.post(
            '/checkout',
            {
                email,
                items,
                deliveryMethod,
                paymentMethod,
                deliveryAddress:
                    deliveryMethod === 'delivery' ? deliveryAddress : null,
                selectedStore:
                    deliveryMethod === 'pickup' ? selectedStore : null,
                yapePhone,
                yapeCode,
                yapeMode,
                voucher: voucherFile,
                total,
            } as any,
            {
                onSuccess: () => {
                    clearCart();
                },
                onError: (errors) => {
                    console.error('Error al confirmar orden:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <div className="space-y-3">
            {/* Email */}
            <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                    <Mail size={12} />
                    Correo para confirmación de compra
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                    }}
                    placeholder="tucorreo@ejemplo.com"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none ${emailError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {emailError && (
                    <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
                {!emailError && email && validateEmail(email) && (
                    <p className="mt-1 text-xs text-green-600">
                        ✓ Te enviaremos la confirmación a este correo
                    </p>
                )}
            </div>

            {/* Advertencia método de pago incompleto */}
            {paymentWarning && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <p className="text-xs text-amber-700">{paymentWarning}</p>
                </div>
            )}

            {/* Términos y Política — un solo check */}
            <div className="space-y-1">
                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                            setTermsAccepted(e.target.checked);
                            if (e.target.checked) setTermsError(false);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-gray-900"
                    />
                    <span className="text-xs leading-relaxed text-gray-600">
                        He leído y acepto los{' '}
                        <Link
                            href="/terminos-y-condiciones"
                            target="_blank"
                            className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
                        >
                            Términos y Condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link
                            href="/politica-de-privacidad"
                            target="_blank"
                            className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
                        >
                            Política de Privacidad
                        </Link>
                    </span>
                </label>
                {termsError && (
                    <p className="pl-7 text-xs text-red-500">
                        Debes aceptar los Términos y la Política de Privacidad
                        para continuar
                    </p>
                )}
            </div>

            {/* Botón */}
            <button
                onClick={handleConfirmOrder}
                disabled={isEmpty || isLoading || !!paymentWarning}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isLoading ? (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Procesando...
                    </>
                ) : (
                    <>
                        <Lock size={15} />
                        Confirmar pedido · {formatPrice(total)}
                    </>
                )}
            </button>
        </div>
    );
}
