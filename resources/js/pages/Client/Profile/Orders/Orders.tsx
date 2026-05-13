import React, { useState } from 'react';
import {
    Package,
    ChevronDown,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    PackageCheck,
    Search,
    Filter,
    Download,
    RotateCcw,
    ShoppingBag,
    Calendar,
    Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

interface OrderItem {
    id: number;
    product_name: string;
    product_thumbnail: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    total: number;
    subtotal: number;
    shipping_cost: number;
    payment_method: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    shipping_address: {
        full_name: string;
        address: string;
        city: string;
        district: string;
        country: string;
        postal_code?: string;
        reference?: string;
    };
    tracking_code?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
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
            {
                id: 1,
                product_name: 'Zapatillas Running Pro X200',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 189.9,
                subtotal: 189.9,
            },
            {
                id: 2,
                product_name: 'Medias Deportivas Pack x3',
                product_thumbnail: null,
                quantity: 2,
                unit_price: 40.0,
                subtotal: 80.0,
            },
        ],
        shipping_address: {
            full_name: 'Carlos Mendoza',
            address: 'Av. Javier Prado Este 1234',
            city: 'Lima',
            district: 'San Isidro',
            country: 'Perú',
            postal_code: '15073',
            reference: 'Frente al parque Kennedy',
        },
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
            {
                id: 3,
                product_name: 'Laptop Stand Ergonómico Aluminio',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 229.0,
                subtotal: 229.0,
            },
            {
                id: 4,
                product_name: 'Mouse Inalámbrico Silencioso',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 120.0,
                subtotal: 120.0,
            },
            {
                id: 5,
                product_name: 'Mousepad XL Gaming',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 80.0,
                subtotal: 80.0,
            },
        ],
        shipping_address: {
            full_name: 'Carlos Mendoza',
            address: 'Jr. Las Flores 567',
            city: 'Lima',
            district: 'Miraflores',
            country: 'Perú',
        },
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
            {
                id: 6,
                product_name: 'Libro "Diseño UX Avanzado"',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 89.9,
                subtotal: 89.9,
            },
            {
                id: 7,
                product_name: 'Cuaderno A5 Cuadriculado',
                product_thumbnail: null,
                quantity: 2,
                unit_price: 30.0,
                subtotal: 60.0,
            },
        ],
        shipping_address: {
            full_name: 'Carlos Mendoza',
            address: 'Calle Los Pinos 890',
            city: 'Lima',
            district: 'Surco',
            country: 'Perú',
            reference: 'Detrás del supermercado',
        },
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
            {
                id: 8,
                product_name: 'Auriculares Bluetooth Premium',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 300.0,
                subtotal: 300.0,
            },
        ],
        shipping_address: {
            full_name: 'Carlos Mendoza',
            address: 'Av. Benavides 2000',
            city: 'Lima',
            district: 'Miraflores',
            country: 'Perú',
        },
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
            {
                id: 9,
                product_name: 'Botella Térmica 1L Acero',
                product_thumbnail: null,
                quantity: 1,
                unit_price: 65.5,
                subtotal: 65.5,
            },
        ],
        shipping_address: {
            full_name: 'Carlos Mendoza',
            address: 'Av. La Marina 123',
            city: 'Lima',
            district: 'San Miguel',
            country: 'Perú',
        },
    },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    OrderStatus,
    {
        label: string;
        icon: React.ElementType;
        badgeClass: string;
        step: number;
    }
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

const TIMELINE_STEPS: {
    status: OrderStatus;
    label: string;
    icon: React.ElementType;
}[] = [
    { status: 'pending', label: 'Pedido realizado', icon: ShoppingBag },
    { status: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
    { status: 'shipped', label: 'En camino', icon: Truck },
    { status: 'delivered', label: 'Entregado', icon: PackageCheck },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`gap-1.5 font-medium ${config.badgeClass}`}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </Badge>
    );
}

// ─── Timeline de seguimiento ──────────────────────────────────────────────────

