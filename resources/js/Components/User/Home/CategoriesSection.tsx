import { ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
}

export default function CategoriesSection({
    categories = [],
}: {
    categories?: Category[];
}) {
    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center sm:mb-12">
                    <h2 className="mb-3 text-2xl font-light sm:text-3xl lg:text-4xl">
                        Compra por categorías
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
                        Encuentra lo que necesitas en nuestras categorías
                        destacadas
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/productos?category=${category.id}`}
                            className="group relative aspect-3/4 overflow-hidden rounded-2xl"
                        >
                            <img
                                src={
                                    category.imageUrl ||
                                    '/img/placeholder-category.jpg'
                                }
                                alt={category.name}
                                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                                <h3 className="mb-1.5 text-2xl font-bold">
                                    {category.name}
                                </h3>
                                {category.productCount !== undefined && (
                                    <p className="mb-3 text-sm text-gray-200">
                                        {category.productCount} productos
                                    </p>
                                )}
                                <div className="flex items-center gap-1.5 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                                    Ver productos <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
