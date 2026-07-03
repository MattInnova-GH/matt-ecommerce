<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Totales principales
        $totalRevenue = DB::table('payments')
            ->where('status', 'APPROVED')
            ->sum('amount');

        $totalOrders = Order::count();
        $totalCustomers = User::count(); // Podría filtrarse por rol si existiera una columna
        $lowStockCount = Product::where('stock', '<', 10)->count();

        // Datos para gráfico de ventas (últimos 7 días)
        $salesData = DB::table('orders')
            ->select(
                DB::raw('date(orders.created_at) as date'),
                DB::raw('count(distinct orders.id) as total_orders'),
                DB::raw('coalesce(sum(case when payments.status = \'APPROVED\' then orders.total else 0 end), 0) as revenue')
            )
            ->leftJoin('payments', 'payments.order_id', '=', 'orders.id')
            ->where('orders.created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Pedidos recientes
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

        // Reseñas pendientes
        $pendingReviewsCount = Review::where('is_approved', false)->count();

        // Top productos
        $topProducts = DB::table('order_items')
            ->select('product_name', DB::raw('sum(quantity) as total_sold'), DB::raw('sum(subtotal) as total_revenue'))
            ->groupBy('product_id', 'product_name')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'lowStockCount' => $lowStockCount,
                'pendingReviewsCount' => $pendingReviewsCount,
            ],
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
