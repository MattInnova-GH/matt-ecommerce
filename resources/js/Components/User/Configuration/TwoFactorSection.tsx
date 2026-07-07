import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, ShieldOff, KeyRound } from 'lucide-react';
import { store as confirmPassword } from '@/routes/password/confirm';
import twoFactor from '@/routes/two-factor';

interface TwoFactorSectionProps {
    enabled: boolean;
}

type Step = 'idle' | 'confirm-password' | 'scan-qr' | 'show-recovery';

export function TwoFactorSection({ enabled: initialEnabled }: TwoFactorSectionProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [step, setStep] = useState<Step>('idle');
    const [pendingAction, setPendingAction] = useState<'enable' | 'disable' | null>(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const startFlow = (action: 'enable' | 'disable') => {
        setPendingAction(action);
        setStep('confirm-password');
        setPassword('');
        setPasswordError('');
    };

    const cancelFlow = () => {
        setStep('idle');
        setPendingAction(null);
        setCode('');
        setCodeError('');
    };

    const submitPassword = async () => {
        setProcessing(true);

        // Fortify's confirm-password endpoint redirects to the "intended"
        // route (e.g. home) for regular requests — it only stays put and
        // returns JSON if the request explicitly asks for it, so we can't
        // use Inertia's router here (it would navigate away from this page).
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        const xsrfToken = match ? decodeURIComponent(match[1]) : '';

        const res = await fetch(confirmPassword.url(), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': xsrfToken,
            },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            if (pendingAction === 'enable') {
                enableTwoFactor();
            } else {
                disableTwoFactor();
            }
            return;
        }

        if (res.status === 422) {
            const data = await res.json();
            setPasswordError(data.errors?.password?.[0] || 'Contraseña incorrecta.');
        } else {
            setPasswordError('Contraseña incorrecta.');
        }
        setProcessing(false);
    };

    const enableTwoFactor = () => {
        router.post(
            twoFactor.enable.url(),
            {},
            {
                preserveScroll: true,
                onSuccess: async () => {
                    const res = await fetch(twoFactor.qrCode.url(), {
                        headers: { Accept: 'application/json' },
                    });
                    const data = await res.json();
                    setQrSvg(data.svg ?? null);
                    setStep('scan-qr');
                    setProcessing(false);
                },
                onError: () => {
                    toast.error('No se pudo activar la verificación en dos pasos.');
                    setProcessing(false);
                    cancelFlow();
                },
            },
        );
    };

    const confirmCode = () => {
        if (code.trim().length < 6) {
            setCodeError('Ingresa el código de 6 dígitos de tu app de autenticación.');
            return;
        }
        setProcessing(true);
        router.post(
            twoFactor.confirm.url(),
            { code },
            {
                preserveScroll: true,
                onSuccess: async () => {
                    const res = await fetch(twoFactor.recoveryCodes.url(), {
                        headers: { Accept: 'application/json' },
                    });
                    const data = await res.json();
                    setRecoveryCodes(Array.isArray(data) ? data : []);
                    setStep('show-recovery');
                    setEnabled(true);
                    setProcessing(false);
                    toast.success('Verificación en dos pasos activada correctamente.');
                },
                onError: (errors) => {
                    setCodeError(errors.code || 'El código ingresado no es válido.');
                    setProcessing(false);
                },
            },
        );
    };

    const disableTwoFactor = () => {
        router.delete(twoFactor.disable.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setEnabled(false);
                setStep('idle');
                setPendingAction(null);
                setProcessing(false);
                toast.success('Verificación en dos pasos desactivada.');
            },
            onError: () => {
                toast.error('No se pudo desactivar la verificación en dos pasos.');
                setProcessing(false);
                cancelFlow();
            },
        });
    };

    const finishSetup = () => {
        setStep('idle');
        setPendingAction(null);
        setRecoveryCodes([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">
                    Verificación en dos pasos
                </h2>
                <p className="text-sm text-muted-foreground">
                    Agrega una capa extra de seguridad: además de tu
                    contraseña, se te pedirá un código (token) generado por
                    una app de autenticación (Google Authenticator, Authy,
                    etc.) al iniciar sesión.
                </p>
            </div>
            <Separator />

            {step === 'idle' && (
                <div className="flex max-w-md items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        {enabled ? (
                            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                        ) : (
                            <ShieldOff className="h-5 w-5 shrink-0 text-muted-foreground" />
                        )}
                        <div>
                            <p className="text-sm font-medium">
                                {enabled ? 'Activada' : 'Desactivada'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {enabled
                                    ? 'Tu cuenta está protegida con un segundo factor.'
                                    : 'Actívala para proteger mejor tu cuenta.'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant={enabled ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => startFlow(enabled ? 'disable' : 'enable')}
                    >
                        {enabled ? 'Desactivar' : 'Activar'}
                    </Button>
                </div>
            )}

            {step === 'confirm-password' && (
                <div className="max-w-md space-y-4 rounded-lg border p-4">
                    <p className="text-sm font-medium">
                        Confirma tu contraseña para continuar
                    </p>
                    <div className="space-y-1.5">
                        <Label htmlFor="tfa_password">Contraseña actual</Label>
                        <Input
                            id="tfa_password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                            <p className="text-xs text-destructive">
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            disabled={processing || !password}
                            onClick={submitPassword}
                        >
                            Continuar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelFlow}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            {step === 'scan-qr' && (
                <div className="max-w-md space-y-4 rounded-lg border p-4">
                    <p className="text-sm font-medium">
                        Escanea este código con tu app de autenticación
                    </p>
                    {qrSvg && (
                        <div
                            className="w-fit rounded-lg border bg-white p-3"
                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                        />
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="tfa_code">
                            Código de 6 dígitos
                        </Label>
                        <Input
                            id="tfa_code"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value.replace(/\D/g, ''))
                            }
                            placeholder="123456"
                        />
                        {codeError && (
                            <p className="text-xs text-destructive">
                                {codeError}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            disabled={processing}
                            onClick={confirmCode}
                        >
                            Confirmar y activar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelFlow}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            {step === 'show-recovery' && (
                <div className="max-w-md space-y-4 rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-sm font-medium">
                            Guarda tus códigos de recuperación
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Úsalos si pierdes acceso a tu app de autenticación.
                        Cada código solo se puede usar una vez. No podrás
                        volver a verlos.
                    </p>
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 font-mono text-xs">
                        {recoveryCodes.map((rc) => (
                            <span key={rc}>{rc}</span>
                        ))}
                    </div>
                    <Button size="sm" onClick={finishSetup}>
                        Ya guardé mis códigos
                    </Button>
                </div>
            )}
        </div>
    );
}
