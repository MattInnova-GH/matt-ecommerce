import admin from '@/routes/admin';
import { Form } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    category: Category;
    onClose: () => void;
}

export default function DeleteModal({ category, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Eliminar categoría
                    </h3>
                    <p className="text-sm text-gray-500">
                        ¿Estás seguro de eliminar{' '}
                        <strong>"{category.name}"</strong>? Esta acción no se
                        puede deshacer.
                    </p>

                    <Form
                        action={admin.categories.destroy(category.id)}
                        method="delete"
                        className="mt-6"
                    >
                        {({ processing, wasSuccessful }) => {
                            if (wasSuccessful) onClose();

                            return (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Eliminando...'
                                            : 'Eliminar'}
                                    </button>
                                </div>
                            );
                        }}
                    </Form>
                </div>
            </div>
        </div>
    );
}
