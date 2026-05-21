import React from 'react';
import {
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    XCircle,
    ShoppingBag,
} from 'lucide-react';
import type { Order, OrderStatus } from './types';

export const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; icon: React.ElementType; badgeClass: string; step: number }
> = {
    pending: {
        label: 'Pendiente',
        icon: Clock,
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
        step: 0,
    },
    confirmed: {
        label: 'Confirmado',
        icon: CheckCircle2,
        badgeClass: 'border-blue-200 bg-blue-50 text-blue-700',
        step: 1,
    },
    shipped: {
        label: 'En camino',
        icon: Truck,
        badgeClass: 'border-violet-200 bg-violet-50 text-violet-700',
        step: 2,
    },
    delivered: {
        label: 'Entregado',
        icon: PackageCheck,
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        step: 3,
    },
    cancelled: {
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
    { status: 'pending', label: 'Pedido realizado', icon: ShoppingBag },
    { status: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
    { status: 'shipped', label: 'En camino', icon: Truck },
    { status: 'delivered', label: 'Entregado', icon: PackageCheck },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 1,
        order_number: 'ORD-2025-00142',
        status: 'delivered',
        total: 289.9,
        subtotal: 269.9,
        shipping_cost: 20.0,
        payment_method: 'Tarjeta Visa ****4321',
        created_at: '2025-04-28T10:30:00Z',
        updated_at: '2025-05-02T14:20:00Z',
        tracking_code: 'PE123456789',
        items: [
            { id: 1, product_name: 'Zapatillas Running Pro X200', product_thumbnail: null, quantity: 1, unit_price: 189.9, subtotal: 189.9 },
            { id: 2, product_name: 'Medias Deportivas Pack x3', product_thumbnail: null, quantity: 2, unit_price: 40.0, subtotal: 80.0 },
        ],
        shipping_address: { full_name: 'Carlos Mendoza', address: 'Av. Javier Prado Este 1234', city: 'Lima', district: 'San Isidro', country: 'Perú', postal_code: '15073', reference: 'Frente al parque Kennedy' },
    },
    {
        id: 2,
        order_number: 'ORD-2025-00138',
        status: 'shipped',
        total: 459.0,
        subtotal: 429.0,
        shipping_cost: 30.0,
        payment_method: 'Yape',
        created_at: '2025-05-05T09:15:00Z',
        updated_at: '2025-05-07T11:00:00Z',
        tracking_code: 'PE987654321',
        items: [
            { id: 3, product_name: 'Laptop Stand Ergonómico Aluminio', product_thumbnail: null, quantity: 1, unit_price: 229.0, subtotal: 229.0 },
            { id: 4, product_name: 'Mouse Inalámbrico Silencioso', product_thumbnail: null, quantity: 1, unit_price: 120.0, subtotal: 120.0 },
            { id: 5, product_name: 'Mousepad XL Gaming', product_thumbnail: null, quantity: 1, unit_price: 80.0, subtotal: 80.0 },
        ],
        shipping_address: { full_name: 'Carlos Mendoza', address: 'Jr. Las Flores 567', city: 'Lima', district: 'Miraflores', country: 'Perú' },
    },
    {
        id: 3,
        order_number: 'ORD-2025-00121',
        status: 'confirmed',
        total: 149.9,
        subtotal: 149.9,
        shipping_cost: 0,
        payment_method: 'Tarjeta Mastercard ****8800',
        created_at: '2025-05-08T16:45:00Z',
        updated_at: '2025-05-08T17:00:00Z',
        items: [
            { id: 6, product_name: 'Libro "Diseño UX Avanzado"', product_thumbnail: null, quantity: 1, unit_price: 89.9, subtotal: 89.9 },
            { id: 7, product_name: 'Cuaderno A5 Cuadriculado', product_thumbnail: null, quantity: 2, unit_price: 30.0, subtotal: 60.0 },
        ],
        shipping_address: { full_name: 'Carlos Mendoza', address: 'Calle Los Pinos 890', city: 'Lima', district: 'Surco', country: 'Perú', reference: 'Detrás del supermercado' },
    },
    {
        id: 4,
        order_number: 'ORD-2025-00099',
        status: 'cancelled',
        total: 320.0,
        subtotal: 300.0,
        shipping_cost: 20.0,
        payment_method: 'Plin',
        created_at: '2025-04-10T08:00:00Z',
        updated_at: '2025-04-11T09:30:00Z',
        items: [
            { id: 8, product_name: 'Auriculares Bluetooth Premium', product_thumbnail: null, quantity: 1, unit_price: 300.0, subtotal: 300.0 },
        ],
        shipping_address: { full_name: 'Carlos Mendoza', address: 'Av. Benavides 2000', city: 'Lima', district: 'Miraflores', country: 'Perú' },
    },
    {
        id: 5,
        order_number: 'ORD-2025-00077',
        status: 'pending',
        total: 75.5,
        subtotal: 65.5,
        shipping_cost: 10.0,
        payment_method: 'Transferencia bancaria',
        created_at: '2025-05-09T07:20:00Z',
        updated_at: '2025-05-09T07:20:00Z',
        items: [
            { id: 9, product_name: 'Botella Térmica 1L Acero', product_thumbnail: null, quantity: 1, unit_price: 65.5, subtotal: 65.5 },
        ],
        shipping_address: { full_name: 'Carlos Mendoza', address: 'Av. La Marina 123', city: 'Lima', district: 'San Miguel', country: 'Perú' },
    },
];
