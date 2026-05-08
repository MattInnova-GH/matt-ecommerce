import admin from '@/routes/admin';
import { Form } from '@inertiajs/react';
import {
    X,
    ImageIcon,
    Upload,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    onClose: () => void;
}

export default function CreateModal({ onClose }: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                            <ImageIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Nueva categoría
                            </h2>
                            <p className="text-xs text-gray-500">
                                Completa los datos para crear una nueva
                                categoría
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <Form
                    action={admin.categories.store()}
                    method="post"
                    encType="multipart/form-data"
                    className="space-y-5 p-6"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) onClose();

                        return (
                            <>
                                {/* Imagen - Diseño centrado */}
                                <div>
                                    <label className="mb-2 block text-center text-sm font-medium text-gray-700">
                                        Imagen de la categoría
                                    </label>

                                    {/* Contenedor de imagen centrado */}
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        {previewImage ? (
                                            <div className="group relative">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="h-32 w-32 rounded-xl border border-gray-200 object-cover shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewImage(null)
                                                    }
                                                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-sm transition-colors hover:bg-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}

                                        {/* Botón de subir debajo de la imagen */}
                                        <label className="cursor-pointer rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                                            <Upload
                                                size={16}
                                                className="mr-2 inline"
                                            />
                                            Subir imagen
                                            <input
                                                type="file"
                                                name="image"
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
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <p className="mt-2 text-center text-xs text-red-500">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Nombre{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        placeholder="Ej: Electrónica, Ropa, Hogar..."
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Estado
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="1"
                                                defaultChecked
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                                Activo
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="0"
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <XCircle
                                                    size={14}
                                                    className="text-red-500"
                                                />
                                                Inactivo
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="mr-2 inline animate-spin"
                                                />
                                                Guardando...
                                            </>
                                        ) : (
                                            'Crear categoría'
                                        )}
                                    </button>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </div>
        </div>
    );
}
