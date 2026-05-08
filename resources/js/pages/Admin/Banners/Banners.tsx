import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Eye,
    EyeOff,
    ExternalLink,
    Image as ImageIcon,
    Loader2,
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import admin from '@/routes/admin';

interface Banner {
    id: number;
    title: string;
    image_url: string;
    link: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    banners: Banner[];
}

export default function Banners({ banners }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filtered = banners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const activeBanners = banners.filter((b) => b.is_active).length;

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        router.post(admin.banners.store(), formData, {
            onSuccess: () => {
                setIsCreateOpen(false);
                toast.success('Banner creado exitosamente');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error('Error al crear el banner');
                setIsSubmitting(false);
            },
        });
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Capturar el id antes de cualquier async
        if (!editingBanner) {
            return;
        }

        const id = editingBanner.id;

        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append('_method', 'PUT');

        router.post(admin.banners.update(id), formData, {
            // usar id, no editingBanner.id
            onSuccess: () => {
                setEditingBanner(null);
                toast.success('Banner actualizado exitosamente');
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error('Error al actualizar el banner');
                setIsSubmitting(false);
            },
        });
    };

    const handleDelete = () => {
        if (!deletingBanner) {
            return;
        }

        const id = deletingBanner.id;

        router.delete(admin.banners.destroy(id), {
            onSuccess: () => {
                setDeletingBanner(null);
                toast.success('Banner eliminado exitosamente');
            },
            onError: () => {
                toast.error('Error al eliminar el banner');
            },
        });
    };

    const toggleStatus = (banner: Banner) => {
        router.put(
            admin.banners.toggleStatus(banner.id),
            {},
            {
                onSuccess: () => {
                    toast.success(
                        `Banner ${banner.is_active ? 'desactivado' : 'activado'} exitosamente`,
                    );
                },
                onError: () => {
                    toast.error('Error al cambiar el estado');
                },
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Banners
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona los banners promocionales de tu tienda
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Banner
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Banners
                        </CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {banners.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Banners registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Banners Activos
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {activeBanners}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Mostrando en la tienda
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex flex-1">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar banner por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[120px]">Imagen</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="w-[100px] text-center">
                                Estado
                            </TableHead>
                            <TableHead className="w-[100px] text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <ImageIcon className="mb-2 h-8 w-8" />
                                        <p>No se encontraron banners</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((banner) => (
                                <TableRow
                                    key={banner.id}
                                    className="hover:bg-gray-50"
                                >
                                    <TableCell>
                                        <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-gray-100">
                                            {banner.image_url ? (
                                                <img
                                                    src={banner.image_url}
                                                    alt={banner.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {banner.title}
                                    </TableCell>
                                    <TableCell>
                                        {banner.link ? (
                                            <a
                                                href={banner.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                            >
                                                {banner.link.length > 40
                                                    ? `${banner.link.substring(0, 40)}...`
                                                    : banner.link}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-400">
                                                Sin link
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                banner.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className={
                                                banner.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }
                                        >
                                            {banner.is_active
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    toggleStatus(banner)
                                                }
                                                className="h-8 w-8"
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setEditingBanner(banner)
                                                }
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingBanner(banner)
                                                }
                                                className="h-8 w-8 text-red-600 hover:bg-red-50"
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

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Banner</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Título <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                placeholder="Ej: Promoción de verano"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image_url">
                                URL de la Imagen{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                type="url"
                                required
                                placeholder="https://ejemplo.com/banner.jpg"
                                onChange={(e) =>
                                    setPreviewImage(e.target.value)
                                }
                            />
                            {previewImage && (
                                <div className="mt-2 rounded-lg border p-2">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="h-32 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link">Link (opcional)</Label>
                            <Input
                                id="link"
                                name="link"
                                type="url"
                                placeholder="https://ejemplo.com/producto"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active">Activo</Label>
                            <Switch
                                id="is_active"
                                name="is_active"
                                defaultChecked
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Banner'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog
                open={!!editingBanner}
                onOpenChange={() => setEditingBanner(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Editar Banner</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">
                                Título <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-title"
                                name="title"
                                defaultValue={editingBanner?.title}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-image_url">
                                URL de la Imagen{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="edit-image_url"
                                name="image_url"
                                type="url"
                                defaultValue={editingBanner?.image_url}
                                required
                            />
                            {editingBanner?.image_url && (
                                <div className="mt-2 rounded-lg border p-2">
                                    <img
                                        src={editingBanner.image_url}
                                        alt={editingBanner.title}
                                        className="h-32 w-full rounded object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-link">Link (opcional)</Label>
                            <Input
                                id="edit-link"
                                name="link"
                                type="url"
                                defaultValue={editingBanner?.link || ''}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="edit-is_active">Activo</Label>
                            <Switch
                                id="edit-is_active"
                                name="is_active"
                                defaultChecked={editingBanner?.is_active}
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingBanner(null)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    'Actualizar Banner'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!deletingBanner}
                onOpenChange={() => setDeletingBanner(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Banner?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de eliminar el banner "
                            {deletingBanner?.title}"? Esta acción no se puede
                            deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
