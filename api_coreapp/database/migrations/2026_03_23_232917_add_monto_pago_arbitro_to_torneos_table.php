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
        Schema::table('torneos', function (Blueprint $table) {
            $table->decimal('monto_pago_arbitro', 12, 2)->nullable()->after('costo_arbitraje_por_partido');
        });
    }

    public function down(): void
    {
        Schema::table('torneos', function (Blueprint $table) {
            $table->dropColumn('monto_pago_arbitro');
        });
    }
};
