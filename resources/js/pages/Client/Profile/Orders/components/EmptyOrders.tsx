import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyOrders() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">
                Aún no tienes pedidos
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Cuando realices tu primera compra, aparecerá aquí con todos sus
                detalles.
            </p>
            <Button className="mt-6" asChild>
                <a href="/productos">Explorar productos</a>
            </Button>
        </div>
    );
}
