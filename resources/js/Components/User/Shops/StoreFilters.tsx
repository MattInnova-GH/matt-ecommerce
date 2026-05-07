import { router } from '@inertiajs/react';
import { Search, SlidersHorizontal } from 'lucide-react';

type Props = {
    filters: {
        search?: string;
        sort?: string;
    };
};

export default function StoreFilters({ filters }: Props) {
    const search = filters.search || '';
    const sort = filters.sort || 'name';

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-gray-50 p-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Buscar vendedor..."
                        defaultValue={search}
                        onChange={(e) => updateParams('search', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">
                    <SlidersHorizontal size={14} className="text-gray-400" />

                    <select
                        defaultValue={sort}
                        onChange={(e) => updateParams('sort', e.target.value)}
                        className="cursor-pointer bg-transparent text-sm text-gray-700 focus:outline-none"
                    >
                        <option value="name">Nombre A-Z</option>
                        <option value="products">Más productos</option>
                        <option value="newest">Más recientes</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
