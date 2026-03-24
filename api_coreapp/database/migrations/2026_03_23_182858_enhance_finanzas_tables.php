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
        Schema::table('ingresos', function (Blueprint $table) {
            $table->foreignUuid('torneo_id')->nullable()->change();
            $table->string('categoria')->nullable()->after('concepto');
        });

        Schema::table('egresos', function (Blueprint $table) {
            $table->foreignUuid('torneo_id')->nullable()->change();
            $table->string('categoria')->nullable()->after('concepto');
            $table->foreignUuid('jornada_id')->nullable()->after('torneo_id')->constrained('jornadas')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ingresos', function (Blueprint $table) {
            $table->foreignUuid('torneo_id')->nullable(false)->change();
            $table->dropColumn('categoria');
        });

        Schema::table('egresos', function (Blueprint $table) {
            $table->foreignUuid('torneo_id')->nullable(false)->change();
            $table->dropColumn(['categoria', 'jornada_id']);
        });
    }
};
