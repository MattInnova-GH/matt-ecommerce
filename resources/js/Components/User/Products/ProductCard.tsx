import { Link, router } from '@inertiajs/react';
import { Heart, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { PublicProduct } from './types';

type Props = {
    product: PublicProduct;
};

function OptimizedImage({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoading(false);
        img.onerror = () => {
            setIsLoading(false);
            setError(true);
        };
    }, [src]);

    return (
        <div
            className={cn(
                'relative h-full w-full overflow-hidden bg-muted/50',
                className,
            )}
        >
            {isLoading && (
                <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
            )}
            {!error ? (
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        'h-full w-full object-contain p-4 transition-all duration-700',
                        isLoading
                            ? 'scale-110 opacity-0 blur-sm'
                            : 'blur-0 scale-100 opacity-100',
                    )}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <Package className="size-8 opacity-20" />
                </div>
            )}
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <div className="space-y-2 px-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-24" />
            </div>
        </div>
    );
}

export default function ProductCard({ product }: Props) {
    const [liked, setLiked] = useState(product.is_favorited ?? false);

    // ✅ Determinar qué precio mostrar
    const displayPrice = product.has_discount
        ? product.final_price
        : product.price;

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        router.post(
            `/favoritos/toggle/${product.id}`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="group relative flex flex-col gap-2">
            <Link href={`/productos/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    {product.imageUrl ? (
                        <OptimizedImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                            <Package className="mr-2 size-4" />
                            Sin imagen
                        </div>
                    )}

                    {/* Badge de descuento */}
                    {product.has_discount && product.discount_badge && (
                        <div className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                            {product.discount_badge} OFF
                        </div>
                    )}

                    {/* Stock bajo - ajustado para no solaparse con el badge */}
                    {product.stock < 5 &&
                        product.stock > 0 &&
                        !product.has_discount && (
                            <div className="absolute top-3 left-3 z-10 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                                ¡Últimas {product.stock}!
                            </div>
                        )}

                    {product.stock === 0 && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold tracking-widest text-black uppercase shadow-xl">
                                Agotado
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={toggleFavorite}
                        className="absolute top-3 right-3 z-30 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-all hover:scale-110 active:scale-95"
                    >
                        <Heart
                            size={16}
                            className={cn(
                                'transition-colors duration-300',
                                liked
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-600 hover:text-red-400',
                            )}
                        />
                    </button>
                </div>

                <div className="mt-3 space-y-1.5 px-1">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {product.category}
                    </p>

                    <p className="line-clamp-2 text-sm leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
                        {product.name}
                    </p>

                    {/* ✅ PRECIO CORREGIDO - Ahora muestra el descuento */}
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-foreground">
                            S/ {displayPrice.toFixed(2)}
                        </span>
                        {product.has_discount && (
                            <span className="text-xs text-muted-foreground line-through">
                                S/ {product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {product.colors && product.colors.length > 0 && (
                        <div className="flex -space-x-1">
                            {product.colors.slice(0, 3).map((color, index) => (
                                <span
                                    key={index}
                                    className="h-3 w-3 rounded-full border-2 border-background shadow-sm"
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
