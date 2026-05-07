import Navbar from '@/Components/Shared/Navbar';
import Footer from '@/Components/Shared/Footer';

import StoreFilters from './StoreFilters';
import StoreGrid from './StoreGrid';

import { Store } from './types';

type Props = {
    stores: Store[];
    filters: {
        search?: string;
        sort?: string;
    };
};

export default function UserStoreClient({ stores, filters }: Props) {
    const totalStores = stores?.length || 0;

    const totalProducts =
        stores?.reduce((acc, store) => acc + store.productCount, 0) || 0;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-white">
                <div className="relative overflow-hidden bg-gray-950">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                            backgroundSize: '32px 32px',
                        }}
                    />

                    <div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-gray-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                Vendedores verificados
                            </div>

                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
                                Tiendas Oficiales
                            </h1>

                            <p className="text-base text-gray-400 md:text-lg">
                                Descubre productos únicos de nuestros vendedores
                                verificados
                            </p>

                            <div className="mt-10 flex items-center justify-center gap-12">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">
                                        {totalStores}
                                    </p>

                                    <p className="mt-1 text-xs tracking-widest text-gray-500 uppercase">
                                        Tiendas
                                    </p>
                                </div>

                                <div className="h-10 w-px bg-gray-800" />

                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white">
                                        {totalProducts}
                                    </p>

                                    <p className="mt-1 text-xs tracking-widest text-gray-500 uppercase">
                                        Productos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <StoreFilters filters={filters} />

                <StoreGrid stores={stores} />
            </main>

            <Footer />
        </>
    );
}
