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
            $table->dropColumn(['cancha', 'horario']);
            $table->foreignUuid('cancha_id')->nullable()->constrained('canchas')->nullOnDelete();
            $table->foreignUuid('cancha_horario_id')->nullable()->constrained('cancha_horarios')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partidos', function (Blueprint $table) {
            $table->dropForeign(['cancha_id']);
            $table->dropForeign(['cancha_horario_id']);
            $table->dropColumn(['cancha_id', 'cancha_horario_id']);
            $table->string('cancha')->nullable();
            $table->string('horario')->nullable();
        });
    }
};
