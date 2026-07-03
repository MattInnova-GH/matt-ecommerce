import type React from 'react';
import {
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    XCircle,
    ShoppingBag,
} from 'lucide-react';
import type { OrderStatus } from './types';

export const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; icon: React.ElementType; badgeClass: string; step: number }
> = {
    PENDING: {
        label: 'Pendiente',
        icon: Clock,
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
        step: 0,
    },
    ACCEPTED: {
        label: 'Aceptado',
        icon: CheckCircle2,
        badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
        step: 1,
    },
    SHIPPED: {
        label: 'En camino',
        icon: Truck,
        badgeClass: 'border-violet-200 bg-violet-50 text-violet-700',
        step: 2,
    },
    DELIVERED: {
        label: 'Entregado',
        icon: PackageCheck,
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        step: 3,
    },
    REJECTED: {
        label: 'Rechazado',
        icon: XCircle,
        badgeClass: 'border-red-200 bg-red-50 text-red-700',
        step: -1,
    },
    CANCELLED: {
        label: 'Cancelado',
        icon: XCircle,
        badgeClass: 'border-red-200 bg-red-50 text-red-700',
        step: -1,
    },
};

export const TIMELINE_STEPS: {
    status: OrderStatus;
    label: string;
    icon: React.ElementType;
}[] = [
    { status: 'PENDING', label: 'Pedido realizado', icon: ShoppingBag },
    { status: 'ACCEPTED', label: 'Aceptado', icon: CheckCircle2 },
    { status: 'SHIPPED', label: 'En camino', icon: Truck },
    { status: 'DELIVERED', label: 'Entregado', icon: PackageCheck },
];
