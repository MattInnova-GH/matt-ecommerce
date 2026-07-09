<?php

namespace App\Observers;

use App\Http\Services\ChatbotKnowledgeBase;
use App\Models\Brand;

class BrandObserver
{
    public function __construct(private ChatbotKnowledgeBase $knowledgeBase) {}
 
    public function saved(Brand $brand): void
    {
        $this->knowledgeBase->rebuild();
    }
 
    public function deleted(Brand $brand): void
    {
        $this->knowledgeBase->rebuild();
    }
}
