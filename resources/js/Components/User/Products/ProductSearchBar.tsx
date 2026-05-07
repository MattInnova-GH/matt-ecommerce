import { Link } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PublicProduct } from './types';

type Props = {
    products: PublicProduct[];
};

export default function ProductSearchBar({ products }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PublicProduct[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (query.length >= 2) {
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase()),
            );

            setResults(filtered.slice(0, 8));
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query, products]);

    return (
        <div ref={searchRef} className="relative mx-auto max-w-2xl">
            <div className="relative">
                <Search
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pr-10 pl-11 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    {results.map((product) => (
                        <Link
                            key={product.id}
                            href={`/productos/${product.slug}`}
                            className="flex items-center gap-3 border-b border-gray-100 p-3 transition hover:bg-gray-50"
                        >
                            <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {product.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    ${product.price}
                                </p>
                            </div>

                            <span className="text-xs text-gray-400">
                                {product.category}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
