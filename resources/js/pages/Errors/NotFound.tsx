import { Head, Link } from '@inertiajs/react';
import { CompassIcon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
            <Head title="Página no encontrada" />

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CompassIcon className="h-8 w-8 text-muted-foreground" />
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">
                404 · Página no encontrada
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">
                La página que buscas no existe, fue movida o ya no está
                disponible.
            </p>

            <Button asChild size="lg" className="gap-2">
                <Link href="/">
                    <Home className="h-4 w-4" />
                    Volver al inicio
                </Link>
            </Button>
        </div>
    );
}
