import { Form, Head } from '@inertiajs/react';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
};

export default function VerifyEmail({ status }: Props) {
    const verificationLinkSent = status === 'verification-link-sent';

    return (
        <>
            <Head title="Verifica tu correo" />

            <div className="mb-4 text-sm text-muted-foreground">
                Gracias por registrarte. Antes de continuar, verifica tu correo
                haciendo clic en el enlace que te acabamos de enviar. Si no lo
                recibiste, con gusto te enviamos otro.
            </div>

            {verificationLinkSent && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a tu correo.
                </div>
            )}

            <Form {...send.form()} className="flex flex-col gap-6">
                {({ processing }) => (
                    <div className="flex items-center justify-between">
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Reenviar correo de verificación
                        </Button>

                        <Form method="post" action={logout()}>
                            <button
                                type="submit"
                                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                Cerrar sesión
                            </button>
                        </Form>
                    </div>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifica tu correo',
    description: 'Confirma tu dirección de correo para continuar.',
};
