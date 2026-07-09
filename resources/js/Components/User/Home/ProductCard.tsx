import { ShoppingBag } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-lg">
            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden bg-white">
                <img
                    src={product.imageUrl || '/img/placeholder.png'}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute right-2 bottom-2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-black hover:text-white">
                    <ShoppingBag size={16} />
                </button>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        S/ {product.price}
                    </span>
                </div>
            </div>
        </div>
    );
}
