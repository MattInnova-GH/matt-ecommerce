import React, { useState, useEffect } from 'react';
import { router, Head } from '@inertiajs/react';
import {
    Search,
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import ProductCard, {
    ProductCardSkeleton,
} from '@/Components/User/Products/ProductCard';

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    final_price: number;
    has_discount: boolean;
    discount_badge?: string;
    stock: number;
    category: string;
    imageUrl: string | null;
    is_favorited: boolean;
    colors?: string[];
}

interface PaginatedProducts {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

interface Filters {
    search: string | null;
    category: string | null;
    brand: string | null;
    min_price: string | null;
    max_price: string | null;
    sort: string;
}

interface CatalogProps {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: Filters;
    priceRange: { min: number; max: number };
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

export default function Product({
    products,
    categories,
    brands,
    filters,
    priceRange,
}: CatalogProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isLoading, setIsLoading] = useState(true);
    const [priceValue, setPriceValue] = useState<[number, number]>([
        filters.min_price ? parseInt(filters.min_price) : priceRange.min,
        filters.max_price ? parseInt(filters.max_price) : priceRange.max,
    ]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Suave transición al cargar nueva data
    const [prevProductsData, setPrevProductsData] = useState(products.data);
    if (products.data !== prevProductsData) {
        setPrevProductsData(products.data);
        setIsLoading(true);
    }

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, [isLoading]);

    const buildParams = (overrides: Partial<Filters> = {}) => {
        const merged = { ...localFilters, ...overrides };
        const params = new URLSearchParams();

        if (merged.search) {
            params.append('search', merged.search);
        }

        if (merged.category) {
            params.append('category', merged.category);
        }

        if (merged.brand) {
            params.append('brand', merged.brand);
        }

        if (priceValue[0] > priceRange.min) {
            params.append('min_price', priceValue[0].toString());
        }

        if (priceValue[1] < priceRange.max) {
            params.append('max_price', priceValue[1].toString());
        }

        if (merged.sort && merged.sort !== 'latest') {
            params.append('sort', merged.sort);
        }

        return params.toString();
    };

    const applyFilters = () => {
        router.get(`/productos?${buildParams()}`);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setLocalFilters({
            search: null,
            category: null,
            brand: null,
            min_price: null,
            max_price: null,
            sort: 'latest',
        });
        setPriceValue([priceRange.min, priceRange.max]);
        router.get('/productos');
    };

