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
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();

            $table->string('ticket_number')->unique();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('status', ['PENDING', 'IN_REVIEW', 'RESOLVED', 'CLOSED'])->default('PENDING');
            $table->enum('priority', ['LOW', 'MEDIUM', 'HIGH'])->default('MEDIUM');
            $table->enum('category', [
                'FEATURE_PRODUCT',
                'ORDER_PROBLEM',
                'PAYMENT_VALIDATION',
                'SHIPPING_ISSUE',
                'PRODUCT_ISSUE',
                'OTHER',
            ]);

            $table->string('title');
            $table->text('description');

            $table->string('order_number')->nullable();
            $table->string('product_name')->nullable();

            $table->json('attachments')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
    }
};
