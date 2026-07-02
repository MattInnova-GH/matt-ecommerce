<?php

namespace App\Http\Controllers;

use App\Mail\ComplaintReceived;
use App\Models\Complaint;
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

        $validated['code'] = 'REC-'.strtoupper(uniqid());

        $complaint = Complaint::create($validated);

        Mail::to($complaint->email)->send(new ComplaintReceived($complaint));

        return redirect()->back()->with('success', 'Tu reclamación fue registrada. Te enviamos un correo de confirmación con el código '.$complaint->code.'.');
    }
}
