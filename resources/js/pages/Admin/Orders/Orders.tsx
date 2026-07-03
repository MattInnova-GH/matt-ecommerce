import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import type { User } from 'lucide-react';
import {
    Eye,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Truck,
    Package,
    MapPin,
    Phone,
    FileText,
    SlidersHorizontal,
    TrendingUp,
    Clock,
    CircleX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import admin from '@/routes/admin';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────
interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
    product?: { id: number; name: string; thumbnail: string | null };
}
interface Payment {
    id: number;
    method: string;
    status: string;
    voucher: string | null;
    receipt_url?: string;
    transaction_id: string | null;
}
interface User {
    id: number;
    first_name: string;
    email: string;
    phone?: string;
}
interface Address {
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}
interface Order {
    id: number;
    order_number: string;
    user_id: number;
    subtotal: number;
    tax: number;
    total: number;
    status:
        | 'PENDING'
        | 'ACCEPTED'
        | 'REJECTED'
        | 'SHIPPED'
        | 'DELIVERED'
        | 'CANCELLED';
    shipping_address: Address;
    notes: string | null;
    rejection_reason: string | null;
    created_at: string;
    user?: User;
    items?: OrderItem[];
    payment?: Payment;
}
interface PaginatedOrders {
    data: Order[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}
interface Props {
    orders: PaginatedOrders;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        variant: string;
        dotColor: string;
        icon: React.ElementType;
    }
> = {
    PENDING: {
        label: 'Pendiente',
        variant: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-400',
        icon: Clock,
    },
    ACCEPTED: {
        label: 'Aceptado',
        variant: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-400',
        icon: CheckCircle,
    },
    REJECTED: {
        label: 'Rechazado',
        variant: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-400',
        icon: XCircle,
    },
    SHIPPED: {
        label: 'Enviado',
        variant: 'bg-violet-50 text-violet-700 border-violet-200',
        dotColor: 'bg-violet-400',
        icon: Truck,
    },
    DELIVERED: {
        label: 'Entregado',
        variant: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-400',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Cancelado',
        variant: 'bg-gray-100 text-gray-500 border-gray-200',
        dotColor: 'bg-gray-400',
        icon: CircleX,
    },
};
const PAYMENT_METHODS: Record<string, string> = {
    credit_card: 'Tarjeta de crédito',
    debit_card: 'Tarjeta de débito',
    paypal: 'PayPal',
    bank_transfer: 'Transferencia',
    cash: 'Efectivo',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'PEN',
    }).format(price);

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                cfg.variant,
            )}
        >
            <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dotColor)} />
            {cfg.label}
        </span>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
    colorClass,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    colorClass: string;
}) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex items-stretch">
                    <div
                        className={cn(
                            'flex w-1.5 shrink-0 rounded-l-xl',
                            colorClass,
                        )}
                    />
                    <div className="flex flex-1 items-center justify-between p-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-1 text-2xl font-bold tracking-tight">
                                {value}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full',
                                colorClass + '/10',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'h-5 w-5',
                                    colorClass.replace('bg-', 'text-'),
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Filter panel (shared between mobile sheet & desktop inline) ─────────────────
function FilterPanel({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    clearFilters,
}: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    hasActiveFilters: boolean;
    clearFilters: () => void;
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por N° pedido, cliente o correo…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 pl-9 text-sm"
                />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full text-sm sm:w-44">
                    <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                            {v.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 text-muted-foreground hover:text-foreground"
                >
                    Limpiar
                </Button>
            )}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Orders({ orders: initialOrders }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [reasonPrompt, setReasonPrompt] = useState<{
        order: Order;
        status: 'REJECTED' | 'CANCELLED';
    } | null>(null);
    const [reasonText, setReasonText] = useState('');

    const filtered = initialOrders.data.filter((order) => {
        const matchSearch =
            order.order_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.user?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            statusFilter === 'all' || order.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

    const handleStatusChange = (
        order: Order,
        newStatus: Order['status'],
        rejectionReason?: string,
    ) => {
        router.put(
            admin.orders.update(order.id),
            {
                status: newStatus,
                ...(rejectionReason
                    ? { rejection_reason: rejectionReason }
                    : {}),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Pedido ${order.order_number} → ${STATUS_CONFIG[newStatus].label}`,
                    );
                    setIsDetailOpen(false);
                },
                onError: () => toast.error('Error al actualizar el pedido'),
            },
        );
    };

    const openReasonPrompt = (
        order: Order,
        status: 'REJECTED' | 'CANCELLED',
    ) => {
        setReasonText('');
        setReasonPrompt({ order, status });
    };

    const confirmReasonPrompt = () => {
        if (!reasonPrompt || !reasonText.trim()) {
            toast.error('Debes escribir un motivo');
            return;
        }

        handleStatusChange(
            reasonPrompt.order,
            reasonPrompt.status,
            reasonText.trim(),
        );
        setReasonPrompt(null);
        setReasonText('');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    const openOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    return (
        <TooltipProvider>
            <div className="mx-auto max-w-7xl space-y-6 pb-10">
                {/* ── Page Header ──────────────────────────────────────────── */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            Ecommerce
                        </p>
                        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">
                            Órdenes
                        </h1>
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        {initialOrders.total} total
                    </Badge>
                </div>

                {/* ── Stat Cards ───────────────────────────────────────────── */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total de órdenes"
                        value={initialOrders.total}
                        icon={Package}
                        colorClass="bg-slate-500"
                    />
                    <StatCard
                        label="Pendientes"
                        value={
                            initialOrders.data.filter(
                                (o) => o.status === 'PENDING',
                            ).length
                        }
                        icon={Clock}
                        colorClass="bg-amber-500"
                    />
                    <StatCard
                        label="Enviados"
                        value={
                            initialOrders.data.filter(
                                (o) => o.status === 'SHIPPED',
                            ).length
                        }
                        icon={Truck}
                        colorClass="bg-violet-500"
                    />
                    <StatCard
                        label="Entregados"
                        value={
                            initialOrders.data.filter(
                                (o) => o.status === 'DELIVERED',
                            ).length
                        }
                        icon={CheckCircle}
                        colorClass="bg-emerald-500"
                    />
                </div>

                {/* ── Filters ──────────────────────────────────────────────── */}
                {/* Mobile */}
                <div className="block lg:hidden">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Filtros
                                {hasActiveFilters && (
                                    <Badge className="h-4 px-1.5 text-[10px]">
                                        {
                                            [
                                                searchTerm,
                                                statusFilter !== 'all',
                                            ].filter(Boolean).length
                                        }
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="bottom"
                            className="rounded-t-2xl pb-8"
                        >
                            <SheetHeader className="mb-4">
                                <SheetTitle className="text-base">
                                    Filtrar órdenes
                                </SheetTitle>
                            </SheetHeader>
                            <FilterPanel
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                hasActiveFilters={hasActiveFilters}
                                clearFilters={clearFilters}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop */}
                <Card className="hidden lg:block">
                    <CardContent className="px-5 py-4">
                        <FilterPanel
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            hasActiveFilters={hasActiveFilters}
                            clearFilters={clearFilters}
                        />
                    </CardContent>
                </Card>

                {/* Results count */}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        {filtered.length === initialOrders.data.length ? (
                            <>
                                <span className="font-medium text-foreground">
                                    {filtered.length}
                                </span>{' '}
                                órdenes
                            </>
                        ) : (
                            <>
                                <span className="font-medium text-foreground">
                                    {filtered.length}
                                </span>{' '}
                                de {initialOrders.data.length} órdenes
                            </>
                        )}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                        >
                            Quitar filtros
                        </button>
                    )}
                </div>

                {/* ── Table (desktop) ───────────────────────────────────────── */}
                <Card className="hidden overflow-hidden lg:block">
                    <ScrollArea className="h-[520px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 hover:bg-muted/40">
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        N° Pedido
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        Cliente
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        Pago
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        Estado
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold tracking-wide uppercase">
                                        Fecha
                                    </TableHead>
                                    <TableHead className="w-14" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="font-medium">
                                                    Sin resultados
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    No hay órdenes con los
                                                    filtros aplicados
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="group cursor-pointer"
                                            onClick={() => openOrder(order)}
                                        >
                                            <TableCell>
                                                <span className="font-mono text-sm font-semibold text-foreground">
                                                    #{order.order_number}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                        {order.user?.first_name?.[0]?.toUpperCase() ??
                                                            '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm leading-tight font-medium">
                                                            {order.user
                                                                ?.first_name ??
                                                                'N/A'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {order.user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-semibold">
                                                    {formatPrice(order.total)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {PAYMENT_METHODS[
                                                        order.payment?.method ??
                                                            ''
                                                    ] ??
                                                        order.payment?.method ??
                                                        '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={order.status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDate(order.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openOrder(order);
                                                    }}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </Card>

                {/* ── Cards (mobile) ────────────────────────────────────────── */}
                <div className="grid gap-3 lg:hidden">
                    {filtered.map((order) => (
                        <Card
                            key={order.id}
                            className="cursor-pointer transition-shadow hover:shadow-md"
                            onClick={() => openOrder(order)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-mono text-sm font-bold">
                                            #{order.order_number}
                                        </p>
                                        <p className="mt-0.5 text-sm font-medium">
                                            {order.user?.first_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.user?.email}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">
                                        {formatPrice(order.total)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Pagination ────────────────────────────────────────────── */}
                {initialOrders.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-xs text-muted-foreground">
                            Mostrando{' '}
                            <span className="font-medium">
                                {initialOrders.from}–{initialOrders.to}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">
                                {initialOrders.total}
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {initialOrders.links.map((link, i) => {
                                const isPrev = link.label.includes('Anterior');
                                const isNext = link.label.includes('Siguiente');
                                const label = link.label
                                    .replace(/&laquo;|&raquo;/g, '')
                                    .trim();
                                if (isPrev || isNext)
                                    return (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <a href={link.url}>
                                                    {isPrev ? (
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    )}
                                                </a>
                                            ) : isPrev ? (
                                                <ChevronLeft className="h-3.5 w-3.5" />
                                            ) : (
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            )}
                                        </Button>
                                    );
                                if (label === '...')
                                    return (
                                        <Button
                                            key={i}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground"
                                            disabled
                                        >
                                            …
                                        </Button>
                                    );
                                return (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        className="h-8 min-w-8 px-2.5 text-xs"
                                        disabled={!link.url}
                                        asChild={!!link.url && !link.active}
                                    >
                                        {link.url && !link.active ? (
                                            <a href={link.url}>{label}</a>
                                        ) : (
                                            <span>{label}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Order Detail Modal ────────────────────────────────────── */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-h-[92vh] max-w-3xl! gap-0 overflow-hidden p-0">
                        {selectedOrder && (
                            <>
                                {/* Modal Header */}
                                <div className="flex items-start justify-between border-b bg-muted/30 px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                <h2 className="text-base font-semibold tracking-tight">
                                                    #
                                                    {selectedOrder.order_number}
                                                </h2>
                                                <StatusBadge
                                                    status={
                                                        selectedOrder.status
                                                    }
                                                />
                                            </div>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {formatDate(
                                                    selectedOrder.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <ScrollArea className="max-h-[calc(92vh-80px)]">
                                    <div className="space-y-5 p-6">
                                        {/* Customer + Shipping */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Cliente
                                                </p>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                        {selectedOrder.user?.first_name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold">
                                                            {
                                                                selectedOrder
                                                                    .user
                                                                    ?.first_name
                                                            }
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {
                                                                selectedOrder
                                                                    .user?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedOrder.user?.phone && (
                                                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Phone className="h-3 w-3 shrink-0" />
                                                        {
                                                            selectedOrder.user
                                                                .phone
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="mb-2.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Envío
                                                </p>
                                                <div className="flex items-start gap-1.5 text-sm">
                                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedOrder
                                                                    .shipping_address
                                                                    ?.address
                                                            }
                                                        </p>
                                                        {selectedOrder
                                                            .shipping_address
                                                            ?.city && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    selectedOrder
                                                                        .shipping_address
                                                                        .city
                                                                }
                                                                {selectedOrder
                                                                    .shipping_address
                                                                    ?.state &&
                                                                    `, ${selectedOrder.shipping_address.state}`}
                                                                {selectedOrder
                                                                    .shipping_address
                                                                    ?.zip &&
                                                                    ` ${selectedOrder.shipping_address.zip}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {selectedOrder.notes && (
                                            <div className="flex items-start gap-2 rounded-xl border border-dashed px-4 py-3 text-sm">
                                                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <div>
                                                    <span className="font-medium">
                                                        Nota:{' '}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {selectedOrder.notes}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rejection / cancellation reason */}
                                        {selectedOrder.rejection_reason && (
                                            <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm">
                                                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                                                <div>
                                                    <span className="font-medium text-destructive">
                                                        Motivo{' '}
                                                        {selectedOrder.status ===
                                                        'CANCELLED'
                                                            ? 'de cancelación'
                                                            : 'de rechazo'}
                                                        :{' '}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {
                                                            selectedOrder.rejection_reason
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Products */}
                                        <div className="overflow-hidden rounded-xl border">
                                            <div className="border-b bg-muted/30 px-4 py-2.5">
                                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Productos
                                                </p>
                                            </div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="text-xs">
                                                            Producto
                                                        </TableHead>
                                                        <TableHead className="text-center text-xs">
                                                            Cant.
                                                        </TableHead>
                                                        <TableHead className="text-right text-xs">
                                                            Precio
                                                        </TableHead>
                                                        <TableHead className="text-right text-xs">
                                                            Subtotal
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedOrder.items?.map(
                                                        (item) => (
                                                            <TableRow
                                                                key={item.id}
                                                            >
                                                                <TableCell className="text-sm font-medium">
                                                                    {
                                                                        item.product_name
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-center text-sm text-muted-foreground">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                                    {formatPrice(
                                                                        item.product_price,
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right text-sm font-semibold">
                                                                    {formatPrice(
                                                                        item.subtotal,
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Payment + Summary */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {/* Payment */}
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Pago
                                                </p>
                                                <div className="space-y-2.5 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                            Método
                                                        </span>
                                                        <span className="font-medium">
                                                            {PAYMENT_METHODS[
                                                                selectedOrder
                                                                    .payment
                                                                    ?.method ??
                                                                    ''
                                                            ] ??
                                                                selectedOrder
                                                                    .payment
                                                                    ?.method ??
                                                                '—'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                            Estado
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                selectedOrder
                                                                    .payment
                                                                    ?.status ===
                                                                'completed'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {selectedOrder
                                                                .payment
                                                                ?.status ===
                                                            'completed'
                                                                ? 'Completado'
                                                                : (selectedOrder
                                                                      .payment
                                                                      ?.status ??
                                                                  'Pendiente')}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {selectedOrder.payment
                                                    ?.receipt_url && (
                                                    <div className="mt-3 space-y-2">
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            Comprobante
                                                        </p>
                                                        {selectedOrder.payment.receipt_url.match(
                                                            /\.(jpg|jpeg|png|gif)$/i,
                                                        ) ? (
                                                            <img
                                                                src={`/storage/${selectedOrder.payment.receipt_url}`}
                                                                alt="Comprobante"
                                                                className="max-h-32 w-full cursor-zoom-in rounded-lg border object-contain"
                                                                onClick={() =>
                                                                    window.open(
                                                                        `/storage/${selectedOrder.payment.receipt_url}`,
                                                                        '_blank',
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="flex items-center gap-2.5 rounded-lg border p-3">
                                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                                <span className="text-sm">
                                                                    Documento
                                                                    PDF
                                                                </span>
                                                            </div>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full text-xs"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`/storage/${selectedOrder.payment.receipt_url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Eye className="mr-1.5 h-3 w-3" />
                                                                Ver comprobante
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Summary */}
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Resumen
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            Subtotal
                                                        </span>
                                                        <span>
                                                            {formatPrice(
                                                                selectedOrder.subtotal,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">
                                                            Impuestos
                                                        </span>
                                                        <span>
                                                            {formatPrice(
                                                                selectedOrder.tax,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Separator className="my-1" />
                                                    <div className="flex justify-between font-bold">
                                                        <span>Total</span>
                                                        <span className="text-base">
                                                            {formatPrice(
                                                                selectedOrder.total,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Actions */}
                                        {![
                                            'DELIVERED',
                                            'CANCELLED',
                                            'REJECTED',
                                        ].includes(selectedOrder.status) && (
                                            <div className="rounded-xl border bg-muted/10 p-4">
                                                <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Actualizar estado
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedOrder.status ===
                                                        'PENDING' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        selectedOrder,
                                                                        'ACCEPTED',
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5" />{' '}
                                                                Aceptar pedido
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="gap-1.5"
                                                                onClick={() =>
                                                                    openReasonPrompt(
                                                                        selectedOrder,
                                                                        'REJECTED',
                                                                    )
                                                                }
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />{' '}
                                                                Rechazar
                                                            </Button>
                                                        </>
                                                    )}
                                                    {selectedOrder.status ===
                                                        'ACCEPTED' && (
                                                        <Button
                                                            size="sm"
                                                            className="gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    selectedOrder,
                                                                    'SHIPPED',
                                                                )
                                                            }
                                                        >
                                                            <Truck className="h-3.5 w-3.5" />{' '}
                                                            Marcar como enviado
                                                        </Button>
                                                    )}
                                                    {selectedOrder.status ===
                                                        'SHIPPED' && (
                                                        <Button
                                                            size="sm"
                                                            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    selectedOrder,
                                                                    'DELIVERED',
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="h-3.5 w-3.5" />{' '}
                                                            Marcar como
                                                            entregado
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            openReasonPrompt(
                                                                selectedOrder,
                                                                'CANCELLED',
                                                            )
                                                        }
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />{' '}
                                                        Cancelar pedido
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Reason prompt for rejecting/cancelling an order */}
                <Dialog
                    open={reasonPrompt !== null}
                    onOpenChange={(open) => !open && setReasonPrompt(null)}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {reasonPrompt?.status === 'CANCELLED'
                                    ? 'Cancelar pedido'
                                    : 'Rechazar pedido'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Explica el motivo. Se guardará en el pedido
                                como evidencia y se enviará por correo al
                                cliente.
                            </p>
                            <Textarea
                                value={reasonText}
                                onChange={(e) =>
                                    setReasonText(e.target.value)
                                }
                                placeholder="Ej: No se pudo verificar el comprobante de pago enviado."
                                rows={4}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setReasonPrompt(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmReasonPrompt}
                                disabled={!reasonText.trim()}
                            >
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
