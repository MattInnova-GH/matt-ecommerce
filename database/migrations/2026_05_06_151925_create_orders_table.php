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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('order_number')->unique();

            $table->foreignId('user_id')->constrained();

            $table->enum('status', ['PENDING','PAID','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'])->default('PENDING');

            $table->decimal('total', 10, 2);

            $table->text('shipping_address');

            $table->enum('payment_method', ['YAPE','PLIN'])->nullable();

            $table->text('receipt_url')->nullable();
            $table->text('payment_receipt_url')->nullable();

            $table->enum('delivery_method', ['DELIVERY','PICKUP'])->nullable();

            $table->string('pickup_store')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
