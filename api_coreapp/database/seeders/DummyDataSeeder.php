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
                    'nombre' => 'Liga Premier Zapotlán',
                    'fecha_inicio' => '2026-07-15',
                    'fecha_fin' => '2026-12-15',
                    'es_abierto' => true,
                    'costo_inscripcion' => 2500.00,
                    'costo_arbitraje_por_partido' => 350.50,
                    'estatus' => 'En Inscripción',
                ],
                [
                    'temporada_id' => $temporadaIds[1], // Clausura
                    'tipo_torneo_id' => $tiposTorneo->firstWhere('nombre', 'Copa')->id ?? $tiposTorneo->first()->id,
                    'nombre' => 'Copa Independencia',
                    'fecha_inicio' => '2026-09-01',
                    'fecha_fin' => '2026-09-30',
                    'es_abierto' => false,
                    'costo_inscripcion' => 1000.00,
                    'costo_arbitraje_por_partido' => 400.00,
                    'estatus' => 'Planeación',
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
            ['nombre' => 'Club Deportivo La Estación', 'es_club' => true, 'telefono' => '3411234567', 'correo' => 'contacto@laestacion.com', 'activo' => true],
            ['nombre' => 'Real Zapotlán', 'es_club' => true, 'telefono' => '3419876543', 'correo' => 'info@realzapotlan.com', 'activo' => true],
            ['nombre' => 'Atlético San José', 'es_club' => false, 'telefono' => '3415555555', 'correo' => null, 'activo' => true],
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
                ['club_id' => $clubIds[0], 'categoria_id' => $catAmateurId, 'nombre_mostrado' => 'La Estación A', 'activo' => true],
                ['club_id' => $clubIds[0], 'categoria_id' => $catReservaId, 'nombre_mostrado' => 'La Estación Fuerzas Básicas', 'activo' => true],
                ['club_id' => $clubIds[1], 'categoria_id' => $catAmateurId, 'nombre_mostrado' => 'Real Zapotlán Mayor', 'activo' => true],
                ['club_id' => $clubIds[2], 'categoria_id' => $catAmateurId, 'nombre_mostrado' => 'Atlético San José', 'activo' => true],
            ];

            foreach ($equipos as $eq) {
                Equipo::updateOrCreate(
                [
                    'nombre_mostrado' => $eq['nombre_mostrado'],
                    'club_id' => $eq['club_id']
                ],
                    $eq
                );
            }
        }
    }
}