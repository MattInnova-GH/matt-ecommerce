import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';

import ProductCard from './ProductCard';

import { Category, PublicProduct } from './types';

type Props = {
    initialProducts: PublicProduct[];
    categories: Category[];
};

export default function ProductGrid({ initialProducts, categories }: Props) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'all') {
            return initialProducts;
        }

        return initialProducts.filter(
            (product) =>
                product.category.toLowerCase() === activeCategory.toLowerCase(),
        );
    }, [activeCategory, initialProducts]);

    return (
        <div className="flex flex-col gap-10 lg:flex-row">
            <aside className="w-full lg:w-72">
                <div className="sticky top-28 rounded-2xl border border-gray-100 p-5">
                    <div className="mb-6 flex items-center gap-2">
                        <Filter size={18} />

                        <h3 className="font-medium text-gray-900">
                            Categorías
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() =>
                                    setActiveCategory(String(category.id))
                                }
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                                    activeCategory === category.id
                                        ? 'bg-black text-white'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <span>{category.name}</span>

                                <span className="text-xs">
                                    {category.productCount}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            <div className="flex-1">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <p className="text-sm text-gray-500">
                        {filteredProducts.length} productos
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
