import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Search,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Star,
    Trash2,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreateBannerModal } from './CreateBannerModal';
import { EditBannerModal } from './EditBannerModal';
import { DeleteBannerModal } from './DeleteBannerModal';
import admin from '@/routes/admin';

interface Banner {
    id: number;
    image_path: string;
    image_url: string;
    is_active: boolean;
    order: number;
    type: 'main' | 'promotional';
}

interface Props {
    banners: Banner[];
}

const TYPE_LABELS: Record<string, string> = {
    main: 'Principal',
    promotional: 'Promocional',
};

const TYPE_COLORS: Record<string, string> = {
    main: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200',
    promotional: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
};

export default function Banners({ banners: initialBanners }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

    const banners = initialBanners.sort((a, b) => a.order - b.order);

    const filtered = banners.filter((b) =>
        b.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const activeBanners = banners.filter((b) => b.is_active).length;
    const canAdd = banners.length < 5;
    const canDelete = banners.length > 2;

    const moveUp = (banner: Banner) => {
        if (banner.order <= 1) {
            return;
        }

        const prevBanner = banners.find((b) => b.order === banner.order - 1);

        if (prevBanner) {
            router.post(
                admin.banners.reorder(),
                {
                    orders: [
                        { id: prevBanner.id, order: banner.order },
                        { id: banner.id, order: banner.order - 1 },
                    ],
                },
                {
                    onSuccess: () => router.reload(),
                    onError: () => toast.error('Error al reordenar'),
                },
            );
        }
    };

    const moveDown = (banner: Banner) => {
        if (banner.order >= banners.length) {
            return;
        }

        const nextBanner = banners.find((b) => b.order === banner.order + 1);

        if (nextBanner) {
            router.post(
                admin.banners.reorder(),
                {
                    orders: [
                        { id: banner.id, order: banner.order + 1 },
                        { id: nextBanner.id, order: banner.order },
                    ],
                },
                {
                    onSuccess: () => router.reload(),
                    onError: () => toast.error('Error al reordenar'),
                },
            );
        }
    };

    const handleToggleStatus = (banner: Banner) => {
        router.put(
            `/admin/banners/${banner.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    toast.success(
                        `Banner ${banner.is_active ? 'desactivado' : 'activado'} exitosamente`,
                    );
                    router.reload();
                },
                onError: () => {
                    toast.error('Error al cambiar el estado');
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-350 space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Banners
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Mínimo 2 · Máximo 5 banners · Imágenes horizontales
                            de gran tamaño
                        </p>
                    </div>
                    <CreateBannerModal banners={banners} canAdd={canAdd} />

                    {/* 
                  <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="gap-2 shadow-sm"
                        disabled={!canAdd}
                        title={!canAdd ? 'Límite de 5 banners alcanzado' : ''}
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Banner
                        <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">
                            {banners.length}/5
                        </span>
                    </Button>
                  */}
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Banners
                            </CardTitle>
                            <ImageIcon className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {banners.length}
                            </div>
                            <p className="text-xs text-gray-500">
                                de 5 permitidos
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Banners Activos
                            </CardTitle>
                            <Eye className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {activeBanners}
                            </div>
                            <p className="text-xs text-gray-500">
                                Mostrando en la tienda
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Banner Principal
                            </CardTitle>
                            <Star className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-gray-500">
                                Posición destacada
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar banner por tipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-gray-200 pl-10 shadow-sm"
                    />
                </div>

                {/* Table (desktop) */}
                <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200 bg-gray-50">
                                <TableHead className="w-20 text-center">
                                    Orden
                                </TableHead>
                                <TableHead className="w-45">Imagen</TableHead>
                                <TableHead className="w-30">Tipo</TableHead>
                                <TableHead className="w-25 text-center">
                                    Estado
                                </TableHead>
                                <TableHead className="w-40 text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-64 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <ImageIcon className="mb-2 h-12 w-12 opacity-50" />
                                            <p>No se encontraron banners</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((banner) => (
                                    <TableRow
                                        key={banner.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveUp(banner)
                                                    }
                                                    disabled={
                                                        banner.order === 1
                                                    }
                                                >
                                                    ↑
                                                </Button>
                                                <span className="w-8 text-sm font-medium text-gray-500">
                                                    #{banner.order}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveDown(banner)
                                                    }
                                                    disabled={
                                                        banner.order ===
                                                        banners.length
                                                    }
                                                >
                                                    ↓
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
                                                {banner.image_path ? (
                                                    <img
                                                        src={
                                                            '/storage/' +
                                                            banner.image_path
                                                        }
                                                        alt={banner.type}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    TYPE_COLORS[banner.type]
                                                }
                                            >
                                                {TYPE_LABELS[banner.type]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={
                                                    banner.is_active
                                                        ? 'border-green-200 bg-green-100 text-green-700'
                                                        : 'border-gray-200 bg-gray-100 text-gray-600'
                                                }
                                            >
                                                {banner.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            banner,
                                                        )
                                                    }
                                                    className="h-8 w-8 hover:bg-gray-100"
                                                    title={
                                                        banner.is_active
                                                            ? 'Desactivar'
                                                            : 'Activar'
                                                    }
                                                >
                                                    {banner.is_active ? (
                                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-green-600" />
                                                    )}
                                                </Button>
                                                <EditBannerModal
                                                    banner={banner}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeletingBanner(
                                                            banner,
                                                        )
                                                    }
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                    disabled={!canDelete}
                                                    title={
                                                        !canDelete
                                                            ? 'Mínimo 2 banners requeridos'
                                                            : ''
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Cards (mobile) */}
                <div className="grid gap-3 lg:hidden">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-500 shadow-sm">
                            <ImageIcon className="mb-2 h-12 w-12 opacity-50" />
                            <p>No se encontraron banners</p>
                        </div>
                    ) : (
                        filtered.map((banner) => (
                            <Card key={banner.id} className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            {banner.image_path ? (
                                                <img
                                                    src={
                                                        '/storage/' +
                                                        banner.image_path
                                                    }
                                                    alt={banner.type}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <Badge
                                                    className={
                                                        TYPE_COLORS[
                                                            banner.type
                                                        ]
                                                    }
                                                >
                                                    {TYPE_LABELS[banner.type]}
                                                </Badge>
                                                <Badge
                                                    className={
                                                        banner.is_active
                                                            ? 'border-green-200 bg-green-100 text-green-700'
                                                            : 'border-gray-200 bg-gray-100 text-gray-600'
                                                    }
                                                >
                                                    {banner.is_active
                                                        ? 'Activo'
                                                        : 'Inactivo'}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveUp(banner)
                                                    }
                                                    disabled={
                                                        banner.order === 1
                                                    }
                                                >
                                                    ↑
                                                </Button>
                                                <span className="text-sm font-medium text-gray-500">
                                                    #{banner.order}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveDown(banner)
                                                    }
                                                    disabled={
                                                        banner.order ===
                                                        banners.length
                                                    }
                                                >
                                                    ↓
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleToggleStatus(banner)
                                            }
                                            className="h-8 w-8 hover:bg-gray-100"
                                            title={
                                                banner.is_active
                                                    ? 'Desactivar'
                                                    : 'Activar'
                                            }
                                        >
                                            {banner.is_active ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-green-600" />
                                            )}
                                        </Button>
                                        <EditBannerModal banner={banner} />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDeletingBanner(banner)
                                            }
                                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                                            disabled={!canDelete}
                                            title={
                                                !canDelete
                                                    ? 'Mínimo 2 banners requeridos'
                                                    : ''
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Recomendaciones */}
                <Card className="border-0 bg-amber-50 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-lg text-amber-600">
                                ⚠️
                            </div>
                            <div>
                                <h4 className="font-medium text-amber-800">
                                    Recomendaciones para imágenes:
                                </h4>
                                <ul className="mt-1 space-y-1 text-sm text-amber-700">
                                    <li>
                                        • Formato horizontal (landscape) - ancho
                                        mayor que alto
                                    </li>
                                    <li>
                                        • Tamaño recomendado: 1920x600px o
                                        1200x400px
                                    </li>
                                    <li>
                                        • Formatos soportados: JPG, PNG, WebP
                                    </li>
                                    <li>• Peso máximo: 2MB por imagen</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DeleteBannerModal
                    banner={deletingBanner}
                    onClose={() => setDeletingBanner(null)}
                    canDelete={canDelete}
                />
            </div>
        </div>
    );
}
