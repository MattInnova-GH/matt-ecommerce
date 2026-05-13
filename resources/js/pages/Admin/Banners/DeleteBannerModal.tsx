import { router } from '@inertiajs/react';
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
    type: 'main' | 'promotional';
}

interface DeleteBannerModalProps {
    banner: Banner | null;
    onClose: () => void;
    canDelete: boolean;
}

export function DeleteBannerModal({
    banner,
    onClose,
    canDelete,
}: DeleteBannerModalProps) {
    const handleDelete = () => {
        if (!banner) {
            return;
        }

        if (!canDelete) {
            toast.error('Debe haber al menos 2 banners');

            return;
        }

        router.delete(admin.banners.destroy(banner.id), {
            onSuccess: () => {
                onClose();
                toast.success('Banner eliminado exitosamente');
                router.reload();
            },
            onError: () => {
                toast.error('Error al eliminar el banner');
            },
        });
    };

    return (
        <AlertDialog open={!!banner} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar Banner?</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de eliminar el banner? Esta acción no se
                        puede deshacer y eliminará la imagen del servidor.
                        {banner?.type === 'main' && (
                            <p className="mt-2 text-amber-600">
                                ⚠️ Este es el banner principal. Se asignará
                                automáticamente otro como principal.
                            </p>
                        )}
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
    );
}
