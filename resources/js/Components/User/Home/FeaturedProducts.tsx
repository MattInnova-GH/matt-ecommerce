import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

export default function FeaturedProducts({
    products = [],
}: {
    products?: Product[];
}) {
    return (
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between sm:mb-12">
                    <div>
                        <h2 className="mb-2 text-2xl font-light sm:text-3xl lg:text-4xl">
                            Productos destacados
                        </h2>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Los más vendidos de esta semana
                        </p>
                    </div>
                    <Link
                        href="/productos"
                        className="flex items-center gap-1 text-sm font-medium text-gray-600 transition hover:text-black"
                    >
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
