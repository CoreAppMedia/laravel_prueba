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
        Schema::create('cancha_horarios', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cancha_id')->constrained('canchas')->onDelete('cascade');
            $table->integer('dia_semana')->comment('1=Lunes, 7=Domingo');
            $table->time('hora');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancha_horarios');
    }
};
