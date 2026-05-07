import { Link } from '@inertiajs/react';
import { ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import { Store } from './types';

type Props = {
    store: Store;
};

export default function StoreCard({ store }: Props) {
    const sellerFullName = store.sellerLastName
        ? `${store.sellerName} ${store.sellerLastName}`
        : store.sellerName;

    const displayName = store.storeName ?? sellerFullName;

    const initials =
        `${store.sellerName?.[0] ?? ''}${store.sellerLastName?.[0] ?? ''}`.toUpperCase();

    const featuredProducts = store.products.slice(0, 4);

    return (
        <Link href={`/tiendas/${store.id}`} className="group block">
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-500 hover:border-gray-200 hover:shadow-xl">
                {/* Banner */}
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
                    {store.storeCover ? (
                        <img
                            src={store.storeCover}
                            alt={displayName}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px',
                            }}
                        />
                    )}

                    {store.storeCover && (
                        <div className="absolute inset-0 bg-black/30" />
                    )}

                    <div className="absolute top-3 right-3 z-10">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-white/20">
                            <ArrowUpRight
                                size={14}
                                className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </div>
                    </div>
                </div>

                {/* Avatar */}
                <div className="absolute top-16 left-5 z-10">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg">
                        {store.storeLogo ? (
                            <img
                                src={store.storeLogo}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : store.image ? (
                            <img
                                src={store.image}
                                alt={sellerFullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                <span className="text-xl font-bold text-white">
                                    {initials}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="px-5 pt-14 pb-5">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <h3 className="text-base leading-tight font-semibold text-gray-900 transition-colors group-hover:text-gray-600">
                                {displayName}
                            </h3>

                            {store.storeName && (
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {sellerFullName}
                                </p>
                            )}

                            <div className="mt-1 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star
                                        size={11}
                                        className="fill-amber-400 text-amber-400"
                                    />
                                    <span className="text-xs font-medium text-gray-700">
                                        4.8
                                    </span>
                                </div>

                                <span className="text-gray-200">·</span>

                                <span className="text-xs text-gray-400">
                                    Desde {new Date(store.since).getFullYear()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1">
                            <ShoppingBag size={11} className="text-gray-400" />

                            <span className="text-xs font-medium text-gray-600">
                                {store.productCount}
                            </span>
                        </div>
                    </div>

                    {store.description && (
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
                            {store.description}
                        </p>
                    )}

                    {featuredProducts.length > 0 ? (
                        <div className="mt-3 grid grid-cols-4 gap-1.5">
                            {featuredProducts.map((product, i) => (
                                <div
                                    key={product.id}
                                    className={`aspect-square overflow-hidden rounded-xl bg-gray-100 ${
                                        i === 0 ? 'col-span-2 row-span-2' : ''
                                    }`}
                                >
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-50">
                                            <ShoppingBag
                                                size={14}
                                                className="text-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-3 flex h-16 items-center justify-center rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-400">
                                Sin productos aún
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
