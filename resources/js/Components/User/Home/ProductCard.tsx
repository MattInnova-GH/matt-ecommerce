import { ShoppingBag } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-zinc-800">
            {/* Imagen */}
            <div className="relative aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden">
                <img
                    src={product.imageUrl || '/img/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-2 right-2 bg-white dark:bg-zinc-950 rounded-full p-2 shadow-md hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                    <ShoppingBag size={16} />
                </button>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">{product.name}</h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-emerald-400">${product.price}</span>
                </div>
            </div>
        </div>
    );
}
