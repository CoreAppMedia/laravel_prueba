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
        Schema::create('jornada_global_jornada', function (Blueprint $table) {
            $table->uuid('jornada_global_id');
            $table->uuid('jornada_id');
            
            $table->foreign('jornada_global_id')->references('id')->on('jornadas_globales')->onDelete('cascade');
            $table->foreign('jornada_id')->references('id')->on('jornadas')->onDelete('cascade');
            
            $table->primary(['jornada_global_id', 'jornada_id'], 'jg_j_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jornada_global_jornada');
    }
};
