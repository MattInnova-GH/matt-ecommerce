<?php

namespace App\Http\Services;

class TextNormalizer
{
    /**
     * Normaliza un texto removiendo acentos y convertiendo a minúsculas
     *
     * @param string $text
     * @return string
     */
    public static function normalize(string $text): string
    {
        $from = ['á','é','í','ó','ú','ü','ñ','Á','É','Í','Ó','Ú','Ü','Ñ','¿','¡'];
        $to   = ['a','e','i','o','u','u','n','a','e','i','o','u','u','n','', '' ];

        return str_replace($from, $to, strtolower(trim($text)));
    }
}