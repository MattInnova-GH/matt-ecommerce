<?php

namespace App\Http\Controllers;

use App\Mail\ComplaintReceived;
use App\Mail\NewComplaintNotification;
use App\Models\Complaint;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'document_number' => 'required|string|max:20',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'nullable|string|max:500',
            'asset_type' => 'required|string|in:Producto,Servicio',
            'asset_description' => 'required|string|max:1000',
            'claimed_amount' => 'nullable|numeric|min:0',
            'complaint_type' => 'required|string|in:Reclamo,Queja',
            'problem_description' => 'required|string|max:5000',
            'consumer_request' => 'required|string|max:2000',
        ]);

        // El D.S. N° 011-2011-PCM exige un numero correlativo (no aleatorio)
        // para cada hoja de reclamacion. La columna "code" es NOT NULL, asi
        // que se crea con un valor temporal y se reemplaza por el
        // correlativo real (basado en el id autoincremental) justo despues.
        $complaint = Complaint::create([
            ...$validated,
            'user_id' => $request->user()?->id,
            'code' => 'TEMP-'.uniqid(),
        ]);

        $complaint->update([
            'code' => sprintf('N° %06d-%d', $complaint->id, $complaint->created_at->year),
        ]);

        Mail::to($complaint->email)->send(new ComplaintReceived($complaint));

        $adminEmail = Setting::first()?->email ?? config('mail.from.address');

        if ($adminEmail) {
            Mail::to($adminEmail)->send(new NewComplaintNotification($complaint));
        }

        return redirect()->back()->with('success', 'Tu reclamación fue registrada con el número correlativo '.$complaint->code.'. Te enviamos un correo de confirmación. Por ley, tenemos un plazo máximo de 30 días calendario para darte una respuesta.');
    }
}
