import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Heart,
    Trash2,
    ShoppingCart,
    CheckSquare,
    Square,
    PackageOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { PublicProduct } from '@/lib/types/type.public';
import client from '@/routes/client';

type FavoriteProduct = PublicProduct & { favoritedAt: string };
type PageProps = { favorites: FavoriteProduct[] };

export default function FavoritesPage() {
    const { favorites: initialFavorites } = usePage<PageProps>().props;
    const [favorites, setFavorites] = useState<FavoriteProduct[]>(
        initialFavorites ?? [],
    );
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

    /* ── helpers ── */
    const allSelected =
        favorites.length > 0 && selectedItems.size === favorites.length;

    const toggleSelect = (id: number) =>
        setSelectedItems((prev) => {
            const next = new Set(prev);

            next.has(id) ? next.delete(id) : next.add(id);

            return next;
        });

    const toggleAll = () =>
        setSelectedItems(
            allSelected ? new Set() : new Set(favorites.map((p) => p.id)),
        );

    /* ── DELETE ONE ── */
    const handleRemoveOne = (productId: number) => {
        setRemovingIds((prev) => new Set(prev).add(productId));

        router.delete(client.favorites.destroy(productId), {
            preserveScroll: true,
            onSuccess: () => {
                setFavorites((prev) => prev.filter((p) => p.id !== productId));
                setSelectedItems((prev) => {
                    const next = new Set(prev);
                    next.delete(productId);

                    return next;
                });
            },
            onFinish: () =>
                setRemovingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(productId);

                    return next;
                }),
        });
    };

    /* ── DELETE MANY ── */
    const handleRemoveSelected = () => {
        const ids = Array.from(selectedItems);

        router.post(
            client.favorites.bulkDelete(),
            { ids },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFavorites((prev) =>
                        prev.filter((p) => !selectedItems.has(p.id)),
                    );
                    setSelectedItems(new Set());
                },
            },
        );
    };

    /* ── ADD TO CART (bulk) ── */
    const handleAddAllToCart = () => {
        const selectedProducts = favorites.filter((p) =>
            selectedItems.has(p.id),
        );
        console.log('Agregar al carrito:', selectedProducts);
        // router.post('/cart/bulk', { products: selectedProducts })
    };

    return (
        <main className="min-h-screen bg-muted/40">
            {/* HERO */}
            <div className="border-b bg-background">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <Heart
                                    size={14}
                                    className="fill-rose-500 text-rose-500"
                                />
                                <span>Lista de deseos</span>
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Mis Favoritos
                            </h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {favorites.length}{' '}
                                {favorites.length === 1
                                    ? 'producto guardado'
                                    : 'productos guardados'}
                            </p>
                        </div>

                        {favorites.length > 0 && (
                            <div className="mt-4 flex items-center gap-2 sm:mt-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleAll}
                                >
                                    {allSelected ? (
                                        <>
                                            <CheckSquare
                                                size={15}
                                                className="mr-1.5"
                                            />{' '}
                                            Deseleccionar todo
                                        </>
                                    ) : (
                                        <>
                                            <Square
                                                size={15}
                                                className="mr-1.5"
                                            />{' '}
                                            Seleccionar todo
                                        </>
                                    )}
                                </Button>

                                {selectedItems.size > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2
                                                    size={14}
                                                    className="mr-1.5"
                                                />
                                                Eliminar ({selectedItems.size})
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    ¿Eliminar favoritos?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Se eliminarán{' '}
                                                    {selectedItems.size}{' '}
                                                    {selectedItems.size === 1
                                                        ? 'producto'
                                                        : 'productos'}{' '}
                                                    de tu lista. Esta acción no
                                                    se puede deshacer.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={
                                                        handleRemoveSelected
                                                    }
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="mx-auto max-w-6xl px-6 py-8">
                {favorites.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* BULK ACTION BAR */}
                        {selectedItems.size > 0 && (
                            <div className="mb-6 flex items-center justify-between rounded-lg border bg-background px-4 py-3 shadow-sm">
                                <span className="text-sm font-medium">
                                    <Badge variant="secondary" className="mr-2">
                                        {selectedItems.size}
                                    </Badge>
                                    {selectedItems.size === 1
                                        ? 'producto seleccionado'
                                        : 'productos seleccionados'}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleAddAllToCart}
                                    >
                                        <ShoppingCart
                                            size={14}
                                            className="mr-1.5"
                                        />
                                        Agregar al carrito
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2
                                                    size={14}
                                                    className="mr-1.5"
                                                />
                                                Eliminar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    ¿Eliminar favoritos?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Se eliminarán{' '}
                                                    {selectedItems.size}{' '}
                                                    {selectedItems.size === 1
                                                        ? 'producto'
                                                        : 'productos'}{' '}
                                                    de tu lista.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={
                                                        handleRemoveSelected
                                                    }
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )}

                        {/* GRID */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((product) => (
                                <FavoriteCard
                                    key={product.id}
                                    product={product}
                                    isSelected={selectedItems.has(product.id)}
                                    isRemoving={removingIds.has(product.id)}
                                    onToggleSelect={() =>
                                        toggleSelect(product.id)
                                    }
                                    onRemove={() => handleRemoveOne(product.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

/* ── EMPTY STATE ── */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-5">
                <PackageOpen size={36} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No tienes favoritos aún</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Guarda los productos que te interesen y encuéntralos aquí
                fácilmente.
            </p>
            <Button asChild className="mt-6">
                <Link href="/productos">Explorar productos</Link>
            </Button>
        </div>
    );
}

/* ── CARD ── */
function FavoriteCard({
    product,
    isSelected,
    isRemoving,
    onToggleSelect,
    onRemove,
}: {
    product: FavoriteProduct;
    isSelected: boolean;
    isRemoving: boolean;
    onToggleSelect: () => void;
    onRemove: () => void;
}) {
    return (
        <div
            className={`group relative overflow-hidden rounded-xl border bg-background transition-all duration-200 ${
                isSelected
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-muted-foreground/40 hover:shadow-md'
            } ${isRemoving ? 'pointer-events-none opacity-50' : ''}`}
        >
            {/* Image area */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* Checkbox */}
                <button
                    onClick={onToggleSelect}
                    className="absolute top-3 left-3 z-10 rounded-md bg-background/90 p-1.5 shadow-sm backdrop-blur-sm transition-opacity"
                    aria-label="Seleccionar"
                >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onToggleSelect}
                        className="pointer-events-none"
                    />
                </button>

                {/* Remove */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-md bg-background/90 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                            disabled={isRemoving}
                        >
                            <Trash2 size={15} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                ¿Eliminar de favoritos?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Se eliminará <strong>{product.name}</strong> de
                                tu lista de deseos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={onRemove}
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Link href={`/productos/${product.slug}`}>
                    <img
                        src={product.imageUrl ?? '/placeholder.png'}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
            </div>

            <Separator />

            {/* Info */}
            <div className="p-4">
                <Link
                    href={`/productos/${product.slug}`}
                    className="group/link block"
                >
                    <p className="mb-0.5 text-xs tracking-wide text-muted-foreground uppercase">
                        {product.category}
                    </p>
                    <h3 className="line-clamp-2 text-sm leading-snug font-medium group-hover/link:underline">
                        {product.name}
                    </h3>
                    <p className="mt-2 text-base font-bold">${product.price}</p>
                </Link>

                <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => console.log('add to cart', product.id)}
                >
                    <ShoppingCart size={14} className="mr-1.5" />
                    Agregar al carrito
                </Button>
            </div>
        </div>
    );
}
