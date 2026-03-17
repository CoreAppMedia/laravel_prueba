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
            ['nombre' => 'Apertura 2026', 'fecha_inicio' => '2026-01-01', 'fecha_fin' => '2026-06-30', 'activa' => false],
            ['nombre' => 'Clausura 2026', 'fecha_inicio' => '2026-07-01', 'fecha_fin' => '2026-12-31', 'activa' => true],
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
                    'temporada_id' => $temporadaIds[1], // Clausura
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
                    'temporada_id' => $temporadaIds[1], // Clausura
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
                    'temporada_id' => $temporadaIds[1], // Clausura
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

        // 3. Clubs
        $clubs = [
            ['nombre' => 'Record FC', 'es_club' => true, 'telefono' => '3411234567', 'correo' => 'contacto@laestacion.com', 'activo' => true],
            ['nombre' => 'Zapotlán FC', 'es_club' => true, 'telefono' => '3419876543', 'correo' => 'info@realzapotlan.com', 'activo' => true],
            ['nombre' => 'Zapotlán FC', 'es_club' => true, 'telefono' => '3419876543', 'correo' => 'info@realzapotlan.com', 'activo' => true],
        ];

        $clubIds = [];
        foreach ($clubs as $c) {
            $club = Club::firstOrCreate(
            ['nombre' => $c['nombre']],
                $c
            );
            $clubIds[] = $club->id;
        }

        // 4. Equipos
        $categorias = CatalogoCategoria::all();
        if ($categorias->count() > 0 && count($clubIds) > 0) {
            $catAmateurId = $categorias->firstWhere('nombre', 'Amateur')->id ?? $categorias->first()->id;
            $catReservaId = $categorias->firstWhere('nombre', 'Reserva')->id ?? $categorias->last()->id;

            $equipos = [
                ['club_id' => $clubIds[0], 'categoria_id' => $catAmateurId, 'nombre_mostrado' => 'Record amateur', 'activo' => true],
                ['club_id' => $clubIds[1], 'categoria_id' => $catAmateurId, 'nombre_mostrado' => 'Zapotlán amateur', 'activo' => true],
            ];

            foreach ($equipos as $eq) {
                Equipo::updateOrCreate(
                [
                    'club_id' => $eq['club_id'],
                    'categoria_id' => $eq['categoria_id']
                ],
                    $eq
                );
            }
        }
    }
}