function OrderTimeline({ order }: { order: Order }) {
    if (order.status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                <div>
                    <p className="text-sm font-medium text-red-700">
                        Pedido cancelado
                    </p>
                    <p className="text-xs text-red-500">
                        Cancelado el {formatDate(order.updated_at)}
                    </p>
                </div>
            </div>
        );
    }

    const currentStep = STATUS_CONFIG[order.status].step;

    return (
        <div className="relative">
            <div className="flex items-start justify-between gap-2">
                {TIMELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const done = idx <= currentStep;
                    const active = idx === currentStep;

                    return (
                        <React.Fragment key={step.status}>
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                                        done
                                            ? active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-primary/40 bg-primary/10 text-primary'
                                            : 'border-muted bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span
                                    className={`text-center text-xs leading-tight ${
                                        done
                                            ? active
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground'
                                            : 'text-muted-foreground/50'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {idx < TIMELINE_STEPS.length - 1 && (
                                <div
                                    className={`mt-4 h-0.5 flex-1 transition-colors ${
                                        idx < currentStep
                                            ? 'bg-primary/40'
                                            : 'bg-muted'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
    const [open, setOpen] = useState(false);

    const previewItems = order.items.slice(0, 2);
    const remainingCount = order.items.length - previewItems.length;

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <Collapsible open={open} onOpenChange={setOpen}>
                {/* ── Header de la tarjeta ── */}
                <CollapsibleTrigger asChild>
                    <button className="w-full text-left">
                        <div className="p-5">
                            {/* Fila superior: número + estado + fecha */}
                            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono text-sm font-semibold tracking-wide">
                                        {order.order_number}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={order.status} />
                                    <ChevronDown
                                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Info rápida */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(order.created_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Package className="h-3.5 w-3.5" />
                                    {order.items.length}{' '}
                                    {order.items.length === 1
                                        ? 'producto'
                                        : 'productos'}
                                </span>
                                <span className="ml-auto font-semibold text-foreground">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>

                            {/* Preview de productos */}
                            <div className="mt-3 flex items-center gap-2">
                                {previewItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted"
                                    >
                                        {item.product_thumbnail ? (
                                            <img
                                                src={`/storage/${item.product_thumbnail}`}
                                                alt={item.product_name}
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                        ) : (
                                            <Package className="h-4 w-4 text-muted-foreground/50" />
                                        )}
                                    </div>
                                ))}
                                {remainingCount > 0 && (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-xs font-medium text-muted-foreground">
                                        +{remainingCount}
                                    </div>
                                )}
                                <span className="ml-1 text-xs text-muted-foreground">
                                    {previewItems
                                        .map((i) => i.product_name)
                                        .join(', ')}
                                    {remainingCount > 0 &&
                                        ` y ${remainingCount} más`}
                                </span>
                            </div>
                        </div>
                    </button>
                </CollapsibleTrigger>

                {/* ── Contenido expandido ── */}
                <CollapsibleContent>
                    <Separator />
                    <div className="space-y-6 p-5">
                        {/* Timeline */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold">
                                Seguimiento del pedido
                            </h4>
                            <OrderTimeline order={order} />
                            {order.tracking_code && (
                                <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        Código de seguimiento:
                                    </span>
                                    <span className="font-mono text-xs font-semibold">
                                        {order.tracking_code}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Productos */}
                        <div>
                            <h4 className="mb-3 text-sm font-semibold">
                                Productos
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
                                            {item.product_thumbnail ? (
                                                <img
                                                    src={`/storage/${item.product_thumbnail}`}
                                                    alt={item.product_name}
                                                    className="h-full w-full rounded-lg object-cover"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-muted-foreground/40" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.quantity} ×{' '}
                                                {formatCurrency(
                                                    item.unit_price,
                                                )}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Subtotales */}
                            <div className="mt-4 space-y-1.5 rounded-lg border bg-muted/30 p-3">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>
                                        {formatCurrency(order.subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Envío</span>
                                    <span>
                                        {order.shipping_cost === 0
                                            ? 'Gratis'
                                            : formatCurrency(
                                                  order.shipping_cost,
                                              )}
                                    </span>
                                </div>
                                <Separator className="my-1.5" />
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Dirección + Pago */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    Dirección de envío
                                </h4>
                                <div className="space-y-0.5 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">
                                        {order.shipping_address.full_name}
                                    </p>
                                    <p>{order.shipping_address.address}</p>
                                    <p>
                                        {order.shipping_address.district},{' '}
                                        {order.shipping_address.city}
                                    </p>
                                    <p>
                                        {order.shipping_address.country}
                                        {order.shipping_address.postal_code &&
                                            ` · ${order.shipping_address.postal_code}`}
                                    </p>
                                    {order.shipping_address.reference && (
                                        <p className="text-xs italic">
                                            Ref:{' '}
                                            {order.shipping_address.reference}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Método de pago
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {order.payment_method}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Pagado el {formatDate(order.created_at)}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Acciones */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Comprobante
                            </Button>
                            {order.status === 'delivered' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Reordenar
                                </Button>
                            )}
                            {(order.status === 'pending' ||
                                order.status === 'confirmed') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-destructive hover:text-destructive"
                                >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Cancelar pedido
                                </Button>
                            )}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyOrders() {
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

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ orders }: { orders: Order[] }) {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const inProgress = orders.filter((o) =>
        ['pending', 'confirmed', 'shipped'].includes(o.status),
    ).length;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
                { label: 'Total pedidos', value: total, icon: Package },
                { label: 'Entregados', value: delivered, icon: PackageCheck },
                { label: 'En progreso', value: inProgress, icon: Truck },
            ].map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card key={stat.label}>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-md bg-muted p-2">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-base font-bold">
                                    {stat.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = MOCK_ORDERS.filter((order) => {
        const matchSearch =
            !search ||
            order.order_number.toLowerCase().includes(search.toLowerCase()) ||
            order.items.some((i) =>
                i.product_name.toLowerCase().includes(search.toLowerCase()),
            );
        const matchStatus =
            statusFilter === 'all' || order.status === statusFilter;

        return matchSearch && matchStatus;
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 lg:px-8">
                {/* Page header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Mis Pedidos
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Revisa el estado y detalles de todas tus compras
                    </p>
                </div>

                {/* Stats */}
                <StatsBar orders={MOCK_ORDERS} />

                {/* Filtros */}
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
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="confirmed">
                                Confirmado
                            </SelectItem>
                            <SelectItem value="shipped">En camino</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Resultado de filtro */}
                {search || statusFilter !== 'all' ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                        {filtered.length === 0
                            ? 'Sin resultados'
                            : `${filtered.length} pedido${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
                    </p>
                ) : null}

                {/* Lista de pedidos */}
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
