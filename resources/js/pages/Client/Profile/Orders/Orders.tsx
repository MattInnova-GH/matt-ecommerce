import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import OrderCard from './components/OrderCard';
import EmptyOrders from './components/EmptyOrders';
import StatsBar from './components/StatsBar';
import type { Order } from './types';

interface OrdersPageProps {
    orders: Order[];
}

export default function OrdersPage({ orders }: OrdersPageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = orders.filter((order) => {
        const q = search.toLowerCase();
        const matchSearch =
            !search ||
            order.order_number.toLowerCase().includes(q) ||
            order.items.some((i) => i.product_name.toLowerCase().includes(q));
        const matchStatus =
            statusFilter === 'all' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Mis Pedidos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Revisa el estado y detalles de todas tus compras
                    </p>
                </div>

                <StatsBar orders={orders} />

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por número de pedido o producto…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos los estados
                            </SelectItem>
                            <SelectItem value="PENDING">Pendiente</SelectItem>
                            <SelectItem value="ACCEPTED">Aceptado</SelectItem>
                            <SelectItem value="SHIPPED">En camino</SelectItem>
                            <SelectItem value="DELIVERED">
                                Entregado
                            </SelectItem>
                            <SelectItem value="REJECTED">
                                Rechazado
                            </SelectItem>
                            <SelectItem value="CANCELLED">
                                Cancelado
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(search || statusFilter !== 'all') && (
                    <p className="mt-3 text-xs text-muted-foreground">
                        {filtered.length === 0
                            ? 'Sin resultados'
                            : `${filtered.length} pedido${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
                    </p>
                )}

                <div className="mt-4 space-y-3">
                    {filtered.length === 0 ? (
                        <EmptyOrders />
                    ) : (
                        filtered.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
