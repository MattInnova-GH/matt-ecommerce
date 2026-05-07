import { useCartStore } from '@/stores/cartStore';
import { ProductItem } from './ProductItem';
import { ShoppingBag } from 'lucide-react';

export function ProductList() {
    const { items } = useCartStore();

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="mb-1 flex items-center gap-2">
                <ShoppingBag size={16} className="text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">
                    Productos
                </h2>
            </div>
            <p className="mb-5 text-xs text-gray-400">
                {items.length} {items.length === 1 ? 'artículo' : 'artículos'}{' '}
                en tu pedido
            </p>

            <div className="divide-y divide-gray-100">
                {items.map((item) => (
                    <ProductItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
