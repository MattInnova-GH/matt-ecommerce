<?php

namespace App\Http\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

/**
 * Mantiene una "foto" cacheada y siempre actualizada de los productos,
 * categorías y marcas activas de la tienda, lista para que el chatbot
 * la use sin tener que golpear la base de datos en cada mensaje.
 *
 * ¿Cómo se mantiene actualizada?
 * No hace falta ningún cron ni sincronización manual: los Observers
 * (App\Observers\ProductObserver, CategoryObserver, BrandObserver,
 * PromotionObserver) llaman a rebuild() automáticamente cada vez que
 * se crea/edita/elimina un registro relevante. Ver app/Observers/.
 */
class ChatbotKnowledgeBase
{
    public const CACHE_KEY = 'chatbot.knowledge_base';

    public function __construct(private TextNormalizer $normalizer) {}

    /**
     * Devuelve la base de conocimiento. Si nunca se generó (primer
     * request tras un deploy, cache limpia, etc.) la construye una vez
     * y la deja cacheada para siempre (hasta el próximo cambio real).
     */
    public function get(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => $this->build());
    }

    /**
     * Regenera la base de conocimiento desde la base de datos y la
     * vuelve a cachear. Esto es lo que disparan los Observers.
     */
    public function rebuild(): array
    {
        $data = $this->build();

        Cache::forever(self::CACHE_KEY, $data);

        // Copia legible en disco, solo para poder inspeccionar "qué sabe"
        // el chatbot en un momento dado (storage/app/chatbot/knowledge-base.json).
        // El chatbot en producción NUNCA lee este archivo, siempre lee la caché;
        // esto es solo para debug / transparencia.
        try {
            Storage::disk('local')->put(
                'chatbot/knowledge-base.json',
                json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
            );
        } catch (\Throwable $e) {
            // Si el disco no está disponible no debe romper la app.
        }

        return $data;
    }

    private function build(): array
    {
        $products = Product::query()
            ->where('is_active', true)
            ->with(['category:id,name,slug', 'brand:id,name'])
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'normalized_name' => $this->normalizer->normalize($p->name),
                'slug' => $p->slug,
                'url' => '/productos/'.$p->slug,
                'price' => (float) $p->price,
                'final_price' => (float) ($p->final_price ?? $p->price),
                'has_discount' => (bool) ($p->has_discount ?? false),
                'discount_badge' => $p->discount_badge ?? null,
                'stock' => (int) $p->stock,
                'category_id' => $p->category_id,
                'category_name' => $p->category?->name,
                'brand_id' => $p->brand_id,
                'brand_name' => $p->brand?->name,
                'is_featured' => (bool) $p->is_featured,
            ])
            ->values()
            ->all();

        $categories = Category::query()
            ->where('is_active', true)
            ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'normalized_name' => $this->normalizer->normalize($c->name),
                'slug' => $c->slug,
                'url' => '/categorias/'.$c->slug,
                'products_count' => $c->products_count,
            ])
            ->values()
            ->all();

        $brands = Brand::query()
            ->withCount('products')
            ->get()
            ->map(fn (Brand $b) => [
                'id' => $b->id,
                'name' => $b->name,
                'normalized_name' => $this->normalizer->normalize($b->name),
                'products_count' => $b->products_count,
            ])
            ->values()
            ->all();

        return [
            'generated_at' => now()->toISOString(),
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
        ];
    }
}