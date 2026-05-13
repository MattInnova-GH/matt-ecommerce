import { Form } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import admin from '@/routes/admin';

interface Brand {
    id: number;
    name: string;
    products_count: number;
}

interface Props {
    brand: Brand;
    onClose: () => void;
}

export default function DeleteModal({ brand, onClose }: Props) {
    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará permanentemente la marca{' '}
                        <strong>"{brand.name}"</strong> y no se podrá deshacer.
                        {brand.products_count > 0 && (
                            <div className="mt-2 text-red-600">
                                ⚠️ Esta marca tiene {brand.products_count}{' '}
                                producto(s) asociado(s).
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Cancelar
                    </AlertDialogCancel>

                    <Form
                        action={admin.brands.destroy(brand.id)}
                        onSuccess={onClose}
                        className="inline"
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Eliminar'
                                )}
                            </Button>
                        )}
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
