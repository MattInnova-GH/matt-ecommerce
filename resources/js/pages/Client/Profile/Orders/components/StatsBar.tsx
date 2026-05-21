import { Package, PackageCheck, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Order } from '../types';

export default function StatsBar({ orders }: { orders: Order[] }) {
    const stats = [
        { label: 'Total pedidos', value: orders.length, icon: Package },
        {
            label: 'Entregados',
            value: orders.filter((o) => o.status === 'delivered').length,
            icon: PackageCheck,
        },
        {
            label: 'En progreso',
            value: orders.filter((o) =>
                ['pending', 'confirmed', 'shipped'].includes(o.status),
            ).length,
            icon: Truck,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="rounded-md bg-muted p-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs text-muted-foreground">{label}</p>
                            <p className="text-base font-bold">{value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
