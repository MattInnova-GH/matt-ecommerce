import {
    Eye,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    Phone,
    Mail,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    product_price: number;
    subtotal: number;
    product?: { id: number; name: string; thumbnail: string | null };
}

export interface Payment {
    id: number;
    method: string;
    status: string;
    voucher: string | null;
    transaction_id: string | null;
    receipt_url?: string;
}

export interface OrderUser {
    id: number;
    first_name: string;
    email: string;
    phone?: string;
}

export interface Address {
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export interface Order {
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
    created_at: string;
    user?: OrderUser;
    items?: OrderItem[];
    payment?: Payment;
}

export interface PaginatedOrders {
    data: Order[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

// ── Constantes ─────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        color: string;
        icon: React.ElementType;
    }
> = {
    PENDING: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: () => null,
    },
    ACCEPTED: {
        label: 'Aceptado',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: CheckCircle,
    },
    REJECTED: {
        label: 'Rechazado',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
    },
    SHIPPED: {
        label: 'Enviado',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Truck,
    },
    DELIVERED: {
        label: 'Entregado',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Cancelado',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: XCircle,
    },
};

export const PAYMENT_METHODS: Record<string, string> = {
    credit_card: 'Tarjeta de crédito',
    debit_card: 'Tarjeta de débito',
    paypal: 'PayPal',
    bank_transfer: 'Transferencia bancaria',
    cash: 'Efectivo',
};

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
    order: Order | null;
    open: boolean;
    onClose: () => void;
    onStatusChange: (order: Order, status: Order['status']) => void;
    formatDate: (date: string) => string;
    formatPrice: (price: number) => string;
}

// ── Componente ─────────────────────────────────────────────────────────────────

export default function OrderDetailModal({
    order,
    open,
    onClose,
    onStatusChange,
    formatDate,
    formatPrice,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
                {/* Header */}
                <div className="flex items-start justify-between border-b px-6 py-5">
                    <div>
                        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Pedido
                        </p>
                        <h2 className="mt-0.5 text-xl font-semibold">
                            #{order?.order_number}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {order && formatDate(order.created_at)}
                        </p>
                    </div>
                </div>

                <ScrollArea className="max-h-[calc(90vh-100px)]">
                    {order && (
                        <div className="space-y-4 p-6">
                            {/* Cliente + Envío */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                        Cliente
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                            <span className="truncate">
                                                {order.user?.email}
                                            </span>
                                        </div>
                                        {order.user?.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <span>{order.user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                        Envío
                                    </p>
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <p>
                                                {
                                                    order.shipping_address
                                                        ?.address
                                                }
                                            </p>
                                            {order.shipping_address?.city && (
                                                <p className="text-muted-foreground">
                                                    {
                                                        order.shipping_address
                                                            .city
                                                    }
                                                    {order.shipping_address
                                                        ?.state &&
                                                        `, ${order.shipping_address.state}`}
                                                    {order.shipping_address
                                                        ?.zip &&
                                                        ` ${order.shipping_address.zip}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notas */}
                            {order.notes && (
                                <div className="rounded-lg border border-dashed px-4 py-3 text-sm">
                                    <span className="font-medium">Notas: </span>
                                    <span className="text-muted-foreground">
                                        {order.notes}
                                    </span>
                                </div>
                            )}

                            {/* Productos */}
                            <div className="rounded-lg border">
                                <div className="border-b px-4 py-3">
                                    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
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
                                        {order.items?.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="text-sm"
                                            >
                                                <TableCell className="font-medium">
                                                    {item.product_name}
                                                </TableCell>
                                                <TableCell className="text-center text-muted-foreground">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatPrice(
                                                        item.product_price,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatPrice(item.subtotal)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pago + Totales */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Pago */}
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                        Pago
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Método
                                            </span>
                                            <span className="font-medium">
                                                {PAYMENT_METHODS[
                                                    order.payment?.method || ''
                                                ] ||
                                                    order.payment?.method ||
                                                    'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Estado
                                            </span>
                                            <Badge
                                                variant={
                                                    order.payment?.status ===
                                                    'completed'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {order.payment?.status ===
                                                'completed'
                                                    ? 'Completado'
                                                    : order.payment?.status ||
                                                      'Pendiente'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {order.payment?.receipt_url && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-xs text-muted-foreground">
                                                Comprobante
                                            </p>
                                            <div className="overflow-hidden rounded-md border bg-background">
                                                {order.payment.receipt_url.match(
                                                    /\.(jpg|jpeg|png|gif)$/i,
                                                ) ? (
                                                    <img
                                                        src={`/storage/${order.payment.receipt_url}`}
                                                        alt="Comprobante"
                                                        className="max-h-40 w-full cursor-zoom-in object-contain"
                                                        onClick={() =>
                                                            window.open(
                                                                `/storage/${order.payment?.receipt_url}`,
                                                                '_blank',
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-3 p-3">
                                                        <FileText className="h-6 w-6 text-muted-foreground" />
                                                        <p className="text-sm">
                                                            Documento PDF
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs"
                                                asChild
                                            >
                                                href=
                                                {`/storage/${order.payment.receipt_url}`}
                                                target="_blank" rel="noopener
                                                noreferrer"
                                                <a>
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                    Ver comprobante completo
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Resumen */}
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                        Resumen
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Subtotal
                                            </span>
                                            <span>
                                                {formatPrice(order.subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Impuestos
                                            </span>
                                            <span>
                                                {formatPrice(order.tax)}
                                            </span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span className="text-base">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            {!['DELIVERED', 'CANCELLED', 'REJECTED'].includes(
                                order.status,
                            ) && (
                                <div className="rounded-lg border p-4">
                                    <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                        Acciones
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        onStatusChange(
                                                            order,
                                                            'ACCEPTED',
                                                        )
                                                    }
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="mr-1.5 h-4 w-4" />
                                                    Aceptar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        onStatusChange(
                                                            order,
                                                            'REJECTED',
                                                        )
                                                    }
                                                    variant="destructive"
                                                >
                                                    <XCircle className="mr-1.5 h-4 w-4" />
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'ACCEPTED' && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    onStatusChange(
                                                        order,
                                                        'SHIPPED',
                                                    )
                                                }
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                <Truck className="mr-1.5 h-4 w-4" />
                                                Marcar como enviado
                                            </Button>
                                        )}
                                        {order.status === 'SHIPPED' && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    onStatusChange(
                                                        order,
                                                        'DELIVERED',
                                                    )
                                                }
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-1.5 h-4 w-4" />
                                                Marcar como entregado
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                onStatusChange(
                                                    order,
                                                    'CANCELLED',
                                                )
                                            }
                                            variant="outline"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <XCircle className="mr-1.5 h-4 w-4" />
                                            Cancelar pedido
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
