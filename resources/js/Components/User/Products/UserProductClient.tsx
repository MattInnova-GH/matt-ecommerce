import ProductGrid from './ProductGrid';
import ProductSearchBar from './ProductSearchBar';

import { Category, PublicProduct } from './types';

type Props = {
    initialProducts: PublicProduct[];
    initialCategories: Category[];
};

export default function UserProductClient({
    initialProducts,
    initialCategories,
}: Props) {
    const filterCategories = [
        {
            id: 'all',
            name: 'Todos',
            productCount: initialProducts.length,
        },
        ...initialCategories.map((category) => ({
            id: category.id,
            name: category.name,
            productCount: category.productCount,
        })),
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-sm text-gray-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-black" />
                            Colección {new Date().getFullYear()}
                        </div>

                        <h1 className="mb-6 text-4xl font-light tracking-tight text-gray-900 md:text-6xl">
                            Nuestros Productos
                        </h1>

                        <p className="text-base text-gray-600 md:text-lg">
                            Descubre nuestra colección exclusiva diseñada para
                            elevar tu estilo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search */}
            <div className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <ProductSearchBar products={initialProducts} />
                </div>
            </div>

            {/* Grid */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <ProductGrid
                    initialProducts={initialProducts}
                    categories={filterCategories}
                />
            </section>
        </main>
    );
}
