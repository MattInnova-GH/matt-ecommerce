import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

export default function FeaturedProducts({ products = [] }: { products?: Product[] }) {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8 sm:mb-12">
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-2 dark:text-white">
                            Productos destacados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Los más vendidos de esta semana</p>
                    </div>
                    <Link
                        href="/productos"
                        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition flex items-center gap-1"
                    >
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
