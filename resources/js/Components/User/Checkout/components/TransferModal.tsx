import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Banknote, Copy, Check, Upload, FileText } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';

const BANK_INFO = {
    bankName: 'BCP',
    accountNumber: '191-XXXXXXXX-0-XX',
    cci: '002-191-00XXXXXXXXXX-XX',
    holder: 'EMPRESA S.A.C.',
    currency: 'Soles (PEN)',
};

export function TransferModal() {
    const { closeTransferModal, setTransferConfirmed, setVoucherFile } =
        useCheckoutStore();

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
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
        setTransferConfirmed(true);
        setVoucherFile(file);
        setConfirmed(true);
        setTimeout(() => closeTransferModal(), 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeTransferModal}
            />

            <div className="relative w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                            <Banknote size={16} className="text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Transferencia bancaria
                        </h3>
                    </div>
                    <button
                        onClick={closeTransferModal}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!confirmed ? (
                    <>
                        <p className="text-sm text-gray-500">
                            Realiza la transferencia a la siguiente cuenta y
                            sube tu comprobante para confirmar el pago.
                        </p>

                        {/* Datos bancarios */}
                        <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <BankField
                                label="Banco"
                                value={BANK_INFO.bankName}
                                fieldKey="bank"
                                copiedField={copiedField}
                                onCopy={copyToClipboard}
                            />
                            <BankField
                                label="N° de cuenta"
                                value={BANK_INFO.accountNumber}
                                fieldKey="account"
                                copiedField={copiedField}
                                onCopy={copyToClipboard}
                            />
                            <BankField
                                label="CCI interbancario"
                                value={BANK_INFO.cci}
                                fieldKey="cci"
                                copiedField={copiedField}
                                onCopy={copyToClipboard}
                            />
                            <BankField
                                label="Titular"
                                value={BANK_INFO.holder}
                                fieldKey="holder"
                                copiedField={copiedField}
                                onCopy={copyToClipboard}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Moneda</span>
                                <span className="font-medium text-gray-800">
                                    {BANK_INFO.currency}
                                </span>
                            </div>
                        </div>

                        {/* Comprobante */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Orden de compra / Comprobante de pago
                            </p>
                            {!file ? (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-all hover:border-blue-400 hover:bg-blue-50"
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
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Check size={16} />
                            Confirmar transferencia
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                            <Check size={32} className="text-blue-600" />
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            ¡Transferencia confirmada!
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

function BankField({
    label,
    value,
    fieldKey,
    copiedField,
    onCopy,
}: {
    label: string;
    value: string;
    fieldKey: string;
    copiedField: string | null;
    onCopy: (text: string, field: string) => void;
}) {
    const isCopied = copiedField === fieldKey;
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
            </div>
            <button
                onClick={() => onCopy(value, fieldKey)}
                className="ml-2 rounded-lg p-1.5 text-gray-400 transition hover:bg-white hover:text-blue-600"
                title="Copiar"
            >
                {isCopied ? (
                    <Check size={14} className="text-green-500" />
                ) : (
                    <Copy size={14} />
                )}
            </button>
        </div>
    );
}
