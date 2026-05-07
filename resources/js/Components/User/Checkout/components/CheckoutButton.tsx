import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { router } from '@inertiajs/react';
import { calcOrderTotals, formatPrice } from '../utils/checkout.utils';

export function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const { items, clearCart } = useCartStore();
    const {
        deliveryMethod,
        paymentMethod,
        deliveryAddress,
        selectedStore,
        cardData, // datos de tarjeta guardados
        yapePhone, // teléfono yape guardado
    } = useCheckoutStore();

    const { total } = calcOrderTotals(items, deliveryMethod);
    const isEmpty = items.length === 0;

    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Advertencia si faltan datos del método de pago seleccionado
    const getPaymentWarning = (): string | null => {
        if (paymentMethod === 'card' && !cardData)
            return 'Ingresa los datos de tu tarjeta haciendo clic en "Tarjeta"';
        if (paymentMethod === 'yape' && !yapePhone)
            return 'Vincula tu número Yape haciendo clic en "Yape / Plin"';
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
        if (paymentWarning) return;

        setEmailError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    items,
                    deliveryMethod,
                    paymentMethod,
                    deliveryAddress,
                    selectedStore,
                    cardData,
                    yapePhone,
                    total,
                }),
            });

            if (!res.ok) throw new Error('Error al procesar la orden');

            clearCart();
            router.visit('/'); // redirige al inicio
        } catch (error) {
            console.error('Error al confirmar orden:', error);
        } finally {
            setIsLoading(false);
        }
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-gray-900 focus:outline-none ${emailError ? 'border-red-400 bg-red-50' : 'border-gray-200'} `}
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
                        className="mt-0.5 flex-shrink-0 text-amber-600"
                    />
                    <p className="text-xs text-amber-700">{paymentWarning}</p>
                </div>
            )}

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
