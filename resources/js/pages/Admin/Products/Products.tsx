import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    CheckCircle,
    XCircle,
    Package,
    Star,
    StarOff,
    Filter,
    Image as ImageIcon,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import admin from '@/routes/admin';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: number;
    category?: { id: number; name: string };
    brand_id?: number;
    brand?: { id: number; name: string };
    supplier_id?: number;
    supplier?: { id: number; name: string };
    thumbnail: string | null;
    gallery: string[] | null;
    is_active: boolean;
    is_featured: boolean;
    variants?: Variant[];
}

interface Variant {
    id: number;
    type: string;
    value: string;
    price_adjustment: number;
    stock: number;
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface PaginatedProducts {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

export default function Products({
    products,
    categories,
    brands,
    suppliers,
}: {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreate, setShowCreate] = useState(false);

    const filtered = products.data.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
            categoryFilter === 'all' ||
            p.category_id === Number(categoryFilter);
        const matchBrand =
            brandFilter === 'all' || p.brand_id === Number(brandFilter);
        const matchStock =
            stockFilter === 'all' ||
            (stockFilter === 'low' && p.stock > 0 && p.stock <= 10) ||
            (stockFilter === 'out' && p.stock === 0) ||
            (stockFilter === 'in' && p.stock > 10);
        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && p.is_active) ||
            (statusFilter === 'inactive' && !p.is_active);

        return (
            matchSearch &&
            matchCategory &&
            matchBrand &&
            matchStock &&
            matchStatus
        );
    });

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return <Badge variant="destructive">Sin stock</Badge>;
        }

        if (stock <= 10) {
            return <Badge variant="destructive">Stock bajo ({stock})</Badge>;
        }

        return <Badge variant="default">En stock ({stock})</Badge>;
    };

    return (
        <TooltipProvider>
            <div className="container mx-auto space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Productos
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestiona todos los productos de tu tienda
                        </p>
                    </div>
                    <Link href={'/admin/products/create'}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Crear producto
                        </Button>
                    </Link>
                </div>

                {/* Filtros avanzados */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Filter className="h-5 w-5" /> Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todas las categorías
                                    </SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={brandFilter}
                                onValueChange={setBrandFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todas las marcas
                                    </SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem
                                            key={brand.id}
                                            value={brand.id.toString()}
                                        >
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={stockFilter}
                                onValueChange={setStockFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Stock" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todo el stock
                                    </SelectItem>
                                    <SelectItem value="in">
                                        Stock alto (&gt;10)
                                    </SelectItem>
                                    <SelectItem value="low">
                                        Stock bajo (1-10)
                                    </SelectItem>
                                    <SelectItem value="out">
                                        Sin stock
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="active">
                                        Activos
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactivos
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de productos */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">
                                        Imagen
                                    </TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Destacado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Avatar className="h-12 w-12 rounded-lg">
                                                {product.thumbnail ? (
                                                    <AvatarImage
                                                        src={
                                                            '/storage/' +
                                                            product.thumbnail
                                                        }
                                                        alt={product.name}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <AvatarFallback className="rounded-lg">
                                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-2 py-1 text-xs">
                                                {product.sku}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {product.category?.name ||
                                                    'Sin categoría'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getStockBadge(product.stock)}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.put(
                                                                `/admin/products/${product.id}/toggle-status`,
                                                            )
                                                        }
                                                        className="h-auto p-0"
                                                    >
                                                        {product.is_active ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                                                <CheckCircle className="mr-1 h-3 w-3" />{' '}
                                                                Activo
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-red-100 text-red-700"
                                                            >
                                                                <XCircle className="mr-1 h-3 w-3" />{' '}
                                                                Inactivo
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Click para cambiar
                                                        estado
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.put(
                                                                `/admin/products/${product.id}/toggle-featured`,
                                                            )
                                                        }
                                                        className="h-auto p-0"
                                                    >
                                                        {product.is_featured ? (
                                                            <Badge className="bg-yellow-100 text-yellow-700">
                                                                <Star className="mr-1 h-3 w-3" />{' '}
                                                                Destacado
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                <StarOff className="mr-1 h-3 w-3" />{' '}
                                                                No destacado
                                                            </Badge>
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Marcar como destacado</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        Acciones
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link
                                                        href={admin.products.edit(
                                                            product.id,
                                                        )}
                                                    >
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />{' '}
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </Link>

                                                    <Link
                                                        href={admin.products.destroy(
                                                            product.id,
                                                        )}
                                                    >
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </Link>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filtered.length === 0 && (
                            <Alert className="m-6">
                                <Package className="h-4 w-4" />
                                <AlertDescription className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-semibold">
                                        No hay productos
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Comienza creando tu primer producto
                                    </p>
                                    <Button onClick={() => setShowCreate(true)}>
                                        <Plus className="mr-2 h-4 w-4" /> Crear
                                        producto
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Paginación */}
                        {products.links.length > 3 && (
                            <div className="flex items-center justify-between border-t px-6 py-4">
                                <span className="text-sm text-muted-foreground">
                                    Mostrando {products.from}-{products.to} de{' '}
                                    {products.total}
                                </span>
                                <div className="flex gap-2">
                                    {products.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            asChild
                                            disabled={!link.url}
                                        >
                                            <Link
                                                href={link.url ?? '#'}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                className={
                                                    !link.url
                                                        ? 'pointer-events-none'
                                                        : ''
                                                }
                                            />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
