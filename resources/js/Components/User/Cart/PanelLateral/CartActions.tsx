import { useCartStore } from '@/stores/cartStore';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function CartActions() {
    const { items, clearCart, closeCart } = useCartStore();
    const { auth } = usePage().props as any;

    const handleCheckout = () => {
        closeCart();

        if (!auth?.user) {
            toast.error('Debes iniciar sesión para continuar con la compra');
            router.get('/login');
            return;
        }

        router.get('/checkout');
    };

    const isEmpty = items.length === 0;

    return (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4">
            <button
                onClick={handleCheckout}
                disabled={isEmpty}
                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Proceder al pago
            </button>

            <button
                onClick={clearCart}
                disabled={isEmpty}
                className="w-full rounded-xl py-2 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Vaciar carrito
            </button>
        </div>
    );
}
