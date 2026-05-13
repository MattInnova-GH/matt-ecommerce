<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = ['image_path', 'is_active', 'order', 'type'];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // Accesor para obtener la URL completa de la imagen
    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/'.$this->image_path) : null;
    }

    // Validación: solo puede haber un banner principal
    protected static function booted()
    {
        static::saving(function ($banner) {
            if ($banner->type === 'main') {
                static::where('type', 'main')
                    ->where('id', '!=', $banner->id)
                    ->update(['type' => 'promotional']);
            }
        });
    }
}
