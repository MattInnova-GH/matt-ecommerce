import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const [liked, setLiked] = useState(false);

    return (
        <div className="group relative flex flex-col gap-2">
            <Link href={`/productos/${product.slug}`} className="block">
                <div className="relative overflow-hidden aspect-[3/4] w-full rounded-xl bg-gray-100 dark:bg-zinc-800">
                    <img
                        src={product.imageUrl || '/img/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            ¡Últimas {product.stock}!
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Agotado
                            </span>
                        </div>
                    )}

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setLiked(!liked);
                        }}
                        className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full p-2 transition-all hover:scale-110 shadow-sm"
                    >
                        <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'} />
                    </button>
                    
                    <button className="absolute bottom-3 right-3 z-10 bg-black text-white dark:bg-white dark:text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ShoppingBag size={18} />
                    </button>
                </div>

                <div className="mt-3 space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{product.category}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white hover:text-emerald-600 transition-colors line-clamp-2">
                        {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900 dark:text-emerald-400">${product.price}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
