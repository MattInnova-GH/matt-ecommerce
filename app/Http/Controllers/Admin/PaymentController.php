<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\RefundProcessed;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
            'refund_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $refundProofUrl = $payment->refund_proof_url;

        if ($request->hasFile('refund_proof')) {
            $refundProofUrl = $request->file('refund_proof')->store('refund-proofs', 'public');
        }

        $payment->update([
            'refunded_at' => now(),
            'refund_notes' => $validated['refund_notes'],
            'refund_proof_url' => $refundProofUrl,
        ]);

        $payment->load('order.user');

        if ($payment->order?->user) {
            Mail::to($payment->order->user->email)->send(new RefundProcessed($payment));
        }

        return redirect()->back();
    }
}
