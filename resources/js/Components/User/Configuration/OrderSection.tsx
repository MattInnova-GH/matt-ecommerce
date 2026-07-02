import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    ShoppingBag,
    Package,
    Calendar,
    CreditCard,
    FileText,
    ChevronRight,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    MapPin,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { Order } from './types/settings';

interface OrderSectionProps {
    orders: Order[];
}

const statusConfig: Record<
    string,
    {
        label: string;
        icon: React.ElementType;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        step: number;
    }
> = {
    PENDING: {
        label: 'Pendiente',
        icon: Clock,
        variant: 'secondary',
        step: 1,
    },
    ACCEPTED: {
        label: 'Aceptado',
        icon: CheckCircle,
        variant: 'default',
        step: 2,
    },
    SHIPPED: {
        label: 'Enviado',
        icon: Truck,
        variant: 'default',
        step: 3,
    },
    DELIVERED: {
        label: 'Entregado',
        icon: CheckCircle,
        variant: 'default',
        step: 4,
    },
    REJECTED: {
        label: 'Rechazado',
        icon: XCircle,
        variant: 'destructive',
        step: 0,
    },
    CANCELLED: {
        label: 'Cancelado',
        icon: XCircle,
        variant: 'destructive',
        step: 0,
    },
};

export function OrderSection({ orders }: OrderSectionProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
        }).format(price);
    };

    const getOrderProgress = (status: string) => {
        const config = statusConfig[status];

        if (!config || config.step === 0) {
            return 0;
        }

        return (config.step / 4) * 100;
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Mis Pedidos
                    </h2>
                    <p className="text-muted-foreground">
                        Gestiona y da seguimiento a tus compras
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="gap-2 px-3 py-1">
                        <Package className="h-3 w-3" />
                        Total: {orders.length}
                    </Badge>
                </div>
            </div>
            <Separator />

            {orders.length === 0 ? (
                /* Empty State Mejorado */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
                        <div className="relative rounded-full bg-muted p-6">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                        Aún no hay pedidos
                    </h3>
                    <p className="mb-6 max-w-md text-muted-foreground">
                        Descubre nuestros productos y comienza a disfrutar de
                        una experiencia de compra única
                    </p>
                    <Button
                        onClick={() => router.visit('/productos')}
                        className="gap-2"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Explorar productos
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                /* Orders Grid */
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const config =
                            statusConfig[order.status] || statusConfig.PENDING;
                        const StatusIcon = config.icon;
                        const progress = getOrderProgress(order.status);
                        const totalItems = order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                        );

                        return (
                            <Card
                                key={order.id}
                                className="group cursor-pointer overflow-hidden transition-all hover:shadow-md"
                                onClick={() => setSelectedOrder(order)}
                            >
                                {/* Order Header */}
                                <CardHeader className="border-b bg-muted/30 p-4">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono text-xs"
                                                >
                                                    #{order.order_number}
                                                </Badge>
                                                <Badge
                                                    variant={config.variant}
                                                    className="gap-1.5"
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {config.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    {totalItems}{' '}
                                                    {totalItems === 1
                                                        ? 'producto'
                                                        : 'productos'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    Total
                                                </p>
                                                <p className="text-xl font-bold">
                                                    {formatPrice(order.total)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                            >
                                                Detalles
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Order Progress */}
                                {progress > 0 && (
                                    <div className="px-4 pt-4">
                                        <Progress
                                            value={progress}
                                            className="h-1.5"
                                        />
                                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                            <span
                                                className={
                                                    config.step >= 1
                                                        ? 'font-medium text-foreground'
                                                        : ''
                                                }
                                            >
                                                Orden creada
                                            </span>
                                            <span
                                                className={
                                                    config.step >= 2
                                                        ? 'font-medium text-foreground'
                                                        : ''
                                                }
                                            >
                                                Confirmado
                                            </span>
                                            <span
                                                className={
                                                    config.step >= 3
                                                        ? 'font-medium text-foreground'
                                                        : ''
                                                }
                                            >
                                                En camino
                                            </span>
                                            <span
                                                className={
                                                    config.step >= 4
                                                        ? 'font-medium text-foreground'
                                                        : ''
                                                }
                                            >
                                                Entregado
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Products Preview */}
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {order.items
                                                .slice(0, 3)
                                                .map((item, idx) => (
                                                    <Avatar
                                                        key={idx}
                                                        className="h-10 w-10 border-2 border-background"
                                                    >
                                                        <AvatarImage
                                                            src={
                                                                item.product
                                                                    ?.thumbnail
                                                                    ? item.product.thumbnail.startsWith(
                                                                          'http',
                                                                      )
                                                                        ? item
                                                                              .product
                                                                              .thumbnail
                                                                        : `/storage/${item.product.thumbnail}`
                                                                    : undefined
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-muted text-xs">
                                                            {item.product_name.charAt(
                                                                0,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                            {order.items.length > 3 && (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {order.items
                                                    .slice(0, 2)
                                                    .map(
                                                        (item) =>
                                                            item.product_name,
                                                    )
                                                    .join(', ')}
                                                {order.items.length > 2 &&
                                                    ` y ${order.items.length - 2} más`}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Order Detail Dialog - Diseño tipo dashboard */}
            <Dialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            >
                <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
                    {selectedOrder && (
                        <>
                            {/* Dialog Header con gradiente */}
                            <div className="border-b bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
                                <DialogHeader className="space-y-3">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <DialogTitle className="mb-1 text-2xl">
                                                Pedido #
                                                {selectedOrder.order_number}
                                            </DialogTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(
                                                    selectedOrder.created_at,
                                                )}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                statusConfig[
                                                    selectedOrder.status
                                                ]?.variant || 'secondary'
                                            }
                                            className="gap-1.5 px-3 py-1.5 text-sm"
                                        >
                                            {(() => {
                                                const Icon =
                                                    statusConfig[
                                                        selectedOrder.status
                                                    ]?.icon || Clock;

                                                return (
                                                    <Icon className="h-3.5 w-3.5" />
                                                );
                                            })()}
                                            {statusConfig[selectedOrder.status]
                                                ?.label || 'Pendiente'}
                                        </Badge>
                                    </div>
                                </DialogHeader>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <Tabs
                                    defaultValue="details"
                                    className="space-y-4"
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="details">
                                            Detalles
                                        </TabsTrigger>
                                        <TabsTrigger value="products">
                                            Productos
                                        </TabsTrigger>
                                        <TabsTrigger value="payment">
                                            Pago
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="details"
                                        className="space-y-4"
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Package className="h-4 w-4" />
                                                    Resumen de la orden
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Subtotal
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatPrice(
                                                            selectedOrder.items.reduce(
                                                                (sum, item) =>
                                                                    sum +
                                                                    item.subtotal,
                                                                0,
                                                            ),
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Envío
                                                    </span>
                                                    <span className="font-medium">
                                                        Gratis
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total pagado</span>
                                                    <span className="text-primary">
                                                        {formatPrice(
                                                            selectedOrder.total,
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Timeline de estado */}
                                        {getOrderProgress(
                                            selectedOrder.status,
                                        ) > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-base">
                                                        Estado del pedido
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <Progress
                                                            value={getOrderProgress(
                                                                selectedOrder.status,
                                                            )}
                                                            className="h-2"
                                                        />
                                                        <div className="grid grid-cols-4 gap-2 text-center">
                                                            <div className="space-y-1">
                                                                <div
                                                                    className={`text-xs ${statusConfig[selectedOrder.status]?.step >= 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                                                >
                                                                    Orden creada
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div
                                                                    className={`text-xs ${statusConfig[selectedOrder.status]?.step >= 2 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                                                >
                                                                    Confirmado
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div
                                                                    className={`text-xs ${statusConfig[selectedOrder.status]?.step >= 3 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                                                >
                                                                    En camino
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div
                                                                    className={`text-xs ${statusConfig[selectedOrder.status]?.step >= 4 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                                                                >
                                                                    Entregado
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="products"
                                        className="space-y-3"
                                    >
                                        {selectedOrder.items.map(
                                            (item, idx) => (
                                                <Card key={idx}>
                                                    <CardContent className="p-4">
                                                        <div className="flex gap-4">
                                                            <Avatar className="h-16 w-16 rounded-lg">
                                                                <AvatarImage
                                                                    src={
                                                                        item
                                                                            .product
                                                                            ?.thumbnail
                                                                            ? item.product.thumbnail.startsWith(
                                                                                  'http',
                                                                              )
                                                                                ? item
                                                                                      .product
                                                                                      .thumbnail
                                                                                : `/storage/${item.product.thumbnail}`
                                                                            : undefined
                                                                    }
                                                                    className="object-cover"
                                                                />
                                                                <AvatarFallback className="rounded-lg text-lg font-semibold">
                                                                    {item.product_name.charAt(
                                                                        0,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 space-y-1">
                                                                <p className="font-medium">
                                                                    {
                                                                        item.product_name
                                                                    }
                                                                </p>
                                                                <div className="flex gap-3 text-sm text-muted-foreground">
                                                                    <span>
                                                                        Cantidad:{' '}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        {formatPrice(
                                                                            item.product_price,
                                                                        )}{' '}
                                                                        c/u
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold">
                                                                    {formatPrice(
                                                                        item.subtotal,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ),
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="payment"
                                        className="space-y-4"
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <CreditCard className="h-4 w-4" />
                                                    Información de pago
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Método de pago
                                                    </span>
                                                    <span className="text-sm font-medium capitalize">
                                                        {selectedOrder.payment
                                                            ?.method ||
                                                            'No especificado'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Estado
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="capitalize"
                                                    >
                                                        {selectedOrder.payment
                                                            ?.status ||
                                                            'Pendiente'}
                                                    </Badge>
                                                </div>
                                                {selectedOrder.payment
                                                    ?.receipt_url && (
                                                    <Button
                                                        variant="link"
                                                        className="gap-2 px-0"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`/storage/${selectedOrder.payment.receipt_url}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Ver comprobante de
                                                            pago
                                                        </a>
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Shipping Info Mock */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <MapPin className="h-4 w-4" />
                                                    Información de envío
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    La información de envío se
                                                    encuentra disponible en tu
                                                    perfil.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </ScrollArea>

                            {/* Dialog Footer */}
                            <div className="border-t bg-muted/30 p-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full sm:w-auto"
                                >
                                    Cerrar
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
