import { useCartStore } from '@/stores/cartStore';
import { X, ShoppingBag } from 'lucide-react';

export function CartHeader() {
    const { closeCart, totalItems } = useCartStore();

    const itemCount = totalItems();

    return (
        <div className="relative border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-800/30 dark:to-gray-800/30" />

            <div className="relative flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/5 dark:bg-white/10">
                            <ShoppingBag
                                className="h-5 w-5 text-gray-700 dark:text-gray-300"
                                strokeWidth={1.5}
                            />
                        </div>

                        {itemCount > 0 && (
                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-white dark:text-gray-900">
                                {itemCount > 9 ? '9+' : itemCount}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                            Mi Carrito
                        </h2>

                        <div className="mt-0.5 flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {itemCount === 0
                                        ? 'Tu carrito está vacío'
                                        : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
                                </p>
                            </div>

                            {itemCount > 0 && (
                                <>
                                    <span className="h-3 w-px bg-gray-200 dark:bg-gray-700" />

                                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                                        Listo para comprar
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={closeCart}
                    aria-label="Cerrar carrito"
                    className="group relative rounded-lg p-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute inset-0 rounded-lg bg-gray-900/5 dark:bg-white/5" />
                    </div>

                    <X
                        className="relative h-5 w-5 text-gray-500 transition-colors group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        strokeWidth={1.5}
                    />
                </button>
            </div>

            <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
        </div>
    );
}
