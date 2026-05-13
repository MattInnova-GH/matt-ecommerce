import { useState, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Search, Loader2, ArrowRight, Package, Grid3X3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    category: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
    productCount: number;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [results, setResults] = useState<Product[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const fetchData = useCallback(async (url: string) => {
        setProcessing(true);

        try {
            const res = await fetch(url, {
                headers: { Accept: 'application/json' },
            });

            return await res.json();
        } finally {
            setProcessing(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && isInitialLoading) {
            fetchData('/buscar').then((data) => {
                setProducts(data.products || []);
                setCategories(data.categories || []);
                setIsInitialLoading(false);
            });
        }
    }, [isOpen, isInitialLoading, fetchData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const performSearch = useCallback(
        (searchTerm: string) => {
            if (searchTerm.length < 2) {
                setResults([]);

                return;
            }

            fetchData(`/buscar?q=${encodeURIComponent(searchTerm)}`).then(
                (data) => {
                    setResults(data.products || []);
                },
            );
        },
        [fetchData],
    );

    const handleClose = () => {
        setQuery('');
        setResults([]);
        setIsInitialLoading(true);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[700px]">
                {/* Header */}
                <div className="border-b">
                    <DialogHeader className="p-4">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar productos..."
                                className="h-11 border-0 bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            {processing && (
                                <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-gray-400" />
                            )}
                        </div>
                    </DialogHeader>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="p-4">
                        {query.length >= 2 ? (
                            // Resultados de búsqueda
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Resultados
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        {results.length} productos
                                    </span>
                                </div>

                                {results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/productos/${product.slug}`}
                                                onClick={handleClose}
                                                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                            >
                                                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </h4>
                                                    <div className="mt-0.5 flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            {product.category}
                                                        </span>
                                                        <span className="text-xs text-gray-300">
                                                            •
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            S/{' '}
                                                            {product.price.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-gray-300" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : !processing ? (
                                    <div className="py-12 text-center">
                                        <Search className="mx-auto h-8 w-8 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            No se encontraron resultados
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Intenta con otra palabra
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Categorías */}
                                {categories.length > 0 && (
                                    <div>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Grid3X3 className="h-3.5 w-3.5 text-gray-400" />
                                            <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Categorías
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/productos?category=${cat.slug}`}
                                                    onClick={handleClose}
                                                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 transition-colors hover:bg-gray-50"
                                                >
                                                    <span className="text-sm text-gray-700">
                                                        {cat.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {cat.productCount}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* Productos destacados */}
                                {products.length > 0 && (
                                    <div>
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-3.5 w-3.5 text-gray-400" />
                                                <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Recién llegados
                                                </h3>
                                            </div>
                                            <Link
                                                href="/productos"
                                                onClick={handleClose}
                                                className="text-xs text-gray-400 transition-colors hover:text-gray-600"
                                            >
                                                Ver todos →
                                            </Link>
                                        </div>
                                        <div className="space-y-3">
                                            {products
                                                .slice(0, 4)
                                                .map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href={`/productos/${product.slug}`}
                                                        onClick={handleClose}
                                                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                    >
                                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                            <img
                                                                src={
                                                                    product.imageUrl
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="truncate text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                S/{' '}
                                                                {product.price.toFixed(
                                                                    2,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-gray-50/50 px-4 py-2 text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-500">
                                ESC
                            </kbd>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-500">
                                ↑
                            </kbd>
                            <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-500">
                                ↓
                            </kbd>
                        </span>
                    </div>
                    <span>Busca productos por nombre o categoría</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
