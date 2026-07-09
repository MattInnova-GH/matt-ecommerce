<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ComplaintStatusUpdated;
use App\Models\Complaint;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public const STATUS_LABELS = [
        'pendiente' => 'Pendiente',
        'en_proceso' => 'En proceso',
        'resuelto' => 'Resuelto',
    ];

    public function index()
    {
        $complaints = Complaint::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Complaints/Complaints', [
            'complaints' => $complaints,
        ]);
    }

    public function update(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'status' => 'required|in:pendiente,en_proceso,resuelto',
        ]);

        $statusChanged = $complaint->status !== $validated['status'];

        $complaint->update($validated);

        if ($statusChanged) {
            try {
                Mail::to($complaint->email)->send(new ComplaintStatusUpdated($complaint));
            } catch (\Throwable $e) {
                Log::error('No se pudo enviar el correo de actualización de reclamo', [
                    'complaint_id' => $complaint->id,
                    'status' => $complaint->status,
                    'error' => $e->getMessage(),
                ]);
            }

            if ($complaint->user_id) {
                Notification::create([
                    'user_id' => $complaint->user_id,
                    'title' => 'Reclamación '.strtolower(self::STATUS_LABELS[$complaint->status] ?? $complaint->status),
                    'message' => "Tu {$complaint->complaint_type} {$complaint->code} ahora está: ".
                        (self::STATUS_LABELS[$complaint->status] ?? $complaint->status).'.',
                ]);
            }
        }

        return redirect()->back();
    }
}
