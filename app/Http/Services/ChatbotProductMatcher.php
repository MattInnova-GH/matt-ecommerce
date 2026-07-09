<?php

namespace App\Http\Services;

/**
 * Detecta si el usuario está preguntando por algo del catálogo real
 * (un producto, una categoría o una marca) y arma una respuesta con
 * datos ACTUALES (precio, stock, descuento) leídos de ChatbotKnowledgeBase.
 *
 * Si el mensaje no menciona nada identificable del catálogo, devuelve
 * null y el ChatbotResponseFinder sigue con el dataset de preguntas
 * frecuentes de siempre.
 */
class ChatbotProductMatcher
{
    private const MIN_PRODUCT_WORD_LENGTH = 3;
    private const MIN_CATEGORY_NAME_LENGTH = 4;
    private const MIN_BRAND_NAME_LENGTH = 3;
    private const MAX_LIST_ITEMS = 5;
    private const EXACT_MATCH_SCORE = 1000;

    public function __construct(
        private ChatbotKnowledgeBase $knowledgeBase,
        private TextNormalizer $normalizer,
    ) {}

    /**
     * @return array{response: string, icon: string}|null
     */
    public function match(string $normalizedMessage): ?array
    {
        $kb = $this->knowledgeBase->get();

        $productMatches = $this->matchProducts($normalizedMessage, $kb['products']);
        if (! empty($productMatches)) {
            $top = $productMatches[0];
            $isExactMatch = $top['score'] >= self::EXACT_MATCH_SCORE;

            if (count($productMatches) === 1 || $isExactMatch) {
                return $this->singleProductResponse($top['product']);
            }

            return $this->productListResponse(
                array_column($productMatches, 'product'),
                'Encontré varios productos que podrían interesarte:'
            );
        }

        $categoryMatch = $this->bestNameMatch($normalizedMessage, $kb['categories'], self::MIN_CATEGORY_NAME_LENGTH);
        if ($categoryMatch) {
            return $this->categoryResponse($categoryMatch, $kb['products']);
        }

        $brandMatch = $this->bestNameMatch($normalizedMessage, $kb['brands'], self::MIN_BRAND_NAME_LENGTH);
        if ($brandMatch) {
            return $this->brandResponse($brandMatch, $kb['products']);
        }

        return null;
    }

    /**
     * Busca productos por:
     * 1) Coincidencia exacta del nombre completo dentro del mensaje (máxima prioridad).
     * 2) Solapamiento de palabras significativas (ej: "zapatillas nike" encuentra
     *    "Zapatillas Nike Air Max 90" aunque el usuario no escriba el nombre completo).
     *
     * @return array<int, array{score: int, product: array}>
     */
    private function matchProducts(string $message, array $products): array
    {
        $messageWords = $this->significantWords($message);
        $scored = [];

        foreach ($products as $product) {
            $name = $product['normalized_name'];
            if ($name === '' || strlen($name) < self::MIN_PRODUCT_WORD_LENGTH) {
                continue;
            }

            $nameWords = $this->significantWords($name);
            if (empty($nameWords)) {
                continue;
            }

            $score = 0;

            if (str_contains($message, $name)) {
                $score = self::EXACT_MATCH_SCORE + strlen($name);
            } else {
                $matched = array_intersect($nameWords, $messageWords);
                $ratio = count($matched) / count($nameWords);

                // Exigimos al menos la mitad de las palabras del nombre del
                // producto, o al menos 2 palabras coincidentes, para evitar
                // falsos positivos con nombres largos.
                if ($ratio >= 0.5 || count($matched) >= 2) {
                    $score = array_sum(array_map('strlen', $matched));
                }
            }

            if ($score > 0) {
                $scored[] = ['score' => $score, 'product' => $product];
            }
        }

        if (empty($scored)) {
            return [];
        }

        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($scored, 0, self::MAX_LIST_ITEMS);
    }

