<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SellerRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ConfigurationController extends Controller
{
    /**
     * Mostrar página de configuración
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Obtener la última solicitud de vendedor
        $lastRequest = SellerRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return Inertia::render('User/Configuration/Index', [
            'initialConfig' => [
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'documentType' => $user->document_type,
                'documentNumber' => $user->document_number,
                'image' => $user->image ? Storage::url($user->image) : null,
                'role' => $user->role,
            ],
            'existingRequestStatus' => $lastRequest?->status,
        ]);
    }

    /**
     * Actualizar perfil de usuario
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'documentType' => 'required|in:DNI,RUC,CE,PASAPORTE',
            'documentNumber' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        // Verificar que el número de documento no esté en uso por otro usuario
        if ($request->documentNumber) {
            $existing = User::where('document_number', $request->documentNumber)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($existing) {
                return redirect()->back()->with('error', 'El número de documento ya está en uso por otra cuenta');
            }
        }

        $user->update([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'document_type' => $request->documentType,
            'document_number' => $request->documentNumber,
        ]);

        return redirect()->back()->with('success', '¡Perfil actualizado exitosamente!');
    }

    /**
     * Actualizar avatar
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'image' => 'required|string', // Cambiado de 'avatar' a 'image' para consistencia
        ]);

        $user = $request->user();

        try {
            // Decodificar base64
            $imageData = $request->image;

            // Extraer el tipo de imagen y los datos
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif, webp

                // Validar tipo de imagen
                if (! in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Tipo de imagen no válido',
                    ], 400);
                }

                $imageData = base64_decode($imageData);

                if ($imageData === false) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Formato de imagen inválido',
                    ], 400);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Formato de imagen no soportado',
                ], 400);
            }

            // Generar nombre único con la extensión correcta
            $fileName = 'avatars/'.uniqid().'.'.$type;
            Storage::disk('public')->put($fileName, $imageData);

            // Eliminar avatar anterior
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }

            $user->update(['image' => $fileName]);

            return response()->json([
                'success' => true,
                'imagePath' => Storage::url($fileName),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al procesar la imagen: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear solicitud de vendedor
     */
    public function createSellerRequest(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'tax_id_type' => 'required|in:DNI,RUC,CE,PASAPORTE',
            'tax_id_number' => 'required|string|max:20',
            'experience' => 'required|string|min:20',
            'message' => 'required|string|min:20',
        ]);

        $user = $request->user();

        // Verificar que el usuario no tenga ya una solicitud PENDING o APPROVED
        $existing = SellerRequest::where('user_id', $user->id)
            ->whereIn('status', ['PENDING', 'APPROVED'])
            ->first();

        if ($existing) {
            if ($existing->status === 'APPROVED') {
                return redirect()->back()->with('error', 'Tu cuenta ya fue aprobada como vendedor');
            }
            if ($existing->status === 'PENDING') {
                return redirect()->back()->with('error', 'Ya tienes una solicitud pendiente. El equipo la revisará pronto.');
            }
        }

        // Verificar que el número de documento no esté en uso por otro usuario
        $docInUse = User::where('document_number', $request->tax_id_number)
            ->where('id', '!=', $user->id)
            ->exists();

        if ($docInUse) {
            return redirect()->back()->with('error', 'El número de documento ya está en uso por otra cuenta');
        }

        DB::beginTransaction();

        try {
            // Actualizar datos del usuario
            $user->update([
                'phone' => $request->phone,
                'document_type' => $request->tax_id_type,
                'document_number' => $request->tax_id_number,
            ]);

            // Crear solicitud
            SellerRequest::create([
                'user_id' => $user->id,
                'business_name' => $request->business_name,
                'business_type' => $request->business_type,
                'address' => $request->address,
                'phone' => $request->phone,
                'tax_id_type' => $request->tax_id_type,
                'tax_id_number' => $request->tax_id_number,
                'experience' => $request->experience,
                'message' => $request->message,
                'status' => 'PENDING',
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Solicitud enviada correctamente');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error al enviar la solicitud. Inténtalo de nuevo.');
        }
    }
}
