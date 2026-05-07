import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useState } from 'react';

import { PublicProduct } from './types';

type Props = {
    product: PublicProduct;
};

export default function ProductCard({ product }: Props) {
    const [liked, setLiked] = useState(false);

    return (
        <div className="group relative flex flex-col gap-2">
            <Link href={`/productos/${product.slug}`} className="block">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Sin imagen
                        </div>
                    )}

                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-3 left-3 rounded-full bg-orange-500 px-2 py-1 text-xs text-white">
                            ¡Últimas {product.stock}!
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium">
                                Agotado
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setLiked(!liked);
                        }}
                        className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition hover:scale-110"
                    >
                        <Heart
                            size={16}
                            className={
                                liked
                                    ? 'fill-black text-black'
                                    : 'text-gray-600'
                            }
                        />
                    </button>
                </div>

                <div className="mt-3 space-y-1">
                    <p className="text-xs tracking-wider text-gray-400 uppercase">
                        {product.category}
                    </p>

                    <p className="line-clamp-2 text-sm font-medium text-gray-900">
                        {product.name}
                    </p>

                    <span className="text-base font-semibold text-gray-900">
                        ${product.price}
                    </span>

                    {product.colors && product.colors.length > 0 && (
                        <div className="mt-2 flex gap-1.5">
                            {product.colors.slice(0, 3).map((color, index) => (
                                <span
                                    key={index}
                                    className="h-3 w-3 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
