<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusUpdated;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Orders/Orders', [
            'orders' => $orders,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDING,ACCEPTED,REJECTED,SHIPPED,DELIVERED,CANCELLED',
        ]);

        $statusChanged = $order->status !== $validated['status'];

        $order->update($validated);

        if ($statusChanged) {
            $order->load(['items', 'user']);
            Mail::to($order->user->email)->send(new OrderStatusUpdated($order));
        }

        return back();
    }
}