    /**
     * Para categorías/marcas exigimos que TODAS las palabras del nombre
     * aparezcan en el mensaje (nombres cortos, así que hay que ser estricto
     * para no disparar falsos positivos).
     */
    private function bestNameMatch(string $message, array $items, int $minLength): ?array
    {
        $messageWords = $this->significantWords($message);
        if (empty($messageWords)) {
            return null;
        }

        $best = null;
        $bestScore = 0;

        foreach ($items as $item) {
            $name = $item['normalized_name'];
            if (strlen($name) < $minLength) {
                continue;
            }

            $nameWords = $this->significantWords($name);
            if (empty($nameWords)) {
                continue;
            }

            $matched = array_intersect($nameWords, $messageWords);
            if (count($matched) < count($nameWords)) {
                continue; // No están todas las palabras del nombre.
            }

            if (strlen($name) > $bestScore) {
                $bestScore = strlen($name);
                $best = $item;
            }
        }

        return $best;
    }

    private function significantWords(string $text): array
    {
        $words = preg_split('/[^a-z0-9]+/', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_unique(array_filter(
            $words,
            fn ($w) => strlen($w) >= self::MIN_PRODUCT_WORD_LENGTH
        )));
    }

    private function formatPrice(array $product): string
    {
        return $product['has_discount']
            ? 'S/ '.number_format($product['final_price'], 2)
            : 'S/ '.number_format($product['price'], 2);
    }

    private function singleProductResponse(array $product): array
    {
        $lines = ["**{$product['name']}**"];

        if ($product['has_discount']) {
            $lines[] = 'Precio regular: S/ '.number_format($product['price'], 2);
            $lines[] = '**Precio con descuento: '.$this->formatPrice($product).'** ('.$product['discount_badge'].')';
        } else {
            $lines[] = 'Precio: **'.$this->formatPrice($product).'**';
        }

        $lines[] = $product['stock'] > 0
            ? 'Stock disponible: '.$product['stock'].' unidades'
            : 'Actualmente sin stock disponible';

        if ($product['category_name']) {
            $lines[] = 'Categoría: '.$product['category_name'];
        }
        if ($product['brand_name']) {
            $lines[] = 'Marca: '.$product['brand_name'];
        }

        $lines[] = '';
        $lines[] = 'Puedes verlo aquí: '.$product['url'];

        return [
            'response' => implode("\n", $lines),
            'icon' => 'shopping-bag',
        ];
    }

    private function productListResponse(array $products, string $intro): array
    {
        $lines = [$intro, ''];

        foreach ($products as $product) {
            $stockTag = $product['stock'] > 0 ? '' : ' — sin stock';
            $lines[] = '• **'.$product['name'].'** — '.$this->formatPrice($product).$stockTag;
        }

        return [
            'response' => implode("\n", $lines),
            'icon' => 'shopping-bag',
        ];
    }

    private function categoryResponse(array $category, array $allProducts): array
    {
        $products = array_values(array_filter(
            $allProducts,
            fn ($p) => $p['category_id'] === $category['id']
        ));

        if (empty($products)) {
            return [
                'response' => "En la categoría **{$category['name']}** no tenemos productos disponibles por el momento.",
                'icon' => 'layout-grid',
            ];
        }

        usort($products, fn ($a, $b) => $b['is_featured'] <=> $a['is_featured']);
        $shown = array_slice($products, 0, self::MAX_LIST_ITEMS);

        $lines = [
            "Tenemos {$category['products_count']} producto(s) en **{$category['name']}**. Algunos ejemplos:",
            '',
        ];

        foreach ($shown as $product) {
            $lines[] = '• **'.$product['name'].'** — '.$this->formatPrice($product);
        }

        $lines[] = '';
        $lines[] = 'Ver todos: '.$category['url'];

        return [
            'response' => implode("\n", $lines),
            'icon' => 'layout-grid',
        ];
    }

    private function brandResponse(array $brand, array $allProducts): array
    {
        $products = array_values(array_filter(
            $allProducts,
            fn ($p) => $p['brand_id'] === $brand['id']
        ));

        if (empty($products)) {
            return [
                'response' => "No tenemos productos disponibles de **{$brand['name']}** por el momento.",
                'icon' => 'tag',
            ];
        }

        $shown = array_slice($products, 0, self::MAX_LIST_ITEMS);

        $lines = [
            "Tenemos {$brand['products_count']} producto(s) de **{$brand['name']}**. Algunos ejemplos:",
            '',
        ];

        foreach ($shown as $product) {
            $lines[] = '• **'.$product['name'].'** — '.$this->formatPrice($product);
        }

        return [
            'response' => implode("\n", $lines),
            'icon' => 'tag',
        ];
    }
}