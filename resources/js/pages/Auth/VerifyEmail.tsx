import { Form, Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
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

            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <Mail className="h-6 w-6 text-gray-500" />
                    </div>

                    <h1 className="mb-2 text-xl font-bold text-gray-900">
                        Verifica tu correo
                    </h1>

                    <p className="mb-2 text-sm text-gray-500">
                        Antes de continuar, verifica tu correo haciendo clic
                        en el enlace que te acabamos de enviar. Si no lo
                        recibiste, con gusto te enviamos otro.
                    </p>
                    <p className="mb-6 text-xs text-gray-400">
                        Recuerda revisar también tu carpeta de{' '}
                        <span className="font-medium">spam o correo no deseado</span>
                        , el mensaje a veces llega ahí.
                    </p>

                    {verificationLinkSent && (
                        <div className="mb-6 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-600">
                            Se ha enviado un nuevo enlace de verificación a tu
                            correo.
                        </div>
                    )}

                    <Form {...send.form()} className="mb-4">
                        {({ processing }) => (
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing && <Spinner />}
                                Reenviar correo de verificación
                            </Button>
                        )}
                    </Form>

                    <Form method="post" action={logout()}>
                        <button
                            type="submit"
                            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                        >
                            Cerrar sesión
                        </button>
                    </Form>
                </div>
            </div>
        </>
    );
}
