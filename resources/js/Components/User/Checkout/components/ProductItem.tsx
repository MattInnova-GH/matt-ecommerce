import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '../utils/checkout.utils';
import type { CheckoutItem } from '../types/checkout.types';

interface ProductItemProps {
    item: CheckoutItem;
}

export function ProductItem({ item }: ProductItemProps) {
    const { updateQty, removeItem } = useCartStore();
    const subtotal = item.price * item.quantity;

    return (
        <div className="flex gap-4 py-5">
            {/* Imagen */}
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                        </p>
                        {item.category && (
                            <p className="mt-0.5 text-xs tracking-wide text-gray-400 uppercase">
                                {item.category}
                            </p>
                        )}
                        {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                                {item.description}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                            {formatPrice(item.price)} por unidad
                        </p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-semibold text-gray-900">
                        {formatPrice(subtotal)}
                    </p>
                </div>

                {/* Controles cantidad */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-gray-200">
                        <button
                            onClick={() =>
                                updateQty(item.id, item.quantity - 1)
                            }
                            className="rounded-l-full p-1.5 transition-colors hover:bg-gray-50"
                            aria-label="Reducir cantidad"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="min-w-[32px] px-3 text-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                updateQty(item.id, item.quantity + 1)
                            }
                            className="rounded-r-full p-1.5 transition-colors hover:bg-gray-50"
                            aria-label="Aumentar cantidad"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-400 transition-colors hover:text-red-500"
                        aria-label={`Eliminar ${item.name}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
