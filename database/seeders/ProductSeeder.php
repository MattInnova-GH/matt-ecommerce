<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return;
        }

        foreach ($categories as $category) {
            for ($i = 1; $i <= 3; $i++) {
                $name = $category->name.' Product '.$i;
                Product::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => 'Descripción del producto '.$name,
                    'price' => rand(10, 500),
                    'stock' => rand(10, 100),
                    'thumbnail' => $category->image, // Use the same image for simplicity
                    'is_active' => true,
                    'is_featured' => true,
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
