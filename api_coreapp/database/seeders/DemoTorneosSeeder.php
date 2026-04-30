<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Torneo;
use App\Models\Directivo;
use App\Models\Club;
use App\Models\Equipo;
use App\Models\CatalogoCategoria;
use App\Models\CatalogoTipoTorneo;
use App\Models\CatalogoTipoDueno;
use App\Models\Temporada;
use App\Models\Cancha;
use Illuminate\Support\Str;

class DemoTorneosSeeder extends Seeder
{
    public function run()
    {
        $categoria = CatalogoCategoria::first();
        $tipoTorneo = CatalogoTipoTorneo::first();
        $tipoDueno = CatalogoTipoDueno::first();
        $temporada = Temporada::first();
        $canchas = Cancha::all();

        if (!$categoria || !$tipoTorneo || !$tipoDueno || !$temporada || $canchas->isEmpty()) {
            $this->command->error('Faltan catálogos base o canchas para ejecutar el seeder. Ejecuta los seeders base primero.');
            return;
        }

        $ligas = [
            [
                'nombre' => 'Liga MX Apertura 2026',
                'equipos' => ['Club América', 'Chivas', 'Cruz Azul', 'Pumas UNAM', 'Tigres UANL', 'Monterrey']
            ],
            [
                'nombre' => 'Bundesliga 2026',
                'equipos' => ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'Eintracht Frankfurt', 'VfB Stuttgart']
            ],
            [
                'nombre' => 'MLS 2026',
                'equipos' => ['Inter Miami', 'LA Galaxy', 'LAFC', 'Seattle Sounders', 'Columbus Crew', 'Atlanta United']
            ]
        ];

        foreach ($ligas as $ligaData) {
            // 1. Crear Torneo
            $torneo = Torneo::firstOrCreate(
                [
                    'temporada_id' => $temporada->id,
                    'nombre' => $ligaData['nombre'],
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'categoria_id' => $categoria->id,
                    'tipo_torneo_id' => $tipoTorneo->id,
                    'estatus' => 'activo',
                    'fecha_inicio' => now()->toDateString(),
                    'fecha_fin' => now()->addMonths(6)->toDateString(),
                ]
            );

            $this->command->info("Torneo creado: {$torneo->nombre}");

            foreach ($ligaData['equipos'] as $index => $equipoNombre) {
                // 2. Crear Directivo (Presidente/Delegado)
                $directivo = Directivo::firstOrCreate(
                    ['nombre' => 'Presidente ' . $equipoNombre],
                    [
                        'id' => Str::uuid()->toString(),
                        'telefono' => '5551234' . rand(100, 999),
                        'catalogo_tipo_dueno_id' => $tipoDueno->id,
                    ]
                );

                // 3. Crear Club
                $club = Club::firstOrCreate(
                    ['nombre' => $equipoNombre . ' FC'],
                    [
                        'id' => Str::uuid()->toString(),
                        'directivo_id' => $directivo->id,
                    ]
                );

                // Asignar una cancha de las existentes de forma rotativa
                $canchaAsignada = $canchas[$index % $canchas->count()];

                // 4. Crear Equipo
                $equipo = Equipo::firstOrCreate(
                    ['nombre_mostrado' => $equipoNombre, 'club_id' => $club->id],
                    [
                        'id' => Str::uuid()->toString(),
                        'categoria_id' => $categoria->id,
                        'directivo_id' => $directivo->id,
                        'cancha_id' => $canchaAsignada->id,
                        'activo' => true,
                    ]
                );

                // 5. Inscribir al torneo
                $equipo->torneos()->attach($torneo->id, [
                    'fecha_inscripcion' => now(),
                    'pagado_inscripcion' => true,
                ]);
            }
        }

        $this->command->info('Ligas (Liga MX, Bundesliga, MLS) generadas y pobladas con éxito.');
    }
}
