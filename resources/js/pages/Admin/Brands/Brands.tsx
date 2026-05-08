import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Package, Building2 } from 'lucide-react';
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import DeleteModal from './DeleteModal';
import CreateModal from './CreateModal';
import EditModal from './EditModal';

interface Brand {
    id: number;
    name: string;
    logo: string | null;
    products_count: number;
}

interface Props {
    brands: Brand[];
}

export default function Brands({ brands }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);

    const filtered = brands.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const totalProducts = brands.reduce(
        (sum, brand) => sum + (brand.products_count || 0),
        0,
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Marcas
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestiona las marcas de tu tienda
                    </p>
                </div>
                <Button onClick={() => setShowCreate(true)} className="gap-2">
                    <Plus size={18} /> Nueva marca
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Marcas
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {brands.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Productos
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalProducts}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <div className="flex flex-1">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-25">Logo</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-center">
                                Cantidad de Productos
                            </TableHead>
                            <TableHead className="w-25 text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No se encontraron marcas
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={
                                                    '/storage/' + brand.logo ||
                                                    undefined
                                                }
                                                alt={brand.name}
                                            />
                                            <AvatarFallback>
                                                {brand.name
                                                    .split(' ')
                                                    .map((word) => word[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {brand.name}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <Package className="h-3 w-3" />
                                            {brand.products_count || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setEditBrand(brand)
                                                }
                                                className="h-8 w-8"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeleteBrand(brand)
                                                }
                                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modales */}
            {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
            {editBrand && (
                <EditModal
                    brand={editBrand}
                    onClose={() => setEditBrand(null)}
                />
            )}
            {deleteBrand && (
                <DeleteModal
                    brand={deleteBrand}
                    onClose={() => setDeleteBrand(null)}
                />
            )}
        </div>
    );
}
