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
        Schema::table('seller_requests', function (Blueprint $table) {
            $table->dropColumn('tax_id');
            $table->string('tax_id_type')->nullable()->after('message');
            $table->string('tax_id_number')->nullable()->after('tax_id_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seller_requests', function (Blueprint $table) {
            $table->string('tax_id')->after('message');
            $table->dropColumn(['tax_id_type', 'tax_id_number']);
        });
    }
};
