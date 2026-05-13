import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { User } from './types/settings';

function getInitials(first: string, last: string) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

interface AvatarSubSectionProps {
    user: User;
}

export function AvatarSubSection({ user }: AvatarSubSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setPreview(URL.createObjectURL(file));
        setUploading(true);

        router.post(
            '/profile/avatar',
            { avatar: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => {
                    setUploading(false);
                    setPreview(null);
                },
            },
        );
    };

    const handleRemove = () => {
        setRemoving(true);
        router.delete('/profile/avatar', {
            preserveScroll: true,
            onFinish: () => setRemoving(false),
        });
        setConfirmRemove(false);
    };

    const avatarSrc =
        preview ?? (user.avatar ? `/storage/${user.avatar}` : null);

    return (
        <div>
            <h3 className="mb-1 text-sm font-semibold">Foto de perfil</h3>
            <p className="mb-4 text-xs text-muted-foreground">
                JPG, PNG o WebP. Máximo 2 MB.
            </p>
            <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                            <span className="text-xl font-semibold text-muted-foreground">
                                {getInitials(user.first_name, user.last_name)}
                            </span>
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-3.5 w-3.5" />
                        {user.avatar ? 'Cambiar foto' : 'Subir foto'}
                    </Button>
                    {user.avatar && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            disabled={removing}
                            onClick={() => setConfirmRemove(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                        </Button>
                    )}
                </div>
            </div>

            <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar foto de perfil?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Se mostrará tu inicial en lugar de la foto.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
