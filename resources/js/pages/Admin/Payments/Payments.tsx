import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Eye,
    CheckCircle,
    XCircle,
    Search,
    FileText,
    Download,
    CreditCard,
    Banknote,
    Wallet,
    RefreshCw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Order {
    id: number;
    user?: {
        id: number;
        first_name: string;
        email: string;
    };
}

interface Payment {
    id: number;
    order_id: number;
    method: string;
    amount: string | number;
    receipt_url: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at: string;
    order?: Order;
}

interface PaginatedPayments {
    data: Payment[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

interface PaymentsProps {
    payments: PaginatedPayments;
}

function StatusBadge({ status }: { status: Payment['status'] }) {
    const variants = {
        PENDING: {
            label: 'Pendiente',
            className: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: <RefreshCw className="h-3 w-3" />,
        },
        APPROVED: {
            label: 'Aprobado',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: <CheckCircle className="h-3 w-3" />,
        },
        REJECTED: {
            label: 'Rechazado',
            className: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: <XCircle className="h-3 w-3" />,
        },
    };

    const variant = variants[status] || variants.PENDING;

    return (
        <Badge variant="outline" className={`gap-1.5 ${variant.className}`}>
            {variant.icon}
            {variant.label}
        </Badge>
    );
}

function MethodIcon({ method }: { method: string }) {
    const methods: Record<string, { icon: React.ReactNode; label: string }> = {
        bank_transfer: {
            icon: <Banknote className="h-4 w-4" />,
            label: 'Transferencia bancaria',
        },

        yape: {
            icon: <Wallet className="h-4 w-4" />,
            label: 'Yape',
        },
        plin: {
            icon: <Wallet className="h-4 w-4" />,
            label: 'Plin',
        },
    };

    const defaultMethod = {
        icon: <CreditCard className="h-4 w-4" />,
        label: method,
    };

    const selected = methods[method] || defaultMethod;

    return (
        <div className="flex items-center gap-2">
            {selected.icon}
            <span className="capitalize">{selected.label}</span>
        </div>
    );
}

export default function Payments({ payments }: PaymentsProps) {
    console.log('PAYMENTS', payments);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null,
    );
    const [showReceiptDialog, setShowReceiptDialog] = useState(false);

    const filtered = payments.data.filter((payment) => {
        const matchSearch =
            payment.order?.user?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.order?.id.toString().includes(searchTerm) ||
            payment.id.toString().includes(searchTerm);

        const matchStatus =
            statusFilter === 'all' || payment.status === statusFilter;
        const matchMethod =
            methodFilter === 'all' || payment.method === methodFilter;

        return matchSearch && matchStatus && matchMethod;
    });

    const paginationLinks = payments.links.filter(
        (_, i) => i !== 0 && i !== payments.links.length - 1,
    );
    const prevLink = payments.links[0];
    const nextLink = payments.links[payments.links.length - 1];

    const stats = {
        total: payments.total,
        pending: payments.data.filter((p) => p.status === 'PENDING').length,
        approved: payments.data.filter((p) => p.status === 'APPROVED').length,
        rejected: payments.data.filter((p) => p.status === 'REJECTED').length,
        totalAmount: payments.data.reduce((sum, p) => {
            const amount =
                typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount;

            return sum + amount;
        }, 0),
    };

    const handleApprove = (payment: Payment) => {
        router.put(`/admin/payments/${payment.id}`, {
            status: 'APPROVED',
        });
    };

    const handleReject = (payment: Payment) => {
        router.put(`/admin/payments/${payment.id}`, {
            status: 'REJECTED',
        });
    };

    const handleDelete = (payment: Payment) => {
        if (confirm('¿Estás seguro de eliminar este pago?')) {
            router.delete(`/admin/payments/${payment.id}`);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    };

    return (
        <TooltipProvider>
            <ScrollArea className="h-full">
                <div className="mx-auto max-w-350 p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Pagos
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gestiona los pagos de tu tienda
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <Card className="border-l-4 border-l-slate-500 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                            Total pagos
                                        </p>
                                        <p className="mt-1 text-2xl font-bold">
                                            {stats.total}
                                        </p>
                                    </div>
                                    <FileText className="h-7 w-7 text-muted-foreground/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-amber-500 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                            Pendientes
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-amber-600">
                                            {stats.pending}
                                        </p>
                                    </div>
                                    <RefreshCw className="h-7 w-7 text-amber-500/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                            Aprobados
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-emerald-600">
                                            {stats.approved}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-7 w-7 text-emerald-500/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-rose-500 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                            Rechazados
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-rose-600">
                                            {stats.rejected}
                                        </p>
                                    </div>
                                    <XCircle className="h-7 w-7 text-rose-500/50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">
                                            Total recaudado
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-blue-600">
                                            {formatAmount(stats.totalAmount)}
                                        </p>
                                    </div>
                                    <CreditCard className="h-7 w-7 text-blue-500/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtros */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por pedido o cliente..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-45">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="PENDING">
                                        Pendiente
                                    </SelectItem>
                                    <SelectItem value="APPROVED">
                                        Aprobado
                                    </SelectItem>
                                    <SelectItem value="REJECTED">
                                        Rechazado
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={methodFilter}
                                onValueChange={setMethodFilter}
                            >
                                <SelectTrigger className="w-50">
                                    <SelectValue placeholder="Método de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>

                                    <SelectItem value="bank_transfer">
                                        Transferencia
                                    </SelectItem>

                                    <SelectItem value="yape">Yape</SelectItem>
                                    <SelectItem value="plin">Plin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tabla */}
                    <Card className="overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b bg-muted/30">
                                        <TableHead>Pedido ID</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Método</TableHead>
                                        <TableHead>Orden de Compra</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((payment) => (
                                        <TableRow
                                            key={payment.id}
                                            className="hover:bg-muted/20"
                                        >
                                            <TableCell className="font-medium">
                                                #{payment.order_id}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {payment.order?.user
                                                            ?.first_name ||
                                                            'N/A'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {payment.order?.user
                                                            ?.email ||
                                                            'Sin email'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold">
                                                    {formatAmount(
                                                        payment.amount as number,
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <MethodIcon
                                                    method={payment.method}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {payment.receipt_url ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPayment(
                                                                payment,
                                                            );
                                                            setShowReceiptDialog(
                                                                true,
                                                            );
                                                        }}
                                                        className="gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver
                                                    </Button>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1"
                                                    >
                                                        <AlertCircle className="h-3 w-3" />
                                                        Sin comprobante
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={payment.status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(payment.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Abrir menú
                                                            </span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48"
                                                    >
                                                        {payment.status ===
                                                            'PENDING' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-600"
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            payment,
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCircle className="h-4 w-4" />
                                                                    Aprobar pago
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer gap-2 text-rose-600 focus:text-rose-600"
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            payment,
                                                                        )
                                                                    }
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                    Rechazar
                                                                    pago
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}
                                                        {payment.receipt_url && (
                                                            <DropdownMenuItem
                                                                className="cursor-pointer gap-2"
                                                                onClick={() => {
                                                                    setSelectedPayment(
                                                                        payment,
                                                                    );
                                                                    setShowReceiptDialog(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                Ver orden de compra
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    payment,
                                                                )
                                                            }
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-muted/50 p-4">
                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    No hay pagos
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    No se encontraron pagos con los filtros
                                    aplicados.
                                </p>
                            </div>
                        )}

                        {/* Paginación */}
                        {payments.links.length > 3 && (
                            <div className="flex items-center justify-between border-t px-6 py-4">
                                <span className="text-sm text-muted-foreground">
                                    Mostrando {payments.from}-{payments.to} de{' '}
                                    {payments.total}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!prevLink.url}
                                        asChild={!!prevLink.url}
                                        className="gap-1"
                                    >
                                        {prevLink.url ? (
                                            <a href={prevLink.url}>
                                                <ChevronLeft className="h-4 w-4" />
                                                Anterior
                                            </a>
                                        ) : (
                                            <>
                                                <ChevronLeft className="h-4 w-4" />
                                                Anterior
                                            </>
                                        )}
                                    </Button>
                                    {paginationLinks.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url && !link.active}
                                            className="min-w-9"
                                        >
                                            {link.url && !link.active ? (
                                                <a
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!nextLink.url}
                                        asChild={!!nextLink.url}
                                        className="gap-1"
                                    >
                                        {nextLink.url ? (
                                            <a href={nextLink.url}>
                                                Siguiente
                                                <ChevronRight className="h-4 w-4" />
                                            </a>
                                        ) : (
                                            <>
                                                Siguiente
                                                <ChevronRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Dialog para ver comprobante */}
                    <Dialog
                        open={showReceiptDialog}
                        onOpenChange={setShowReceiptDialog}
                    >
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Orden de Compra</DialogTitle>
                                <DialogDescription>
                                    Pedido #{selectedPayment?.order_id} -{' '}
                                    {formatAmount(
                                        selectedPayment?.amount as number,
                                    )}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                                {selectedPayment?.receipt_url && (
                                    <div className="overflow-hidden rounded-lg border">
                                        <img
                                            src={`/storage/${selectedPayment.receipt_url}`}
                                            alt="Comprobante de pago"
                                            className="h-auto w-full"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowReceiptDialog(false)}
                                >
                                    Cerrar
                                </Button>
                                {selectedPayment?.receipt_url && (
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            window.open(
                                                `/storage/${selectedPayment.receipt_url}`,
                                                '_blank',
                                            );
                                        }}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Descargar
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </ScrollArea>
        </TooltipProvider>
    );
}
