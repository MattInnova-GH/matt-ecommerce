import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Trash2 } from 'lucide-react';

import type { PublicProduct } from '@/lib/types/type.public';
import UserLayout from '@/layouts/UserLayout';

type FavoriteProduct = PublicProduct & {
    favoritedAt: string;
};

type PageProps = {
    favorites: FavoriteProduct[];
};

export default function FavoritesPage() {
    const { favorites: initialFavorites } = usePage<PageProps>().props;

    const [favorites, setFavorites] = useState<FavoriteProduct[]>(
        initialFavorites ?? [],
    );

    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const handleRemoveFavorite = (productId: number) => {
        setFavorites((prev) => prev.filter((p) => p.id !== productId));

        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
        });
    };

    const handleToggleSelect = (productId: number) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            newSet.has(productId)
                ? newSet.delete(productId)
                : newSet.add(productId);

            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.size === favorites.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(favorites.map((p) => p.id)));
        }
    };

    const handleRemoveSelected = () => {
        setFavorites((prev) => prev.filter((p) => !selectedItems.has(p.id)));
        setSelectedItems(new Set());
    };

    const handleAddAllToCart = () => {
        const selectedProducts = favorites.filter((p) =>
            selectedItems.has(p.id),
        );

        console.log('Agregar al carrito:', selectedProducts);

        // aquí normalmente harías:
        // router.post('/cart/bulk', selectedProducts)
    };

    const isLoading = false; // Inertia ya controla esto con navigation state

    return (
        <UserLayout>
            <main className="min-h-screen bg-gray-50">
                {/* HERO */}
                <div className="bg-gray-900 text-white">
                    <div className="mx-auto max-w-7xl px-6 py-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-sm">
                                    <Heart size={14} />
                                    Mis favoritos
                                </div>

                                <h1 className="text-3xl font-light">
                                    Lista de deseos
                                </h1>

                                <p className="mt-1 text-gray-300">
                                    {favorites.length} productos guardados
                                </p>
                            </div>

                            {favorites.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className="rounded-lg border border-white/30 px-4 py-2 text-sm"
                                    >
                                        Seleccionar
                                    </button>

                                    {selectedItems.size > 0 && (
                                        <button
                                            onClick={handleRemoveSelected}
                                            className="rounded-lg bg-red-500/20 px-4 py-2 text-sm"
                                        >
                                            Eliminar ({selectedItems.size})
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mx-auto max-w-7xl px-6 py-10">
                    {favorites.length === 0 ? (
                        <div className="py-20 text-center">
                            <Heart
                                size={40}
                                className="mx-auto text-gray-400"
                            />
                            <h2 className="mt-4 text-xl">
                                No tienes favoritos
                            </h2>

                            <Link
                                href="/productos"
                                className="mt-6 inline-flex rounded-lg bg-black px-5 py-2 text-white"
                            >
                                Explorar productos
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* BULK ACTIONS */}
                            {selectedItems.size > 0 && (
                                <div className="mb-6 flex justify-between rounded-lg border bg-white p-4">
                                    <span>
                                        {selectedItems.size} seleccionados
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAddAllToCart}
                                            className="rounded bg-black px-3 py-2 text-white"
                                        >
                                            Agregar al carrito
                                        </button>

                                        <button
                                            onClick={handleRemoveSelected}
                                            className="px-3 py-2 text-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* GRID */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {favorites.map((product) => (
                                    <FavoriteCard
                                        key={product.id}
                                        product={product}
                                        isSelected={selectedItems.has(
                                            product.id,
                                        )}
                                        onToggleSelect={() =>
                                            handleToggleSelect(product.id)
                                        }
                                        onRemove={() =>
                                            handleRemoveFavorite(product.id)
                                        }
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </UserLayout>
    );
}

/* ================= CARD ================= */

function FavoriteCard({ product, isSelected, onToggleSelect, onRemove }: any) {
    return (
        <div
            className={`overflow-hidden rounded-xl border bg-white ${
                isSelected ? 'border-black' : 'border-gray-200'
            }`}
        >
            <div className="relative">
                <button
                    onClick={onToggleSelect}
                    className="absolute top-3 left-3 rounded bg-white p-1"
                >
                    {isSelected ? '✓' : ''}
                </button>

                <button
                    onClick={onRemove}
                    className="absolute top-3 right-3 text-red-500"
                >
                    <Trash2 size={16} />
                </button>

                <Link href={`/productos/${product.slug}`}>
                    <img
                        src={product.imageUrl}
                        className="h-48 w-full object-cover"
                    />
                </Link>
            </div>

            <div className="p-4">
                <Link href={`/productos/${product.slug}`}>
                    <p className="text-sm text-gray-500">{product.category}</p>

                    <h3 className="font-medium">{product.name}</h3>

                    <p className="mt-1 font-bold">${product.price}</p>
                </Link>
            </div>
        </div>
    );
}
