import { useCartStore } from '@/stores/cartStore';
import type { CartItemType } from '@/types/cart';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQty, removeItem } = useCartStore();

    return (
        <li className="flex items-start gap-4">
            <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 object-cover"
            />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">{item.category}</p>

                <p className="mt-1 text-sm font-semibold">S/ {item.price}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center rounded-md border border-gray-200">
                    <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="rounded-l-md px-2 py-1 transition-colors hover:bg-gray-50"
                    >
                        −
                    </button>

                    <span className="min-w-[32px] border-x px-3 py-1 text-center text-sm">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="rounded-r-md px-2 py-1 text-gray-500 transition-colors hover:bg-gray-50"
                    >
                        +
                    </button>
                </div>

                <div className="flex w-full justify-center">
                    <button
                        onClick={() => removeItem(item.id)}
                        className="w-full text-center text-xs text-red-400 transition-colors hover:text-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </li>
    );
}
