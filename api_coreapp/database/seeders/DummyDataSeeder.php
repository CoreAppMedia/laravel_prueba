<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Temporada;
use App\Models\Torneo;
use App\Models\Club;
use App\Models\Equipo;
use App\Models\CatalogoTipoTorneo;
use App\Models\CatalogoCategoria;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        // 1. Temporadas
        $temporadas = [
            ['nombre' => 'Apertura 2026', 'fecha_inicio' => '2026-01-01', 'fecha_fin' => '2026-12-31', 'activa' => false],
        ];

        $temporadaIds = [];
        foreach ($temporadas as $t) {
            $temporada = Temporada::updateOrCreate(
            ['nombre' => $t['nombre']],
                $t
            );
            $temporadaIds[] = $temporada->id;
        }

        // 2. Torneos
        $tiposTorneo = CatalogoTipoTorneo::all();
        $torneoIds = [];
        if ($tiposTorneo->count() > 0 && count($temporadaIds) > 0) {
            $torneos = [
                [
                    'temporada_id' => $temporadaIds[0], // Clausura
                    'tipo_torneo_id' => $tiposTorneo->firstWhere('nombre', 'Liga')->id ?? $tiposTorneo->first()->id,
                    'nombre' => 'Liga amateur',
                    'fecha_inicio' => '2026-07-15',
                    'fecha_fin' => '2026-12-15',
                    'es_abierto' => true,
                    'costo_inscripcion' => 3000.00,
                    'costo_arbitraje_por_partido' => 280.00,
                    'estatus' => 'En Inscripción',
                ],
                [
                    'temporada_id' => $temporadaIds[0], // Clausura
                    'tipo_torneo_id' => $tiposTorneo->firstWhere('nombre', 'Liga')->id ?? $tiposTorneo->first()->id,
                    'nombre' => 'Liga Primera Especial',
                    'fecha_inicio' => '2026-09-01',
                    'fecha_fin' => '2026-09-30',
                    'es_abierto' => false,
                    'costo_inscripcion' => 3000.00,
                    'costo_arbitraje_por_partido' => 280.00,
                    'estatus' => 'En Inscripción',
                ],
                [
                    'temporada_id' => $temporadaIds[0], // Clausura
                    'tipo_torneo_id' => $tiposTorneo->firstWhere('nombre', 'Liga')->id ?? $tiposTorneo->first()->id,
                    'nombre' => 'Liga Reserva Especial',
                    'fecha_inicio' => '2026-09-01',
                    'fecha_fin' => '2026-09-30',
                    'es_abierto' => false,
                    'costo_inscripcion' => 3000.00,
                    'costo_arbitraje_por_partido' => 280.00,
                    'estatus' => 'En Inscripción',
                ],
            ];

            foreach ($torneos as $tor) {
                $torneo = Torneo::updateOrCreate(
                ['nombre' => $tor['nombre'], 'temporada_id' => $tor['temporada_id']],
                    $tor
                );
            }
        }
    }
}