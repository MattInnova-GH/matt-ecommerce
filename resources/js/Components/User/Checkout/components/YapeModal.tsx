import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Smartphone, Check, Copy, Upload, FileText } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';

const MAX_VOUCHER_SIZE_MB = 5;

export function YapeModal() {
    const { closeYapeModal, setYapeConfirmed, setVoucherFile } =
        useCheckoutStore();
    const { settings } = usePage().props as any;
    const yapeQr: string | null = settings?.yape_qr || null;
    const yapeNumber: string | null = settings?.yape_number || null;

    const [copied, setCopied] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const copyNumber = () => {
        if (!yapeNumber) return;
        navigator.clipboard.writeText(yapeNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.size > MAX_VOUCHER_SIZE_MB * 1024 * 1024) {
            toast.error(
                `El comprobante no debe pesar más de ${MAX_VOUCHER_SIZE_MB}MB.`,
            );
            e.target.value = '';
            return;
        }
        setFile(selected);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(selected);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleConfirm = () => {
        setYapeConfirmed(true);
        setVoucherFile(file);
        setConfirmed(true);
        toast.success('Comprobante de Yape registrado correctamente.');
        setTimeout(() => closeYapeModal(), 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeYapeModal}
            />

            <div className="relative w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C1AE0]">
                            <Smartphone size={16} className="text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Pagar con Yape
                        </h3>
                    </div>
                    <button
                        onClick={closeYapeModal}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!confirmed ? (
                    <>
                        <p className="text-sm text-gray-500">
                            Escanea el QR o yapea al número de abajo y sube
                            tu comprobante para confirmar el pago.
                        </p>

                        {/* QR */}
                        <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-purple-100 bg-purple-50">
                            {yapeQr ? (
                                <img
                                    src={yapeQr}
                                    alt="QR de Yape"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <p className="px-4 text-center text-xs text-gray-400">
                                    El QR de Yape aún no está configurado
                                </p>
                            )}
                        </div>

                        {/* Numero */}
                        <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 p-4">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Número Yape
                                </p>
                                <p className="font-medium text-gray-800">
                                    {yapeNumber || 'No configurado'}
                                </p>
                            </div>
                            {yapeNumber && (
                                <button
                                    onClick={copyNumber}
                                    className="ml-2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-[#6C1AE0]"
                                    title="Copiar"
                                >
                                    {copied ? (
                                        <Check
                                            size={16}
                                            className="text-green-500"
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Comprobante */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Comprobante de pago
                            </p>
                            {!file ? (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-all hover:border-purple-400 hover:bg-purple-50"
                                >
                                    <Upload
                                        size={22}
                                        className="text-gray-400"
                                    />
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-700">
                                            Subir comprobante
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            PNG, JPG o PDF (máx. 5MB)
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                        {previewUrl &&
                                        file.type.startsWith('image/') ? (
                                            <img
                                                src={previewUrl}
                                                alt="preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <FileText
                                                size={20}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(
                                                2,
                                            )}{' '}
                                            MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
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

                        <button
                            onClick={handleConfirm}
                            disabled={!file}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition hover:bg-[#5a14c0] disabled:opacity-50"
                        >
                            <Check size={16} /> Confirmar pago
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                            <Check size={32} className="text-[#6C1AE0]" />
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            ¡Pago registrado!
                        </p>
                        <p className="text-sm text-gray-500">
                            Tu comprobante fue adjuntado. Confirma tu pedido
                            desde el resumen.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
