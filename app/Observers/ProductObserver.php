<?php

namespace App\Observers;

use App\Http\Services\ChatbotKnowledgeBase;
use App\Models\Product;

class ProductObserver
{
    public function __construct(private ChatbotKnowledgeBase $knowledgeBase) {}

    public function saved(Product $product): void
    {
        $this->knowledgeBase->rebuild();
    }

    public function deleted(Product $product): void
    {
        $this->knowledgeBase->rebuild();
    }
}
