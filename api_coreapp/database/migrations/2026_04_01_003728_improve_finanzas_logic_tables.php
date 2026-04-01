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
            $table->nullableUuidMorphs('payable');
            $table->string('metodo_pago')->nullable()->default('Efectivo')->after('monto');
            $table->string('comprobante_url')->nullable()->after('metodo_pago');
            $table->softDeletesTz();
        });

        Schema::table('egresos', function (Blueprint $table) {
            $table->nullableUuidMorphs('payable');
            $table->string('metodo_pago')->nullable()->default('Efectivo')->after('monto');
            $table->string('comprobante_url')->nullable()->after('metodo_pago');
            $table->softDeletesTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingresos', function (Blueprint $table) {
            $table->dropMorphs('payable');
            $table->dropColumn(['metodo_pago', 'comprobante_url']);
            $table->dropSoftDeletesTz();
        });

        Schema::table('egresos', function (Blueprint $table) {
            $table->dropMorphs('payable');
            $table->dropColumn(['metodo_pago', 'comprobante_url']);
            $table->dropSoftDeletesTz();
        });
    }
};
