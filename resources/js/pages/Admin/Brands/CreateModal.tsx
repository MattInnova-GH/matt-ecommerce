import { Form } from '@inertiajs/react';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import admin from '@/routes/admin';

interface Props {
    onClose: () => void;
}

export default function CreateModal({ onClose }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nueva Marca</DialogTitle>
                </DialogHeader>

                <Form
                    action={admin.brands.store()}
                    method="post"
                    className="space-y-5"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) {
                            onClose();
                        }

                        return (
                            <>
                                {/* Logo */}
                                <div className="space-y-2">
                                    <Label className="block text-center">
                                        Logo de la marca
                                    </Label>
                                    <div className="flex flex-col items-center gap-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage
                                                src={previewImage || undefined}
                                            />
                                            <AvatarFallback className="bg-secondary text-3xl">
                                                <ImageIcon className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <Label className="cursor-pointer">
                                            <Upload className="mr-2 inline h-4 w-4" />
                                            Subir logo
                                            <input
                                                type="file"
                                                name="logo"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];

                                                    if (file) {
                                                        const reader =
                                                            new FileReader();
                                                        reader.onloadend = () =>
                                                            setPreviewImage(
                                                                reader.result as string,
                                                            );
                                                        reader.readAsDataURL(
                                                            file,
                                                        );
                                                    }
                                                }}
                                            />
                                        </Label>
                                    </div>
                                    {errors.logo && (
                                        <p className="text-center text-xs text-red-500">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nombre{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Ej: Nike, Adidas, Apple..."
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creando...
                                            </>
                                        ) : (
                                            'Crear marca'
                                        )}
                                    </Button>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
