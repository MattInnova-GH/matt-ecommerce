import { useState, useRef } from 'react';
import { Form } from '@inertiajs/react';
import { Star, Upload, X, Loader2, Plus } from 'lucide-react';
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

interface CreateProps {
    canAdd: boolean;
    banners: Banner[];
}

export function CreateBannerModal({ canAdd, banners }: CreateProps) {
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [createType, setCreateType] = useState<string>('promotional');
    const [createImageFile, setCreateImageFile] = useState<File | null>(null);
    const createFileInputRef = useRef<HTMLInputElement>(null);

    // Lógica original - sin cambios
    const handleCreateImageSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

            setCreateImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Lógica original - sin cambios
    const resetForm = () => {
        setPreviewImage(null);
        setCreateImageFile(null);
        setCreateType('promotional');

        if (createFileInputRef.current) {
            createFileInputRef.current.value = '';
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);

        if (!newOpen) {
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 shadow-sm"
                    disabled={!canAdd}
                    title={!canAdd ? 'Límite de 5 banners alcanzado' : ''}
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Banner
                    <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">
                        {banners?.length}/5
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Banner</DialogTitle>
                    <DialogDescription>
                        Agrega un nuevo banner. Los banners se mostrarán en el
                        orden que establezcas.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action={admin.banners.store()}
                    method="post"
                    encType="multipart/form-data"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) {
                            setOpen(false);
                            resetForm();
                        }

                        return (
                            <>
                                <div className="space-y-5">
                                    {/* Tipo */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">
                                            Tipo{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={createType}
                                            onValueChange={setCreateType}
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
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>

                                        <input
                                            ref={createFileInputRef}
                                            type="file"
                                            name="image"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleCreateImageSelect}
                                            className="hidden"
                                        />

                                        {!previewImage ? (
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
                                                                createFileInputRef.current?.click()
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            Seleccionar imagen
                                                        </Button>
                                                        <p className="text-xs text-gray-500">
                                                            Formatos: JPG, PNG,
                                                            WEBP. Máximo 2MB.
                                                            Imagen horizontal.
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="relative mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="h-40 w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setCreateImageFile(
                                                            null,
                                                        );

                                                        if (
                                                            createFileInputRef.current
                                                        ) {
                                                            createFileInputRef.current.value =
                                                                '';
                                                        }
                                                    }}
                                                >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Cambiar
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
                                        value={createType}
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
                                        disabled={
                                            processing || !createImageFile
                                        }
                                        className="bg-amber-600 hover:bg-amber-700"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            'Crear Banner'
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