    const handleSortChange = (value: string) => {
        const newFilters = { ...localFilters, sort: value };
        setLocalFilters(newFilters);
        router.get(`/productos?${buildParams({ sort: value })}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const hasActiveFilters = !!(
        localFilters.category ||
        localFilters.brand ||
        priceValue[0] > priceRange.min ||
        priceValue[1] < priceRange.max ||
        localFilters.search
    );

    const paginationLinks = products.links.filter(
        (_, i) => i !== 0 && i !== products.links.length - 1,
    );
    const prevLink = products.links[0];
    const nextLink = products.links[products.links.length - 1];

    return (
        <ScrollArea className="h-full">
            <Head title="Catálogo de Productos" />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Catálogo de Productos
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Explora nuestra colección de productos
                        </p>
                    </div>

                    {/* Barra móvil */}
                    <div className="mb-6 flex flex-col gap-4 lg:hidden">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={localFilters.search || ''}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            search: e.target.value,
                                        })
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Buscar</Button>
                        </form>
                        <Sheet
                            open={isFilterOpen}
                            onOpenChange={setIsFilterOpen}
                        >
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filtros
                                    {hasActiveFilters && (
                                        <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                            !
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[90vh]">
                                <SheetHeader>
                                    <SheetTitle>Filtros</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 space-y-6">
                                    <MobileFilters
                                        categories={categories}
                                        brands={brands}
                                        priceRange={priceRange}
                                        localFilters={localFilters}
                                        setLocalFilters={setLocalFilters}
                                        priceValue={priceValue}
                                        setPriceValue={setPriceValue}
                                        applyFilters={applyFilters}
                                        clearFilters={clearFilters}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Layout principal */}
                    <div className="flex gap-8">
                        {/* Sidebar Desktop */}
                        <div className="hidden w-72 shrink-0 lg:block">
                            <div className="sticky top-8 space-y-6">
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold">
                                        Buscador
                                    </h3>
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex gap-2"
                                    >
                                        <div className="relative flex-1">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Buscar productos..."
                                                value={
                                                    localFilters.search || ''
                                                }
                                                onChange={(e) =>
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        search: e.target.value,
                                                    })
                                                }
                                                className="pl-9"
                                            />
                                        </div>
                                        <Button type="submit" size="sm">
                                            Buscar
                                        </Button>
                                    </form>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold">
                                        Categorías
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() =>
                                                setLocalFilters({
                                                    ...localFilters,
                                                    category: null,
                                                })
                                            }
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${!localFilters.category ? 'bg-primary font-medium text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            Todas las categorías
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() =>
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        category:
                                                            category.id.toString(),
                                                    })
                                                }
                                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${localFilters.category === category.id.toString() ? 'bg-primary font-medium text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold">
                                        Marcas
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() =>
                                                setLocalFilters({
                                                    ...localFilters,
                                                    brand: null,
                                                })
                                            }
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${!localFilters.brand ? 'bg-primary font-medium text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            Todas las marcas
                                        </button>
                                        {brands.map((brand) => (
                                            <button
                                                key={brand.id}
                                                onClick={() =>
                                                    setLocalFilters({
                                                        ...localFilters,
                                                        brand: brand.id.toString(),
                                                    })
                                                }
                                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${localFilters.brand === brand.id.toString() ? 'bg-primary font-medium text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                {brand.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-3 text-sm font-semibold">
                                        Rango de precio
                                    </h3>
                                    <div className="space-y-4">
                                        <Slider
                                            min={priceRange.min}
                                            max={priceRange.max}
                                            step={1}
                                            value={priceValue}
                                            onValueChange={(v) =>
                                                setPriceValue(
                                                    v as [number, number],
                                                )
                                            }
                                            className="mt-6"
                                        />
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span>
                                                {formatCurrency(priceValue[0])}
                                            </span>
                                            <span className="font-normal text-muted-foreground">
                                                -
                                            </span>
                                            <span>
                                                {formatCurrency(priceValue[1])}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Button
                                        onClick={applyFilters}
                                        className="w-full shadow-sm"
                                    >
                                        Aplicar filtros
                                    </Button>

                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            onClick={clearFilters}
                                            className="w-full gap-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="size-4" />
                                            Limpiar filtros
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="flex-1">
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando{' '}
                                    <span className="font-bold text-foreground">
                                        {products.from ?? 0}–{products.to ?? 0}
                                    </span>{' '}
                                    de{' '}
                                    <span className="font-bold text-foreground">
                                        {products.total}
                                    </span>{' '}
                                    productos
                                </p>
                                <Select
                                    value={localFilters.sort}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="w-[200px] bg-background">
                                        <SelectValue placeholder="Ordenar por" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">
                                            Más recientes
                                        </SelectItem>
                                        <SelectItem value="price_asc">
                                            Precio: menor a mayor
                                        </SelectItem>
                                        <SelectItem value="price_desc">
                                            Precio: mayor a menor
                                        </SelectItem>
                                        <SelectItem value="name_asc">
                                            Nombre: A-Z
                                        </SelectItem>
                                        <SelectItem value="name_desc">
                                            Nombre: Z-A
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {isLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(6)].map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : products.data.length === 0 ? (
                                <div className="flex animate-in flex-col items-center justify-center py-24 text-center duration-500 fade-in zoom-in">
                                    <div className="rounded-full bg-muted/50 p-6">
                                        <Package className="h-12 w-12 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">
                                        No se encontraron productos
                                    </h3>
                                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                                        Prueba con otros términos de búsqueda o
                                        ajusta los filtros.
                                    </p>
                                    <Button
                                        onClick={clearFilters}
                                        className="mt-8"
                                        variant="outline"
                                    >
                                        Ver todo el catálogo
                                    </Button>
                                </div>
                            ) : (
                                <div className="animate-in duration-700 ease-out fill-mode-both fade-in slide-in-from-bottom-4">
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {products.data.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={{
                                                    ...product,
                                                    imageUrl:
                                                        product.imageUrl ??
                                                        undefined,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Paginación */}
                                    {products.links.length > 3 && (
                                        <div className="mt-12 flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={!prevLink.url}
                                                asChild={!!prevLink.url}
                                                className="size-10"
                                            >
                                                {prevLink.url ? (
                                                    <a href={prevLink.url}>
                                                        <ChevronLeft className="size-4" />
                                                    </a>
                                                ) : (
                                                    <ChevronLeft className="size-4" />
                                                )}
                                            </Button>

                                            <div className="flex items-center gap-1.5">
                                                {paginationLinks.map(
                                                    (link, i) => (
                                                        <Button
                                                            key={i}
                                                            variant={
                                                                link.active
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            size="sm"
                                                            disabled={!link.url}
                                                            asChild={
                                                                !!link.url &&
                                                                !link.active
                                                            }
                                                            className="h-10 min-w-10"
                                                        >
                                                            {link.url &&
                                                            !link.active ? (
                                                                <a
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            )}
                                                        </Button>
                                                    ),
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={!nextLink.url}
                                                asChild={!!nextLink.url}
                                                className="size-10"
                                            >
                                                {nextLink.url ? (
                                                    <a href={nextLink.url}>
                                                        <ChevronRight className="size-4" />
                                                    </a>
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

function MobileFilters({
    categories,
    brands,
    priceRange,
    localFilters,
    setLocalFilters,
    priceValue,
    setPriceValue,
    applyFilters,
    clearFilters,
}: any) {
    return (
        <div className="space-y-8 pb-8">
            <div>
                <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                    Categorías
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() =>
                            setLocalFilters({ ...localFilters, category: null })
                        }
                        className={`rounded-lg border px-3 py-3 text-center text-sm transition-all ${!localFilters.category ? 'border-primary bg-primary font-medium text-primary-foreground' : 'border-input bg-background hover:bg-muted'}`}
                    >
                        Todas
                    </button>
                    {categories.map((category: Category) => (
                        <button
                            key={category.id}
                            onClick={() =>
                                setLocalFilters({
                                    ...localFilters,
                                    category: category.id.toString(),
                                })
                            }
                            className={`rounded-lg border px-3 py-3 text-center text-sm transition-all ${localFilters.category === category.id.toString() ? 'border-primary bg-primary font-medium text-primary-foreground' : 'border-input bg-background hover:bg-muted'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                    Marcas
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() =>
                            setLocalFilters({ ...localFilters, brand: null })
                        }
                        className={`rounded-lg border px-3 py-3 text-center text-sm transition-all ${!localFilters.brand ? 'border-primary bg-primary font-medium text-primary-foreground' : 'border-input bg-background hover:bg-muted'}`}
                    >
                        Todas
                    </button>
                    {brands.map((brand: Brand) => (
                        <button
                            key={brand.id}
                            onClick={() =>
                                setLocalFilters({
                                    ...localFilters,
                                    brand: brand.id.toString(),
                                })
                            }
                            className={`rounded-lg border px-3 py-3 text-center text-sm transition-all ${localFilters.brand === brand.id.toString() ? 'border-primary bg-primary font-medium text-primary-foreground' : 'border-input bg-background hover:bg-muted'}`}
                        >
                            {brand.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                    Precio
                </h3>
                <div className="space-y-6 px-2">
                    <Slider
                        min={priceRange.min}
                        max={priceRange.max}
                        step={1}
                        value={priceValue}
                        onValueChange={setPriceValue}
                    />
                    <div className="flex items-center justify-between text-base font-bold">
                        <span>{formatCurrency(priceValue[0])}</span>
                        <span className="font-normal text-muted-foreground">
                            -
                        </span>
                        <span>{formatCurrency(priceValue[1])}</span>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 mt-auto flex gap-3 border-t bg-background pt-6">
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="h-12 flex-1"
                >
                    Limpiar
                </Button>
                <Button
                    onClick={applyFilters}
                    className="h-12 flex-1 shadow-lg"
                >
                    Aplicar filtros
                </Button>
            </div>
        </div>
    );
}
