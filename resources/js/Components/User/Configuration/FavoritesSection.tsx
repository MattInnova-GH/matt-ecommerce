import React from 'react';
import { router } from '@inertiajs/react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Favorite } from './types/settings';

export function FavoritesSection({ favorites }: { favorites: Favorite[] }) {
    const handleRemove = (productId: number) => {
        router.delete(`/favoritos/${productId}`, { preserveScroll: true });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Mis Favoritos</h2>
                <p className="text-sm text-muted-foreground">
                    Productos que has guardado para ver más tarde.
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                    <Heart className="h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">
                        No tienes favoritos aún
                    </p>
                    <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => router.visit('/productos')}
                    >
                        Ver productos
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="aspect-square overflow-hidden bg-muted">
                                <img
                                    src={product.imageUrl ?? ''}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-muted-foreground">
                                    {product.category}
                                </p>
                                <h3 className="truncate font-medium">
                                    {product.name}
                                </h3>
                                <p className="mt-1 font-bold">
                                    S/ {product.price}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() =>
                                            router.visit(
                                                `/productos/${product.slug}`,
                                            )
                                        }
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleRemove(product.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
