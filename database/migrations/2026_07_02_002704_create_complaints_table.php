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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('document_number');
            $table->string('phone')->nullable();
            $table->string('email');
            $table->string('address')->nullable();
            $table->enum('asset_type', ['Producto', 'Servicio']);
            $table->string('asset_description');
            $table->decimal('claimed_amount', 10, 2)->nullable();
            $table->enum('complaint_type', ['Reclamo', 'Queja']);
            $table->text('problem_description');
            $table->text('consumer_request');
            $table->string('status')->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
