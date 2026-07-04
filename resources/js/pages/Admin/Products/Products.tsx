import { router, Link } from '@inertiajs/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Check,
    X,
    ImageIcon,
    Tags,
    MoreVertical,
    Package,
    Grid3x3,
    List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { MobileDataCard } from '@/Components/ui/mobile-data-card';
import { Separator } from '@/components/ui/separator';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useState, useMemo } from 'react';
import admin from '@/routes/admin';

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
    stock: number;
    thumbnail: string | null;
    is_active: boolean;
    is_featured: boolean;
    category: Category | null;
    brand: Brand | null;
    images_count: number;
    variants_count: number;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface ProductsProps {
    products: PaginatedData<Product>;
    categories: Category[];
    brands: Brand[];
}

// Debe coincidir con el umbral usado en Admin/DashboardController para "Productos con bajo stock".
const LOW_STOCK_THRESHOLD = 10;

export default function Products({ products }: ProductsProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isGridView, setIsGridView] = useState(false);

    // Filtrar productos por búsqueda (solo en la página actual)
    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) {
            return products.data;
        }

        return products.data.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [products.data, searchTerm]);

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(admin.products.destroy(id));
        }
    };

    const toggleStatus = (id: number) => {
        router.put(admin.products.toggleStatus(id));
    };

    const toggleFeatured = (id: number) => {
        router.put(admin.products.toggleFeatured(id));
    };

    const handlePageChange = (page: number) => {
        if (page !== products.current_page) {
            router.get(admin.products.index(), { page });
        }
    };

    // Generar números de página para la paginación
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const currentPage = products.current_page;
        const lastPage = products.last_page;

        if (lastPage <= maxVisible) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }

                pages.push(-1); // Ellipsis
                pages.push(lastPage);
            } else if (currentPage >= lastPage - 2) {
                pages.push(1);
                pages.push(-1);

                for (let i = lastPage - 3; i <= lastPage; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push(-1);

                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }

                pages.push(-1);

                pages.push(lastPage);
            }
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Productos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona el catálogo de productos de tu tienda
                        </p>
                    </div>
                    <Link href={admin.products.create()}>
                        <Button size="default" className="gap-2 shadow-sm">
                            <Plus className="h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                {/* Filters & Search */}
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 md:max-w-md">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center rounded-md border">
                                    <Button
                                        variant={
                                            !isGridView ? 'secondary' : 'ghost'
                                        }
                                        size="sm"
                                        className="rounded-r-none px-3"
                                        onClick={() => setIsGridView(false)}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            isGridView ? 'secondary' : 'ghost'
                                        }
                                        size="sm"
                                        className="rounded-l-none px-3"
                                        onClick={() => setIsGridView(true)}
                                    >
                                        <Grid3x3 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-6"
                                />
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1 text-xs font-medium"
                                >
                                    Total: {products.total}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid/Table */}
                {!isGridView ? (
                    // Vista de Tabla
                    <>
                    <Card className="hidden overflow-hidden border shadow-sm lg:block">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-b">
                                        <TableHead className="w-[72px]">
                                            Imagen
                                        </TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="w-[80px] text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                className="border-b transition-colors hover:bg-muted/30"
                                            >
                                                <TableCell>
                                                    <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted/50">
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={`/storage/${product.thumbnail}`}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1.5">
                                                        <span className="font-medium text-foreground">
                                                            {product.name}
                                                        </span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <Badge
                                                                variant="outline"
                                                                className="h-5 gap-1 px-1.5 text-[10px] font-normal"
                                                            >
                                                                <ImageIcon className="h-2.5 w-2.5" />
                                                                {
                                                                    product.images_count
                                                                }
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="h-5 gap-1 px-1.5 text-[10px] font-normal"
                                                            >
                                                                <Tags className="h-2.5 w-2.5" />
                                                                {
                                                                    product.variants_count
                                                                }
                                                            </Badge>
                                                            {product.is_featured && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="h-5 px-1.5 text-[10px] font-medium"
                                                                >
                                                                    Destacado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {product.category
                                                            ?.name ||
                                                            'Sin categoría'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold">
                                                        S/{' '}
                                                        {product.price.toFixed(
                                                            2,
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-0.5">
                                                        <span
                                                            className={
                                                                product.stock <
                                                                LOW_STOCK_THRESHOLD
                                                                    ? 'font-semibold text-destructive'
                                                                    : ''
                                                            }
                                                        >
                                                            {product.stock}{' '}
                                                            unid.
                                                        </span>
                                                        {product.stock <
                                                            LOW_STOCK_THRESHOLD &&
                                                            product.stock >
                                                                0 && (
                                                                <p className="text-[10px] font-medium text-destructive">
                                                                    Stock bajo
                                                                </p>
                                                            )}
                                                        {product.stock ===
                                                            0 && (
                                                            <p className="text-[10px] font-medium text-muted-foreground">
                                                                Agotado
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-7 rounded-full px-2.5 text-xs font-medium ${
                                                            product.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                        }`}
                                                        onClick={() =>
                                                            toggleStatus(
                                                                product.id,
                                                            )
                                                        }
                                                    >
                                                        {product.is_active ? (
                                                            <>
                                                                <Check className="mr-1 h-3 w-3" />
                                                                Activo
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X className="mr-1 h-3 w-3" />
                                                                Inactivo
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-36"
                                                        >
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={admin.products.edit(
                                                                        product.id,
                                                                    )}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    toggleFeatured(
                                                                        product.id,
                                                                    )
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                <Tags className="mr-2 h-4 w-4" />
                                                                {product.is_featured
                                                                    ? 'Quitar Destacado'
                                                                    : 'Destacar'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-64 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="rounded-full bg-muted/50 p-4">
                                                        <Package className="h-10 w-10 text-muted-foreground/40" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            {searchTerm
                                                                ? 'No se encontraron productos'
                                                                : 'No hay productos aún'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground/70">
                                                            {searchTerm
                                                                ? 'Intenta con otros términos de búsqueda'
                                                                : 'Comienza creando tu primer producto'}
                                                        </p>
                                                    </div>
                                                    {!searchTerm && (
                                                        <Link
                                                            href={admin.products.create()}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="mt-2 gap-2"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                Crear producto
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Cards (mobile) — misma info que la tabla, en filas etiqueta/valor */}
                    <div className="grid gap-3 lg:hidden">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <MobileDataCard
                                    key={product.id}
                                    header={
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted/50">
                                                {product.thumbnail ? (
                                                    <img
                                                        src={`/storage/${product.thumbnail}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <p className="truncate font-medium text-foreground">
                                                    {product.name}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 gap-1 px-1.5 text-[10px] font-normal"
                                                    >
                                                        <ImageIcon className="h-2.5 w-2.5" />
                                                        {product.images_count}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 gap-1 px-1.5 text-[10px] font-normal"
                                                    >
                                                        <Tags className="h-2.5 w-2.5" />
                                                        {
                                                            product.variants_count
                                                        }
                                                    </Badge>
                                                    {product.is_featured && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="h-5 px-1.5 text-[10px] font-medium"
                                                        >
                                                            Destacado
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    rows={[
                                        {
                                            label: 'Categoría',
                                            value: (
                                                <Badge
                                                    variant="secondary"
                                                    className="font-normal"
                                                >
                                                    {product.category?.name ||
                                                        'Sin categoría'}
                                                </Badge>
                                            ),
                                        },
                                        {
                                            label: 'Precio',
                                            value: (
                                                <span className="font-semibold">
                                                    S/ {product.price.toFixed(2)}
                                                </span>
                                            ),
                                        },
                                        {
                                            label: 'Stock',
                                            value: (
                                                <div className="space-y-0.5">
                                                    <span
                                                        className={
                                                            product.stock <
                                                            LOW_STOCK_THRESHOLD
                                                                ? 'font-semibold text-destructive'
                                                                : ''
                                                        }
                                                    >
                                                        {product.stock} unid.
                                                    </span>
                                                    {product.stock <
                                                        LOW_STOCK_THRESHOLD &&
                                                        product.stock > 0 && (
                                                            <p className="text-[10px] font-medium text-destructive">
                                                                Stock bajo
                                                            </p>
                                                        )}
                                                    {product.stock === 0 && (
                                                        <p className="text-[10px] font-medium text-muted-foreground">
                                                            Agotado
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Estado',
                                            value: (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-7 rounded-full px-2.5 text-xs font-medium ${
                                                        product.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                    }`}
                                                    onClick={() =>
                                                        toggleStatus(
                                                            product.id,
                                                        )
                                                    }
                                                >
                                                    {product.is_active ? (
                                                        <>
                                                            <Check className="mr-1 h-3 w-3" />
                                                            Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="mr-1 h-3 w-3" />
                                                            Inactivo
                                                        </>
                                                    )}
                                                </Button>
                                            ),
                                        },
                                    ]}
                                    footer={
                                        <div className="flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 gap-1.5 px-2.5 text-xs"
                                                    >
                                                        <MoreVertical className="h-3.5 w-3.5" />
                                                        Acciones
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-36"
                                                >
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={admin.products.edit(
                                                                product.id,
                                                            )}
                                                            className="cursor-pointer"
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            toggleFeatured(
                                                                product.id,
                                                            )
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <Tags className="mr-2 h-4 w-4" />
                                                        {product.is_featured
                                                            ? 'Quitar Destacado'
                                                            : 'Destacar'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    }
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-white py-16 shadow-sm">
                                <div className="rounded-full bg-muted/50 p-4">
                                    <Package className="h-10 w-10 text-muted-foreground/40" />
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {searchTerm
                                            ? 'No se encontraron productos'
                                            : 'No hay productos aún'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                        {searchTerm
                                            ? 'Intenta con otros términos de búsqueda'
                                            : 'Comienza creando tu primer producto'}
                                    </p>
                                </div>
                                {!searchTerm && (
                                    <Link href={admin.products.create()}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 gap-2"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Crear producto
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    </>
                ) : (
                    // Vista de Cuadrícula
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden border shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-muted/30">
                                        {product.thumbnail ? (
                                            <img
                                                src={`/storage/${product.thumbnail}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <div className="rounded-full bg-muted/50 p-6">
                                                    <Package className="h-12 w-12 text-muted-foreground/30" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            {product.is_featured && (
                                                <Badge
                                                    variant="secondary"
                                                    className="shadow-sm"
                                                >
                                                    Destacado
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    asChild
                                                    className="h-8 gap-1"
                                                >
                                                    <Link
                                                        href={admin.products.edit(
                                                            product.id,
                                                        )}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        product.is_active
                                                            ? 'destructive'
                                                            : 'default'
                                                    }
                                                    className="h-8"
                                                    onClick={() =>
                                                        toggleStatus(product.id)
                                                    }
                                                >
                                                    {product.is_active
                                                        ? 'Desactivar'
                                                        : 'Activar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="line-clamp-1 flex-1 font-medium">
                                                    {product.name}
                                                </h3>
                                                <span className="font-semibold">
                                                    S/{' '}
                                                    {product.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-normal"
                                                >
                                                    {product.category?.name ||
                                                        'Sin categoría'}
                                                </Badge>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 text-xs font-normal"
                                                    >
                                                        <ImageIcon className="h-3 w-3" />
                                                        {product.images_count}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 text-xs font-normal"
                                                    >
                                                        <Tags className="h-3 w-3" />
                                                        {product.variants_count}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Stock:
                                                    </span>
                                                    <span
                                                        className={
                                                            product.stock <
                                                            LOW_STOCK_THRESHOLD
                                                                ? 'font-semibold text-destructive'
                                                                : 'font-medium'
                                                        }
                                                    >
                                                        {product.stock} unidades
                                                    </span>
                                                </div>
                                                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-foreground/20 transition-all"
                                                        style={{
                                                            width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full flex h-64 items-center justify-center">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="rounded-full bg-muted/50 p-4">
                                        <Package className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {searchTerm
                                                ? 'No se encontraron productos'
                                                : 'No hay productos aún'}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            {searchTerm
                                                ? 'Intenta con otros términos de búsqueda'
                                                : 'Comienza creando tu primer producto'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Paginación */}
                {products.last_page > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (products.current_page > 1) {
                                            handlePageChange(
                                                products.current_page - 1,
                                            );
                                        }
                                    }}
                                    className={
                                        products.current_page === 1
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) =>
                                page === -1 ? (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page);
                                            }}
                                            isActive={
                                                page === products.current_page
                                            }
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                            products.current_page <
                                            products.last_page
                                        ) {
                                            handlePageChange(
                                                products.current_page + 1,
                                            );
                                        }
                                    }}
                                    className={
                                        products.current_page ===
                                        products.last_page
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}

                {/* Info de paginación */}
                {products.total > 0 && (
                    <div className="text-center text-xs text-muted-foreground">
                        Mostrando {products.from || 0} - {products.to || 0} de{' '}
                        {products.total} productos
                    </div>
                )}
            </div>
        </div>
    );
}
