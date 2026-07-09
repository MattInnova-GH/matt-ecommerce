import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Package,
    ChevronRight,
    ShoppingCart,
    Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    thumbnail: string | null;
    is_featured: boolean;
    category: { name: string } | null;
}

interface PaginatedProducts {
    data: ProductItem[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

interface CategoryProductsProps {
    category: CategoryItem;
    products: PaginatedProducts;
    subcategories: [];
}

export default function CategoryProducts({
    category,
    products,
}: CategoryProductsProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href="/categorias"
                        className="transition-colors hover:text-foreground"
                    >
                        Categorías
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                        {category.name}
                    </span>
                </nav>

                {/* Header con imagen de categoría */}
                {category.image ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-white">
                        <img
                            src={`/storage/${category.image}`}
                            alt={category.name}
                            className="h-full w-full object-contain p-6"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-6">
                            <h1 className="text-3xl font-bold text-white">
                                {category.name}
                            </h1>
                            <p className="mt-1 text-sm text-white/80">
                                {products.data.length} productos encontrados
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {category.name}
                        </h1>
                        <p className="text-base text-muted-foreground">
                            {products.data.length} productos encontrados
                        </p>
                    </div>
                )}

                {/* Buscador */}
                <div className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar producto..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grid de productos */}
                {filteredProducts.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden border shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="relative h-48 overflow-hidden bg-white">
                                        {product.thumbnail ? (
                                            <img
                                                src={`/storage/${product.thumbnail}`}
                                                alt={product.name}
                                                className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-16 w-16 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {product.is_featured && (
                                            <div className="absolute top-2 left-2">
                                                <Badge className="gap-1 bg-yellow-500 text-white hover:bg-yellow-600">
                                                    <Star className="h-3 w-3 fill-white" />
                                                    Destacado
                                                </Badge>
                                            </div>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <Badge variant="destructive">
                                                    Sin stock
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="space-y-3 p-4">
                                        <div>
                                            <h3 className="line-clamp-2 leading-tight font-semibold">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">
                                                S/ {product.price.toFixed(2)}
                                            </span>
                                            {product.stock > 0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    Stock: {product.stock}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={`/productos/${product.slug}`}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full gap-2"
                                                disabled={product.stock === 0}
                                            >
                                                <ShoppingCart className="h-3 w-3" />
                                                Ver producto
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Paginación */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                {products.prev_page_url && (
                                    <Link href={products.prev_page_url}>
                                        <Button variant="outline" size="sm">
                                            Anterior
                                        </Button>
                                    </Link>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Página {products.current_page} de{' '}
                                    {products.last_page}
                                </span>
                                {products.next_page_url && (
                                    <Link href={products.next_page_url}>
                                        <Button variant="outline" size="sm">
                                            Siguiente
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border bg-muted/30">
                        <Package className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-center text-muted-foreground">
                            {searchTerm
                                ? 'No se encontraron productos con ese nombre'
                                : 'No hay productos en esta categoría'}
                        </p>
                        <Link href="/categorias">
                            <Button variant="outline" size="sm">
                                Volver a categorías
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
