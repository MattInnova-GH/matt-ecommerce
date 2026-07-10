<?php

namespace App\Console\Commands;

use App\Http\Services\ChatbotKnowledgeBase;
use Illuminate\Console\Command;

class RebuildChatbotKnowledge extends Command
{
    protected $signature = 'chatbot:rebuild';

    protected $description = 'Regenera manualmente la base de conocimiento del chatbot (productos, categorías, marcas)';

    public function handle(ChatbotKnowledgeBase $knowledgeBase): int
    {
        $data = $knowledgeBase->rebuild();

        $this->info('Base de conocimiento del chatbot regenerada correctamente.');
        $this->line('Productos activos: '.count($data['products']));
        $this->line('Categorías activas: '.count($data['categories']));
        $this->line('Marcas: '.count($data['brands']));
        $this->line('Copia de inspección guardada en: storage/app/chatbot/knowledge-base.json');

        return self::SUCCESS;
    }
}
