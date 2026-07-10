<?php

namespace App\Observers;

use App\Http\Services\ChatbotKnowledgeBase;
use App\Models\Promotion;

class PromotionObserver
{
    public function __construct(private ChatbotKnowledgeBase $knowledgeBase) {}

    public function saved(Promotion $promotion): void
    {
        // Una promoción cambia el final_price / has_discount de los
        // productos de su categoría, así que también hay que refrescar.
        $this->knowledgeBase->rebuild();
    }

    public function deleted(Promotion $promotion): void
    {
        $this->knowledgeBase->rebuild();
    }
}
