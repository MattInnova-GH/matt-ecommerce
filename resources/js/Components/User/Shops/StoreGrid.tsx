import { Store as StoreIcon } from 'lucide-react';
import StoreCard from './StoreCard';

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

interface StoreGridProps {
    stores: Store[];
}

export default function StoreGrid({ stores }: StoreGridProps) {
    if (stores.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                        <StoreIcon size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No encontramos tiendas</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No hay tiendas disponibles por el momento</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando <span className="font-bold text-gray-900 dark:text-white">{stores.length}</span> tiendas oficiales
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </div>
        </div>
    );
}
