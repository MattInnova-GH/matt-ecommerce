<?php

namespace App\Observers;

use App\Http\Services\ChatbotKnowledgeBase;
use App\Models\Category;

class CategoryObserver
{ 
    public function __construct(private ChatbotKnowledgeBase $knowledgeBase) {}
 
    public function saved(Category $category): void
    {
        $this->knowledgeBase->rebuild();
    }
 
    public function deleted(Category $category): void
    {
        $this->knowledgeBase->rebuild();
    }
}
