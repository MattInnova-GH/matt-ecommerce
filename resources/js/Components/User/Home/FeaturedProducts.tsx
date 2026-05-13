import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ProductCard, { ProductCardSkeleton } from '@/Components/User/Products/ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
    slug: string;
    category?: string;
}

interface Props {
    products: Product[];
}

export function FeaturedProductsSkeleton() {
    return (
        <section className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-end justify-between">
                    <div className="space-y-3">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
                    {[...Array(4)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function FeaturedProducts({ products = [] }: Props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <FeaturedProductsSkeleton />;
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-background py-16 sm:py-24 animate-in fade-in duration-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">
                            Nuestra selección
                        </span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Productos Destacados
                        </h2>
                    </div>
                    <Button variant="ghost" asChild className="group">
                        <Link href="/productos" className="flex items-center gap-2">
                            Ver todo el catálogo
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                imageUrl: product.imageUrl || null,
                                stock: 10, // Default para destacados
                                category: product.category || 'Destacado',
                                is_favorited: false,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
