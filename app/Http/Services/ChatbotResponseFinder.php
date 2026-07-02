<?php

namespace App\Http\Services;

use App\Http\Data\ChatbotDataset;

class ChatbotResponseFinder
{
    private TextNormalizer $normalizer;

    public function __construct(TextNormalizer $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    /**
     * Encuentra la mejor respuesta según el mensaje del usuario
     *
     * @return array{response: string, icon: string}
     */
    public function findBestResponse(string $message): array
    {
        $normalizedMessage = $this->normalizer->normalize($message);
        $dataset = ChatbotDataset::get();

        $bestMatch = null;
        $bestIcon = 'help-circle';
        $bestScore = 0;

        foreach ($dataset as $entry) {
            $score = $this->calculateScore($normalizedMessage, $entry['keywords']);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $entry['response'];
                $bestIcon = $entry['icon'];
            }
        }

        if ($bestMatch !== null && $bestScore > 0) {
            return [
                'response' => $bestMatch,
                'icon' => $bestIcon,
            ];
        }

        return $this->getDefaultResponse();
    }

    /**
     * Calcula el score de coincidencia entre el mensaje y las palabras clave
     */
    private function calculateScore(string $message, array $keywords): int
    {
        $score = 0;
        foreach ($keywords as $keyword) {
            $normalizedKeyword = $this->normalizer->normalize($keyword);
            if (str_contains($message, $normalizedKeyword)) {
                $score += strlen($normalizedKeyword);
            }
        }

        return $score;
    }

    /**
     * Retorna la respuesta por defecto cuando no hay coincidencias
     *
     * @return array{response: string, icon: string}
     */
    private function getDefaultResponse(): array
    {
        return [
            'icon' => 'help-circle',
            'response' => "No estoy seguro de cómo ayudarte con eso. Puedo orientarte sobre:\n\n• Productos y categorías\n• Envíos y tiempos de entrega\n• Métodos de pago (Yape, transferencia)\n• Estado de pedidos\n• Devoluciones y cambios\n• Tu cuenta y perfil\n\n¿Puedes reformular tu pregunta?",
        ];
    }
}
