import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';

export function Voucher() {
    const { paymentMethod, voucherFile, setVoucherFile } = useCheckoutStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Solo mostrar para Yape / Plin (o si se agregan otros métodos manuales)
    if (paymentMethod !== 'yape') {
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setVoucherFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setVoucherFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-1 text-base font-semibold text-gray-900">
                Comprobante de pago
            </h2>
            <p className="mb-5 text-xs text-gray-400">
                Sube una captura de pantalla o foto de tu transferencia
            </p>

            <div className="space-y-4">
                {!voucherFile ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 transition-all hover:border-gray-400 hover:bg-gray-100"
                    >
                        <div className="rounded-full bg-white p-3 text-gray-400 shadow-sm">
                            <Upload size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                                Haz clic para subir o arrastra una imagen
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                PNG, JPG o PDF (máx. 5MB)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                {previewUrl &&
                                voucherFile.type.startsWith('image/') ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <FileText
                                        size={24}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {voucherFile.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {(voucherFile.size / 1024 / 1024).toFixed(
                                        2,
                                    )}{' '}
                                    MB
                                </p>
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                />
            </div>
        </div>
    );
}

export default Voucher;
