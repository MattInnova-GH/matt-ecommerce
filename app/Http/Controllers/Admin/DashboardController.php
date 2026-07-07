<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Ingresos = suma de pedidos ya aceptados (o en una etapa posterior).
     * Un pedido rechazado/cancelado deja de contar, independientemente
     * de lo que diga el panel de Pagos (que es solo evidencia manual).
     */
    private const REVENUE_STATUSES = ['ACCEPTED', 'SHIPPED', 'DELIVERED'];

    private const PERIODS = ['daily', 'weekly', 'monthly'];

    public function index(Request $request)
    {
        $period = $request->input('period', 'monthly');

        if (! in_array($period, self::PERIODS, true)) {
            $period = 'monthly';
        }

        [$currentStart, $currentEnd, $previousStart, $previousEnd] = $this->periodBounds($period);

        $currentRevenue = (float) Order::whereIn('status', self::REVENUE_STATUSES)
            ->whereBetween('created_at', [$currentStart, $currentEnd])
            ->sum('total');
        $previousRevenue = (float) Order::whereIn('status', self::REVENUE_STATUSES)
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->sum('total');

        $currentOrders = Order::whereBetween('created_at', [$currentStart, $currentEnd])->count();
        $previousOrders = Order::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $currentCustomers = User::whereBetween('created_at', [$currentStart, $currentEnd])->count();
        $previousCustomers = User::whereBetween('created_at', [$previousStart, $previousEnd])->count();

        $lowStockProducts = Product::where('stock', '<', 10)
            ->orderBy('stock', 'asc')
            ->take(3)
            ->get(['id', 'name', 'stock']);
        $lowStockCount = Product::where('stock', '<', 10)->count();
        $pendingReviewsCount = Review::where('is_approved', false)->count();

        $recentOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user ? $order->user->first_name.' '.$order->user->last_name : 'Invitado',
                'total' => (float) $order->total,
                'status' => $order->status,
                'date' => $order->created_at->diffForHumans(),
            ]);

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$currentStart, $currentEnd])
            ->select(
                'order_items.product_name',
                DB::raw('sum(order_items.quantity) as total_sold'),
                DB::raw('sum(order_items.subtotal) as total_revenue'),
            )
            ->groupBy('order_items.product_id', 'order_items.product_name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'period' => $period,
            'stats' => [
                'revenue' => [
                    'value' => $currentRevenue,
                    'change' => $this->percentChange($previousRevenue, $currentRevenue),
                ],
                'orders' => [
                    'value' => $currentOrders,
                    'change' => $this->percentChange($previousOrders, $currentOrders),
                ],
                'customers' => [
                    'value' => $currentCustomers,
                    'change' => $this->percentChange($previousCustomers, $currentCustomers),
                ],
                'lowStockCount' => $lowStockCount,
                'pendingReviewsCount' => $pendingReviewsCount,
                'lowStockProducts' => $lowStockProducts,
            ],
            'salesData' => $this->salesDataForPeriod($period),
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }

    /**
     * Devuelve [inicio actual, fin actual, inicio anterior, fin anterior]
     * para el periodo solicitado, de modo que ambos rangos tengan la
     * misma duración y sean comparables.
     */
    private function periodBounds(string $period): array
    {
        $now = Carbon::now();

        return match ($period) {
            'daily' => [
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay(),
                $now->copy()->subDay()->startOfDay(),
                $now->copy()->subDay()->endOfDay(),
            ],
            'weekly' => [
                $now->copy()->startOfWeek(),
                $now->copy()->endOfWeek(),
                $now->copy()->subWeek()->startOfWeek(),
                $now->copy()->subWeek()->endOfWeek(),
            ],
            default => [
                $now->copy()->startOfMonth(),
                $now->copy()->endOfMonth(),
                $now->copy()->subMonthNoOverflow()->startOfMonth(),
                $now->copy()->subMonthNoOverflow()->endOfMonth(),
            ],
        };
    }

    /**
     * Porcentaje de cambio entre el periodo anterior y el actual.
     * Si no hubo nada en el periodo anterior, no hay un % válido que
     * calcular (división entre cero); se marca como "nuevo" en su lugar.
     */
    private function percentChange(float $previous, float $current): array
    {
        if ($previous == 0.0) {
            return [
                'percent' => null,
                'isNew' => $current > 0,
            ];
        }

        return [
            'percent' => round((($current - $previous) / $previous) * 100, 1),
            'isNew' => false,
        ];
    }

    private function salesDataForPeriod(string $period): array
    {
        return match ($period) {
            'daily' => $this->bucketedSales(14, 'day'),
            'weekly' => $this->bucketedSales(8, 'week'),
            default => $this->bucketedSales(6, 'month'),
        };
    }

    /**
     * Agrupa los pedidos en "buckets" de dia/semana/mes en PHP (en vez de
     * funciones de fecha especificas de MySQL) para que funcione igual
     * sin importar el motor de base de datos.
     */
    private function bucketedSales(int $count, string $unit): array
    {
        $now = Carbon::now();

        $bucketStart = match ($unit) {
            'day' => $now->copy()->subDays($count - 1)->startOfDay(),
            'week' => $now->copy()->subWeeks($count - 1)->startOfWeek(),
            default => $now->copy()->subMonthsNoOverflow($count - 1)->startOfMonth(),
        };

        $orders = Order::where('created_at', '>=', $bucketStart)
            ->get(['created_at', 'status', 'total']);

        $buckets = [];
        $keys = [];

        for ($i = 0; $i < $count; $i++) {
            $date = match ($unit) {
                'day' => $bucketStart->copy()->addDays($i),
                'week' => $bucketStart->copy()->addWeeks($i),
                default => $bucketStart->copy()->addMonthsNoOverflow($i),
            };

            $key = match ($unit) {
                'day' => $date->format('Y-m-d'),
                'week' => $date->format('Y-W'),
                default => $date->format('Y-m'),
            };

            $label = match ($unit) {
                'day' => $date->isoFormat('D MMM'),
                'week' => 'Sem. '.$date->isoFormat('D MMM'),
                default => $date->isoFormat('MMM YYYY'),
            };

            $buckets[$key] = ['date' => $label, 'total_orders' => 0, 'revenue' => 0.0];
            $keys[] = $key;
        }

        foreach ($orders as $order) {
            $createdAt = Carbon::parse($order->created_at);

            $key = match ($unit) {
                'day' => $createdAt->format('Y-m-d'),
                'week' => $createdAt->format('Y-W'),
                default => $createdAt->format('Y-m'),
            };

            if (! isset($buckets[$key])) {
                continue;
            }

            $buckets[$key]['total_orders']++;

            if (in_array($order->status, self::REVENUE_STATUSES, true)) {
                $buckets[$key]['revenue'] += (float) $order->total;
            }
        }

        return array_values($buckets);
    }
}
