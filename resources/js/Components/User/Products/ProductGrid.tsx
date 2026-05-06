import { useState, useMemo } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';

interface Category {
    id: string;
    name: string;
    productCount: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category: string;
}

interface ProductGridProps {
    initialProducts: Product[];
    categories: Category[];
}

export default function ProductGrid({ initialProducts, categories }: ProductGridProps) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let filtered = initialProducts;
        if (activeCategory !== 'all') {
            filtered = filtered.filter((p) => p.categorySlug === activeCategory || p.category.toLowerCase() === activeCategory.toLowerCase());
        }
        return filtered;
    }, [activeCategory, initialProducts]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortBy) {
            case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
            case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default: return sorted;
        }
    }, [filteredProducts, sortBy]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-6">Categorías</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all flex justify-between items-center ${activeCategory === 'all' ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'}`}
                            >
                                <span>Todas</span>
                                <span className="text-xs opacity-60">{initialProducts.length}</span>
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all flex justify-between items-center ${activeCategory === cat.id ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'}`}
                                >
                                    <span>{cat.name}</span>
                                    <span className="text-xs opacity-60">{cat.productCount}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando <span className="font-bold text-gray-900 dark:text-white">{sortedProducts.length}</span> productos
                    </p>

                    <div className="flex items-center gap-3">
                        <ArrowUpDown size={16} className="text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm bg-transparent border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer dark:text-white"
                        >
                            <option value="featured">Destacados</option>
                            <option value="price-asc">Precio: menor a mayor</option>
                            <option value="price-desc">Precio: mayor a menor</option>
                            <option value="name-asc">Nombre: A-Z</option>
                            <option value="name-desc">Nombre: Z-A</option>
                        </select>
                    </div>
                </div>

                {sortedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay productos disponibles</h3>
                        <p className="text-gray-500 dark:text-gray-400">Prueba ajustando tus filtros</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
