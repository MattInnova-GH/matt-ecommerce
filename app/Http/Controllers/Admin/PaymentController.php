<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with('order.user')->paginate(10);

        return Inertia::render('Admin/Payments/Payments', [
            'payments' => $payments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDING,APPROVED,REJECTED',
        ]);

        $payment->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->back();
    }

    /**
     * Mark the payment as manually refunded (no gateway involved; the
     * refund itself happens outside the system, e.g. via Yape/transferencia).
     */
    public function refund(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'refund_notes' => 'required|string|max:1000',
        ]);

        $payment->update([
            'refunded_at' => now(),
            'refund_notes' => $validated['refund_notes'],
        ]);

        return redirect()->back();
    }
}
