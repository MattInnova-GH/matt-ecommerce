import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Smartphone,
    Check,
    ArrowRight,
    QrCode,
    KeyRound,
    Upload,
    FileText,
    ChevronLeft,
} from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import type { YapeMode } from '@/stores/checkoutStore';

type YapeStep = 'phone' | 'method' | 'code' | 'qr' | 'voucher' | 'saved';

export function YapeModal() {
    const {
        closeYapeModal,
        setYapePhone,
        setYapeCode,
        setYapeMode,
        setVoucherFile,
    } = useCheckoutStore();

    const [step, setStep] = useState<YapeStep>('phone');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [approvalCode, setApprovalCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [selectedMode, setSelectedMode] = useState<YapeMode>('code');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhoneSubmit = () => {
        if (phone.replace(/\s/g, '').length < 9) {
            setPhoneError('Ingresa un número válido de 9 dígitos');
            return;
        }
        setPhoneError('');
        setYapePhone(phone);
        setStep('method');
    };

    const handleMethodSelect = (mode: YapeMode) => {
        setSelectedMode(mode);
        setYapeMode(mode);
        setStep(mode === 'code' ? 'code' : 'qr');
    };

    const handleCodeSubmit = () => {
        if (approvalCode.trim().length < 4) {
            setCodeError('Ingresa el código de aprobación de Yape');
            return;
        }
        setCodeError('');
        setYapeCode(approvalCode);
        setStep('voucher');
    };

    const handleQrContinue = () => {
        setStep('voucher');
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

    const handleVoucherConfirm = () => {
        setVoucherFile(file);
        setStep('saved');
        setTimeout(() => closeYapeModal(), 2000);
    };

    const stepTitles: Record<YapeStep, string> = {
        phone: 'Pagar con Yape',
        method: 'Elige cómo confirmar',
        code: 'Código de aprobación',
        qr: 'QR de Yape',
        voucher: 'Sube tu comprobante',
        saved: '¡Pago registrado!',
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closeYapeModal}
            />

            <div className="relative w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {(step === 'method' ||
                            step === 'code' ||
                            step === 'qr' ||
                            step === 'voucher') && (
                            <button
                                onClick={() => {
                                    if (step === 'method') setStep('phone');
                                    if (step === 'code' || step === 'qr')
                                        setStep('method');
                                    if (step === 'voucher')
                                        setStep(
                                            selectedMode === 'code'
                                                ? 'code'
                                                : 'qr',
                                        );
                                }}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C1AE0]">
                            <Smartphone size={16} className="text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                            {stepTitles[step]}
                        </h3>
                    </div>
                    <button
                        onClick={closeYapeModal}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Step: Teléfono ── */}
                {step === 'phone' && (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-gray-500">
                            Ingresa el número de celular vinculado a tu cuenta
                            Yape.
                        </p>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Número de celular
                            </label>
                            <div className="flex gap-2">
                                <div className="flex shrink-0 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                                    🇵🇪 +51
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 9),
                                        )
                                    }
                                    placeholder="987 654 321"
                                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:outline-none ${phoneError ? 'border-red-400' : 'border-gray-200'}`}
                                />
                            </div>
                            {phoneError && (
                                <p className="mt-1 text-xs text-red-500">
                                    {phoneError}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handlePhoneSubmit}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition hover:bg-[#5a14c0]"
                        >
                            Continuar <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* ── Step: Método ── */}
                {step === 'method' && (
                    <div className="space-y-3">
                        <p className="text-center text-sm text-gray-500">
                            ¿Cómo deseas confirmar tu pago con Yape?
                        </p>
                        <button
                            onClick={() => handleMethodSelect('code')}
                            className="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition hover:border-[#6C1AE0] hover:bg-purple-50"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                                <KeyRound
                                    size={20}
                                    className="text-[#6C1AE0]"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Código de aprobación
                                </p>
                                <p className="text-xs text-gray-500">
                                    Ingresa el código que Yape te muestra al
                                    pagar
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleMethodSelect('qr')}
                            className="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition hover:border-[#6C1AE0] hover:bg-purple-50"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                                <QrCode size={20} className="text-[#6C1AE0]" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    QR de Yape
                                </p>
                                <p className="text-xs text-gray-500">
                                    Escanea nuestro código QR desde la app de
                                    Yape
                                </p>
                            </div>
                        </button>
                    </div>
                )}

                {/* ── Step: Código de aprobación ── */}
                {step === 'code' && (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-gray-500">
                            Abre tu app Yape, realiza el pago y luego ingresa el
                            código de aprobación que aparece en pantalla.
                        </p>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">
                                Código de aprobación Yape
                            </label>
                            <input
                                type="text"
                                value={approvalCode}
                                onChange={(e) =>
                                    setApprovalCode(
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 8),
                                    )
                                }
                                placeholder="123456"
                                className={`w-full rounded-xl border px-4 py-3 text-center text-xl font-bold tracking-widest transition-colors focus:border-purple-500 focus:outline-none ${codeError ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            {codeError && (
                                <p className="mt-1 text-xs text-red-500">
                                    {codeError}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleCodeSubmit}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition hover:bg-[#5a14c0]"
                        >
                            Continuar <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* ── Step: QR ── */}
                {step === 'qr' && (
                    <div className="space-y-4 text-center">
                        <p className="text-sm text-gray-500">
                            Escanea el QR con tu app de Yape para realizar el
                            pago.
                        </p>
                        <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50">
                            <div className="text-center">
                                <QrCode
                                    size={64}
                                    className="mx-auto text-[#6C1AE0]"
                                />
                                <p className="mt-2 text-xs text-gray-400">
                                    QR de pago
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">
                            Una vez realizado el pago, continúa para subir el
                            comprobante.
                        </p>
                        <button
                            onClick={handleQrContinue}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition hover:bg-[#5a14c0]"
                        >
                            Ya realicé el pago <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* ── Step: Comprobante ── */}
                {step === 'voucher' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                            Sube una captura de pantalla o foto de tu
                            comprobante de pago Yape.
                        </p>
                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition hover:border-purple-400 hover:bg-purple-50"
                            >
                                <Upload size={22} className="text-gray-400" />
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
                                        {(file.size / 1024 / 1024).toFixed(2)}{' '}
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
                        <button
                            onClick={handleVoucherConfirm}
                            disabled={!file}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C1AE0] py-3 text-sm font-semibold text-white transition hover:bg-[#5a14c0] disabled:opacity-50"
                        >
                            <Check size={16} /> Confirmar pago
                        </button>
                    </div>
                )}

                {/* ── Step: Guardado ── */}
                {step === 'saved' && (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                            <Check size={32} className="text-[#6C1AE0]" />
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                            ¡Pago registrado!
                        </p>
                        <p className="text-sm text-gray-500">
                            +51 {phone} · Confirma tu pedido desde el resumen.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
}
