import { router } from '@inertiajs/react';

import { ShoppingBag } from 'lucide-react';

import { useCartStore } from '@/stores/cartStore';

import { ProductList } from './components/ProductList';
import { DeliveryMethod } from './components/DeliveryMethod';
import { PaymentMethod } from './components/PaymentMethod';
import { OrderSummary } from './components/OrderSummary';

export function Checkout() {
    const { items } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-400">
                <ShoppingBag size={48} strokeWidth={1} />

                <p className="text-base">Tu carrito está vacío</p>

                <button
                    onClick={() => router.visit('/productos')}
                    className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                    Ver productos
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-2xl font-semibold text-gray-900">
                Finalizar compra
            </h1>

            <div className="flex flex-col items-start gap-8 lg:flex-row">
                <div className="w-full flex-1 space-y-6">
                    <ProductList />

                    <DeliveryMethod />

                    <PaymentMethod />
                </div>

                <div className="w-full flex-shrink-0 lg:w-[380px]">
                    <div className="sticky top-24">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
