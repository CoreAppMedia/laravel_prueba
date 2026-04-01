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
            $table->string('motivo_no_pago_arbitro_local')->nullable()->after('pago_arbitro_local');
            $table->string('motivo_no_pago_arbitro_visitante')->nullable()->after('pago_arbitro_visitante');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partidos', function (Blueprint $table) {
            $table->dropColumn(['motivo_no_pago_arbitro_local', 'motivo_no_pago_arbitro_visitante']);
        });
    }
};
