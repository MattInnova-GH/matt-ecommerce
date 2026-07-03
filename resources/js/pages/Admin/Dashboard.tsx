import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Package,
    ShoppingCart,
    AlertTriangle,
    MessageSquare,
    ArrowUpRight,
    Clock,
    DollarSign,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    lowStockCount: number;
    pendingReviewsCount: number;
    lowStockProducts: LowStockProduct[];
}

interface SalesDataItem {
    date: string;
    total_orders: number;
    revenue: number;
}

interface RecentOrder {
    id: number;
    order_number: string;
    customer: string;
    total: number;
    status: string;
    date: string;
}

interface TopProduct {
    product_name: string;
    total_sold: number;
    total_revenue: number;
}

interface Props {
    stats: DashboardStats;
    salesData: SalesDataItem[];
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ACCEPTED: 'bg-blue-100 text-blue-700 border-blue-200',
    SHIPPED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    REJECTED: 'bg-gray-100 text-gray-700 border-gray-200',
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

export default function Dashboard({
    stats,
    salesData,
    recentOrders,
    topProducts,
}: Props) {
    return (
        <div className="animate-in space-y-8 duration-700 fade-in">
            <Head title="Panel de Control" />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Bienvenido de nuevo. Aquí tienes un resumen del estado de tu
                    tienda.
                </p>
            </div>

            {/* Tarjetas de Estadísticas Principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-none bg-white shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ingresos Totales
                        </CardTitle>
                        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                            <DollarSign className="size-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center font-medium text-emerald-500">
                                <ArrowUpRight className="size-3" /> +12%
                            </span>
                            respecto al mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-white shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pedidos
                        </CardTitle>
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <ShoppingCart className="size-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalOrders}
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center font-medium text-emerald-500">
                                <ArrowUpRight className="size-3" /> +5%
                            </span>
                            ventas hoy
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-white shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clientes
                        </CardTitle>
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <Users className="size-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalCustomers}
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center font-medium text-emerald-500">
                                <ArrowUpRight className="size-3" /> +18
                            </span>
                            registros nuevos
                        </p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-white shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Alertas
                        </CardTitle>
                        <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                            <AlertTriangle className="size-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.lowStockCount}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Productos con bajo stock
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Alertas de Acción Inmediata */}
            {(stats.pendingReviewsCount > 0 || stats.lowStockCount > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {stats.pendingReviewsCount > 0 && (
                        <div
                            className={cn(
                                'flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-blue-900 shadow-sm',
                                stats.lowStockCount === 0 &&
                                    'md:col-span-2',
                            )}
                        >
                            <div className="rounded-full bg-blue-100 p-3">
                                <MessageSquare className="size-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    Reseñas pendientes
                                </p>
                                <p className="text-sm opacity-80">
                                    Tienes {stats.pendingReviewsCount} reseñas
                                    esperando tu aprobación.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                asChild
                                variant="secondary"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Link href="/admin/reviews">Gestionar</Link>
                            </Button>
                        </div>
                    )}
                    {stats.lowStockCount > 0 && (
                        <div
                            className={cn(
                                'flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-amber-900 shadow-sm',
                                stats.pendingReviewsCount === 0 &&
                                    'md:col-span-2',
                            )}
                        >
                            <div className="rounded-full bg-amber-100 p-3">
                                <Package className="size-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">
                                    Reabastecimiento
                                </p>
                                <p className="text-sm opacity-80">
                                    {stats.lowStockCount} producto
                                    {stats.lowStockCount !== 1 && 's'}{' '}
                                    {stats.lowStockCount !== 1
                                        ? 'están'
                                        : 'está'}{' '}
                                    por agotarse pronto.
                                </p>
                                {stats.lowStockProducts.length > 0 && (
                                    <p className="mt-1 text-xs opacity-70">
                                        {stats.lowStockProducts
                                            .map(
                                                (p) =>
                                                    `${p.name} (${p.stock} unid.)`,
                                            )
                                            .join(', ')}
                                        {stats.lowStockCount >
                                            stats.lowStockProducts.length &&
                                            ` y ${stats.lowStockCount - stats.lowStockProducts.length} más`}
                                        . Recomendamos reponer pronto para no
                                        perder ventas.
                                    </p>
                                )}
                            </div>
                            <Button
                                size="sm"
                                asChild
                                variant="secondary"
                                className="bg-amber-600 text-white hover:bg-amber-700"
                            >
                                <Link href="/admin/products">
                                    Ver inventario
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Gráficos y Tablas Secundarias */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Gráfico de Ventas */}
                <Card className="border-none shadow-md lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Rendimiento de Ventas
                        </CardTitle>
                        <CardDescription>
                            Resumen de los últimos 7 días
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pl-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#4f46e5"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#4f46e5"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow:
                                            '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value) => [
                                        formatCurrency(Number(value ?? 0)),
                                        'Ingresos',
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Productos */}
                <Card className="border-none shadow-md lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg">Más Vendidos</CardTitle>
                        <CardDescription>
                            Productos con mayor demanda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topProducts.map((product, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-xs font-bold text-slate-400">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm leading-none font-medium">
                                            {product.product_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.total_sold} unidades
                                            vendidas
                                        </p>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                        {formatCurrency(product.total_revenue)}
                                    </div>
                                </div>
                            ))}
                            {topProducts.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                    <Package className="mb-2 size-10 opacity-20" />
                                    <p className="text-sm">
                                        Sin datos de ventas aún
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-blue-600"
                            asChild
                        >
                            <Link href="/admin/products">
                                Ver catálogo completo
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Pedidos Recientes */}
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            Pedidos Recientes
                        </CardTitle>
                        <CardDescription>
                            Últimas transacciones realizadas
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/orders">Ver todos</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="font-semibold">
                                    Nº Pedido
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Cliente
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Estado
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    Total
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    Fecha
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="transition-colors hover:bg-slate-50/50"
                                >
                                    <TableCell className="font-medium">
                                        {order.order_number}
                                    </TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`border ${STATUS_COLORS[order.status] || 'bg-slate-100'} font-medium`}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {formatCurrency(order.total)}
                                    </TableCell>
                                    <TableCell className="flex items-center justify-end gap-1 text-right text-muted-foreground">
                                        <Clock className="size-3" />{' '}
                                        {order.date}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recentOrders.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No hay pedidos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
