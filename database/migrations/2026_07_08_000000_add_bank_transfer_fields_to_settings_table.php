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
        Schema::table('settings', function (Blueprint $table) {
            $table->string('bank_name')->nullable()->after('yape_number');
            $table->string('bank_account_number')->nullable()->after('bank_name');
            $table->string('bank_cci')->nullable()->after('bank_account_number');
            $table->string('bank_holder')->nullable()->after('bank_cci');
            $table->string('bank_currency')->nullable()->after('bank_holder');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'bank_account_number', 'bank_cci', 'bank_holder', 'bank_currency']);
        });
    }
};
