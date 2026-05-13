import { useEffect, useState } from 'react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import axios from 'axios';
import { MapPin, Store, Check } from 'lucide-react';

export function StoreSelector() {
    const { selectedStore, setSelectedStore } = useCheckoutStore();
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/api/stores')
            .then((res) => setStores(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-3 border-t border-gray-100 pt-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-gray-100"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 border-t border-gray-100 pt-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Store size={16} className="text-gray-400" />
                Selecciona una tienda
            </p>

            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {stores.map((store) => {
                    const isSelected = selectedStore?.id === store.id;
                    const name = store.sellerLastName
                        ? `${store.sellerName} ${store.sellerLastName}`
                        : store.sellerName;

                    return (
                        <button
                            key={store.id}
                            onClick={() =>
                                setSelectedStore({
                                    id: store.id,
                                    name,
                                    address:
                                        store.address ||
                                        'Dirección no disponible',
                                })
                            }
                            className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            } `}
                        >
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                                {store.image ? (
                                    <img
                                        src={store.image}
                                        alt={name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Store
                                        size={18}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <p
                                    className={`truncate text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                                >
                                    {name}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                    <MapPin size={10} />
                                    {store.address || 'Ver dirección en tienda'}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {store.productCount} productos disponibles
                                </p>
                            </div>

                            {/* Check */}
                            {isSelected && (
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {selectedStore && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                    <p className="text-xs font-medium text-green-700">
                        ✓ Recogerás en: {selectedStore.name}
                    </p>
                    {selectedStore.address && (
                        <p className="mt-0.5 text-xs text-green-600">
                            {selectedStore.address}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
