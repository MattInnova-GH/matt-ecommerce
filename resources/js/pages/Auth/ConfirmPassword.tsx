import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmar contraseña" />

            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
                    <div className="mb-4 text-sm text-muted-foreground">
                        Esta es un área segura de la aplicación. Confirma tu
                        contraseña antes de continuar.
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Contraseña
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        autoFocus
                                        autoComplete="current-password"
                                        placeholder="Contraseña"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Confirmar
                                </Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirmar contraseña',
    description:
        'Esta es un área segura de la aplicación. Confirma tu contraseña antes de continuar.',
};
