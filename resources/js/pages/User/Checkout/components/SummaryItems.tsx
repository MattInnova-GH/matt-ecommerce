import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '../utils/checkout.utils';

export function SummaryItems() {
    const { items } = useCartStore();

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gray-200" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-gray-900">
                            {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            x{item.quantity}
                        </p>
                    </div>
                    <p className="flex-shrink-0 text-xs font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                    </p>
                </div>
            ))}
        </div>
    );
}
