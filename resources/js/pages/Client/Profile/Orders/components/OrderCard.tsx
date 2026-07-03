import { useState } from 'react';
import {
    Package,
    ChevronDown,
    MapPin,
    CreditCard,
    Download,
    RotateCcw,
    XCircle,
    Calendar,
    Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import StatusBadge from './StatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatCurrency, formatDate } from '../utils';
import type { Order } from '../types';

function ProductThumbnail({
    thumbnail,
    name,
}: {
    thumbnail: string | null;
    name: string;
}) {
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
            {thumbnail ? (
                <img
                    src={`/storage/${thumbnail}`}
                    alt={name}
                    className="h-full w-full rounded-lg object-cover"
                />
            ) : (
                <Package className="h-5 w-5 text-muted-foreground/40" />
            )}
        </div>
    );
}

function OrderSummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-sm text-muted-foreground">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

export default function OrderCard({ order }: { order: Order }) {
    const [open, setOpen] = useState(false);

    const previewItems = order.items.slice(0, 2);
    const remainingCount = order.items.length - previewItems.length;

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <button className="w-full text-left">
                        <div className="p-5">
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

                <CollapsibleContent>
                    <Separator />
                    <div className="space-y-6 p-5">
                        {/* Seguimiento */}
                        <section>
                            <h4 className="mb-4 text-sm font-semibold">
                                Seguimiento del pedido
                            </h4>
                            <OrderTimeline order={order} />
                        </section>

                        <Separator />

                        {/* Productos */}
                        <section>
                            <h4 className="mb-3 text-sm font-semibold">
                                Productos
                            </h4>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3"
                                    >
                                        <ProductThumbnail
                                            thumbnail={item.product_thumbnail}
                                            name={item.product_name}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.quantity} ×{' '}
                                                {formatCurrency(
                                                    item.product_price,
                                                )}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-1.5 rounded-lg border bg-muted/30 p-3">
                                <OrderSummaryRow
                                    label="Subtotal"
                                    value={formatCurrency(order.subtotal)}
                                />
                                <OrderSummaryRow
                                    label="Impuestos"
                                    value={formatCurrency(order.tax)}
                                />
                                <Separator className="my-1.5" />
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Dirección + Pago */}
                        <section className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {order.shipping_address
                                        ? 'Dirección de envío'
                                        : 'Entrega'}
                                </h4>
                                <div className="space-y-0.5 text-sm text-muted-foreground">
                                    {order.shipping_address ? (
                                        <>
                                            <p className="font-medium text-foreground">
                                                {
                                                    order.shipping_address
                                                        .recipientName
                                                }
                                            </p>
                                            <p>
                                                {
                                                    order.shipping_address
                                                        .address
                                                }
                                            </p>
                                            <p>
                                                {
                                                    order.shipping_address
                                                        .phone
                                                }
                                            </p>
                                            {order.shipping_address
                                                .reference && (
                                                <p className="text-xs italic">
                                                    Ref:{' '}
                                                    {
                                                        order.shipping_address
                                                            .reference
                                                    }
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p>Recojo en tienda</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Método de pago
                                </h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {order.payment_method ?? 'No especificado'}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Pedido realizado el{' '}
                                    {formatDate(order.created_at)}
                                </p>
                            </div>
                        </section>

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
                            {order.status === 'DELIVERED' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Reordenar
                                </Button>
                            )}
                            {(order.status === 'PENDING' ||
                                order.status === 'ACCEPTED') && (
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
