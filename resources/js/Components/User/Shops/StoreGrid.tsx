import StoreCard from './StoreCard';
import { Store as StoreIcon } from 'lucide-react';
import { Store } from './types';

type Props = {
    stores: Store[];
};

export default function StoreGrid({ stores }: Props) {
    if (stores.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <StoreIcon size={32} className="text-gray-400" />
                    </div>

                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No encontramos tiendas
                    </h3>

                    <p className="text-sm text-gray-500">
                        No hay tiendas disponibles por el momento
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="mb-6">
                <p className="text-sm text-gray-500">
                    Mostrando{' '}
                    <span className="font-medium text-gray-900">
                        {stores.length}
                    </span>{' '}
                    tiendas
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </div>
        </div>
    );
}
