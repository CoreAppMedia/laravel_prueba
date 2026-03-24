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
        Schema::table('partidos', function (Blueprint $table) {
            $table->boolean('pago_arbitro_local')->default(false)->after('cerrado');
            $table->boolean('pago_arbitro_visitante')->default(false)->after('pago_arbitro_local');
            $table->decimal('costo_arbitraje_total', 10, 2)->nullable()->after('pago_arbitro_visitante');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partidos', function (Blueprint $table) {
            $table->dropColumn(['pago_arbitro_local', 'pago_arbitro_visitante', 'costo_arbitraje_total']);
        });
    }
};
