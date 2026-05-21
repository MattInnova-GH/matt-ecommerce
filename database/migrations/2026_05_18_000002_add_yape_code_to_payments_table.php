<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('yape_phone')->nullable()->after('receipt_url');
            $table->string('yape_code')->nullable()->after('yape_phone');
            $table->string('yape_mode')->nullable()->after('yape_code'); // 'code' | 'qr'
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['yape_phone', 'yape_code', 'yape_mode']);
        });
    }
};
