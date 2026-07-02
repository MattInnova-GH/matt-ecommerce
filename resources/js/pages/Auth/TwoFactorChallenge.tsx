import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);

    return (
        <>
            <Head title="Verificación en dos pasos" />

            <div className="mb-4 text-sm text-muted-foreground">
                {useRecoveryCode
                    ? 'Ingresa uno de tus códigos de recuperación de emergencia.'
                    : 'Ingresa el código de 6 dígitos generado por tu aplicación de autenticación.'}
            </div>

            <Form
                {...store.form()}
                resetOnSuccess
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        {useRecoveryCode ? (
                            <div className="grid gap-2">
                                <Label htmlFor="recovery_code">
                                    Código de recuperación
                                </Label>
                                <Input
                                    id="recovery_code"
                                    name="recovery_code"
                                    autoFocus
                                    autoComplete="one-time-code"
                                    placeholder="Código de recuperación"
                                />
                                <InputError message={errors.recovery_code} />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label htmlFor="code">Código</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    autoFocus
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    placeholder="123456"
                                />
                                <InputError message={errors.code} />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Verificar
                        </Button>

                        <button
                            type="button"
                            onClick={() => setUseRecoveryCode((prev) => !prev)}
                            className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                        >
                            {useRecoveryCode
                                ? 'Usar código de autenticación'
                                : 'Usar código de recuperación'}
                        </button>
                    </div>
                )}
            </Form>
        </>
    );
}

TwoFactorChallenge.layout = {
    title: 'Verificación en dos pasos',
    description: 'Confirma tu identidad para continuar.',
};
