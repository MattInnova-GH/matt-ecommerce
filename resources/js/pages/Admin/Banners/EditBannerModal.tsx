import { useState, useRef, useEffect } from 'react';
import { Form } from '@inertiajs/react';
import { Star, Upload, X, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import admin from '@/routes/admin';

interface Banner {
    id: number;
    image_path: string;
    order: number;
    type: 'main' | 'promotional';
}

interface EditBannerModalProps {
    banner: Banner | null;
}

export function EditBannerModal({ banner }: EditBannerModalProps) {
    const [open, setOpen] = useState(false);
    const [editPreviewImage, setEditPreviewImage] = useState<string | null>(
        null,
    );
    const [editType, setEditType] = useState<string>('promotional');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Actualizar el tipo cuando cambia el banner
    useEffect(() => {
        if (banner) {
            setEditType(banner.type);
        }
    }, [banner]);

    const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor selecciona una imagen válida');

                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('La imagen no debe superar los 2MB');

                return;
            }

            setEditImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setEditPreviewImage(null);
        setEditImageFile(null);

        if (banner) {
            setEditType(banner.type);
        }

        if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);

        if (!newOpen) {
            resetForm();
        } else if (banner) {
            // Al abrir, asegurar que el tipo esté actualizado
            setEditType(banner.type);
        }
    };

    if (!banner) {
        return null;
    }

    // Determinar qué imagen mostrar
    const hasNewImage = editPreviewImage !== null || editImageFile !== null;
    const currentImage = hasNewImage
        ? editPreviewImage || URL.createObjectURL(editImageFile!)
        : null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Banner</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles del banner. Los cambios se
                        aplicarán inmediatamente.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action={admin.banners.update(banner.id)}
                    method="post"
                    encType="multipart/form-data"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) {
                            // Cerrar el modal y resetear el formulario
                            setOpen(false);
                            resetForm();
                        }

                        return (
                            <>
                                <div className="space-y-5">
                                    <input
                                        type="hidden"
                                        name="_method"
                                        value="PUT"
                                    />

                                    {/* Tipo */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">
                                            Tipo{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={editType}
                                            onValueChange={setEditType}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="main">
                                                    <div className="flex items-center gap-2">
                                                        <Star className="h-4 w-4 text-amber-500" />
                                                        Principal (solo 1)
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-2 text-xs"
                                                        >
                                                            Solo 1
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="promotional">
                                                    Promocional
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-500">
                                                {errors.type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Imagen */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">
                                            Imagen{' '}
                                            {!hasNewImage && '(opcional)'}
                                            {hasNewImage && (
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            )}
                                        </Label>

                                        <input
                                            ref={editFileInputRef}
                                            type="file"
                                            name="image"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleEditImageSelect}
                                            className="hidden"
                                        />

                                        {!hasNewImage ? (
                                            <Card className="border-2 border-dashed border-gray-300">
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="rounded-full bg-gray-100 p-3">
                                                            <Upload className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                editFileInputRef.current?.click()
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            Seleccionar nueva
                                                            imagen
                                                        </Button>
                                                        <p className="text-xs text-gray-500">
                                                            Formatos: JPG, PNG,
                                                            WEBP. Máximo 2MB.
                                                            Dejar vacío para
                                                            mantener la imagen
                                                            actual.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                <img
                                                    src={currentImage ?? undefined}
                                                    alt="Preview"
                                                    className="h-40 w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                                    onClick={() => {
                                                        setEditPreviewImage(
                                                            null,
                                                        );
                                                        setEditImageFile(null);

                                                        if (
                                                            editFileInputRef.current
                                                        ) {
                                                            editFileInputRef.current.value =
                                                                '';
                                                        }
                                                    }}
                                                >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        )}

                                        {errors.image && (
                                            <p className="text-sm text-red-500">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>

                                    <input
                                        type="hidden"
                                        name="type"
                                        value={editType}
                                    />
                                </div>

                                <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-amber-600 hover:bg-amber-700"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Actualizando...
                                            </>
                                        ) : (
                                            'Actualizar Banner'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </>
                        );
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
