<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->json('shipping_address')->nullable()->change();
        });

        Schema::table('payments', function (Blueprint $table) {
            // Reemplazamos el enum por un string con el default correcto
            // Esto evita los errores de CHECK constraint de SQLite al cambiar de 'pending' a 'PENDING'
            $table->string('status')->default('PENDING')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->json('shipping_address')->nullable(false)->change();
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'PAID', 'FAILED'])->default('PENDING')->change();
        });
    }
};
