import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import ProductGrid from '@/Components/User/Products/ProductGrid';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl?: string;
    category: string;
}

interface Category {
    id: string;
    name: string;
    productCount: number;
}

interface ProductsIndexProps {
    products: Product[];
    categories: Category[];
}

export default function Index({
    products = [],
    categories = [],
}: ProductsIndexProps) {
    return (
        <UserLayout>
            <Head title="Nuestros Productos | Matt" />

            {/* Header / Hero */}
            <div className="bg-gray-50 py-16 md:py-24 dark:bg-zinc-900/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold tracking-widest text-emerald-700 uppercase dark:bg-emerald-950 dark:text-emerald-400">
                            Colección {new Date().getFullYear()}
                        </div>
                        <h1 className="mb-6 text-4xl font-light tracking-tight text-gray-900 md:text-5xl lg:text-7xl dark:text-white">
                            Nuestros Productos
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-600 md:text-xl dark:text-gray-400">
                            Descubre nuestra colección exclusiva, diseñada para
                            inspirar tu estilo de vida con lo último en moda y
                            tecnología.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <ProductGrid
                    initialProducts={products}
                    categories={categories}
                />
            </div>
        </UserLayout>
    );
}
