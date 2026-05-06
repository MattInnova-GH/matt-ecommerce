import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import StoreGrid from '@/Components/User/Shops/StoreGrid';

interface Product {
    id: number;
    name: string;
    imageUrl?: string;
}

interface Store {
    id: number;
    storeName?: string;
    description?: string;
    storeLogo?: string;
    storeCover?: string;
    sellerName: string;
    sellerLastName?: string;
    productCount: number;
    since: string;
    products: Product[];
}

interface ShopsIndexProps {
    stores: Store[];
}

export default function Index({ stores = [] }: ShopsIndexProps) {
    const totalStores = stores.length;
    const totalProducts = stores.reduce(
        (acc, store) => acc + store.productCount,
        0,
    );

    return (
        <UserLayout>
            <Head title="Tiendas Oficiales | Matt" />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gray-950 py-16 md:py-24">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold tracking-widest text-gray-400 uppercase">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Vendedores verificados
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                            Tiendas Oficiales
                        </h1>
                        <p className="text-lg font-light text-gray-400 md:text-xl">
                            Descubre productos únicos y exclusivos directamente
                            de nuestros vendedores verificados.
                        </p>

                        <div className="mt-12 flex items-center justify-center gap-12">
                            <div className="text-center">
                                <p className="text-4xl font-bold tracking-tighter text-white">
                                    {totalStores}
                                </p>
                                <p className="mt-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    Tiendas
                                </p>
                            </div>
                            <div className="h-12 w-px bg-zinc-800" />
                            <div className="text-center">
                                <p className="text-4xl font-bold tracking-tighter text-white">
                                    {totalProducts}
                                </p>
                                <p className="mt-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    Productos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StoreGrid stores={stores} />
        </UserLayout>
    );
}
