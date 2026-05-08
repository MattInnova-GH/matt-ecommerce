import { useState, useEffect, useCallback } from 'react';
import { useHttp, Link } from '@inertiajs/react';
import { Search, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

    const { get, processing } = useHttp();

    // Fetch initial data (popular products and categories)
    useEffect(() => {
        if (isOpen && isInitialLoading) {
            get('', {
                onSuccess: (page: any) => {
                    setProducts(page.products || []);
                    setCategories(page.categories || []);
                    setIsInitialLoading(false);
                },
            });
        }
    }, [isOpen, isInitialLoading, get]);

    // Debounced search
    const performSearch = useCallback(
        (searchTerm: string) => {
            if (searchTerm.length < 2) {
                setResults([]);
                return;
            }

            get(
                '',
                { q: searchTerm },
                {
                    onSuccess: (page: any) => {
                        setResults(page.products || []);
                    },
                },
            );
        },
        [get],
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    const handleClose = () => {
        setQuery('');
        setResults([]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[700px]">
                <DialogHeader className="border-b p-4">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Buscar productos, marcas, categorías..."
                            className="h-12 border-none bg-transparent pl-10 text-lg shadow-none focus-visible:ring-0"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        {processing && (
                            <Loader2 className="absolute right-3 h-5 w-5 animate-spin text-gray-400" />
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto p-4">
                    {query.length >= 2 ? (
                        <div className="space-y-4">
                            <h3 className="px-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                Resultados de búsqueda
                            </h3>
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/productos/${product.slug}`}
                                            onClick={handleClose}
                                            className="group flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate font-medium text-gray-900 group-hover:text-black">
                                                    {product.name}
                                                </h4>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">
                                                        {product.category}
                                                    </span>
                                                    <span className="text-xs text-gray-300">
                                                        •
                                                    </span>
                                                    <span className="font-semibold text-black">
                                                        S/{' '}
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-black" />
                                        </Link>
                                    ))}
                                </div>
                            ) : !processing ? (
                                <div className="py-12 text-center">
                                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-500">
                                        No encontramos productos para "{query}"
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="space-y-8 py-2">
                            {/* Categorías sugeridas */}
                            {categories.length > 0 && (
                                <section>
                                    <h3 className="mb-4 px-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Categorías Populares
                                    </h3>
                                    <div className="flex flex-wrap gap-2 px-2">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/productos?category=${cat.slug}`}
                                                onClick={handleClose}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer rounded-full border-none bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                                                >
                                                    {cat.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Productos destacados */}
                            {products.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center justify-between px-2">
                                        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                            Recién llegados
                                        </h3>
                                        <Link
                                            href="/productos"
                                            onClick={handleClose}
                                            className="flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                                        >
                                            Ver todos{' '}
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 px-2 sm:grid-cols-2">
                                        {products.slice(0, 4).map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/productos/${product.slug}`}
                                                onClick={handleClose}
                                                className="group space-y-3"
                                            >
                                                <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                                                </div>
                                                <div className="px-1">
                                                    <h4 className="line-clamp-1 text-sm font-medium text-gray-900 group-hover:underline">
                                                        {product.name}
                                                    </h4>
                                                    <p className="mt-1 text-sm font-bold text-black">
                                                        S/{' '}
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t bg-gray-50 p-4 text-xs text-gray-400">
                    <div className="flex gap-4">
                        <span>
                            <kbd className="mr-1 rounded border bg-white px-1.5 py-0.5 text-gray-600">
                                ESC
                            </kbd>{' '}
                            para cerrar
                        </span>
                        <span>
                            <kbd className="mr-1 rounded border bg-white px-1.5 py-0.5 text-gray-600">
                                ↑↓
                            </kbd>{' '}
                            para navegar
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
