<?php

namespace App\Http\Controllers;

use App\Http\Services\ChatbotResponseFinder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function __construct(private ChatbotResponseFinder $responseFinder) {}

    /**
     * Procesa el mensaje del usuario y retorna una respuesta del chatbot
     */
    public function respond(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $userMessage = $request->input('message');
        $result = $this->responseFinder->findBestResponse($userMessage);

        return response()->json([
            'response' => $result['response'],
            'icon' => $result['icon'],
        ]);
    }
}
