<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Tecnología', 'image' => '/static/smartwatch.png'],
            ['name' => 'Moda', 'image' => '/static/cartera.jpg'],
            ['name' => 'Hogar', 'image' => '/static/licuadora.jpg'],
            ['name' => 'Deportes', 'image' => '/static/zapatillas.jpg'],
            ['name' => 'Belleza', 'image' => '/static/belleza.jpg'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'image' => $category['image'],
                'is_active' => true,
            ]);
        }
    }
}
