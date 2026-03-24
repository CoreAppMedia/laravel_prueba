<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Temporada;
use App\Models\Torneo;
use App\Models\Club;
use App\Models\Equipo;
use App\Models\Arbitro;
use App\Models\Cancha;
use App\Models\CanchaHorario;
use App\Models\Jornada;
use App\Models\Partido;
use App\Models\PartidoArbitro;
use App\Models\Ingreso;
use App\Models\Egreso;
use App\Models\Multa;
use App\Models\CatalogoTipoTorneo;
use App\Models\CatalogoCategoria;
use App\Models\CatalogoEstadoPartido;
use App\Models\CatalogoTipoMulta;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TorneoCompletoDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Asegurar que los catálogos y canchas existan
        $this->call([
            CatalogosSeeder::class,
            CanchasSeeder::class,
        ]);

        $tipoLigaId = CatalogoTipoTorneo::where('nombre', 'Liga')->first()?->id;
        $catAmateurId = CatalogoCategoria::where('nombre', 'LIKE', '%Amateur%')->first()?->id;
        $estadoJugadoId = CatalogoEstadoPartido::where('nombre', 'Jugado')->first()?->id;
        $estadoProgramadoId = CatalogoEstadoPartido::where('nombre', 'Programado')->first()?->id;
        $tipoMultaAdmId = CatalogoTipoMulta::first()?->id;

        // 2. Temporada Actual
        $temporada = Temporada::firstOrCreate(
            ['nombre' => 'Temporada Premier 2024'],
            [
                'id' => (string) Str::uuid(),
                'fecha_inicio' => '2024-01-01',
                'fecha_fin' => '2024-12-31',
                'activa' => true
            ]
        );

        // 3. Torneo de Demostración
        $torneo = Torneo::create([
            'id' => (string) Str::uuid(),
            'temporada_id' => $temporada->id,
            'tipo_torneo_id' => $tipoLigaId,
            'categoria_id' => $catAmateurId,
            'nombre' => 'Copa Independencia 2024',
            'fecha_inicio' => Carbon::now()->startOfMonth()->format('Y-m-d'),
            'fecha_fin' => Carbon::now()->addMonths(4)->endOfMonth()->format('Y-m-d'),
            'es_abierto' => true,
            'costo_inscripcion' => 3200.00,
            'costo_arbitraje_por_partido' => 450.00,
            'estatus' => 'En Curso',
            'dias_juego' => [7] // Domingos
        ]);

        // 4. Árbitros del Torneo
        $nombresArbitros = ['Marcos Sandoval', 'Arturo Brizio', 'Felipe Ramos', 'César Palazuelos', 'Lucila Venegas'];
        $arbitrosIds = [];
        foreach ($nombresArbitros as $nombre) {
            $arbitro = Arbitro::create([
                'id' => (string) Str::uuid(),
                'nombre' => $nombre,
                'telefono' => '55' . rand(10000000, 99999999),
                'activo' => true
            ]);
            $arbitrosIds[] = $arbitro->id;
            
            // Inscribir árbitro al torneo
            DB::table('torneo_arbitro')->insert([
                'torneo_id' => $torneo->id,
                'arbitro_id' => $arbitro->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 5. Clubes y Equipos (8 equipos para 4 juegos por jornada)
        $nombresClubes = [
            'Águilas del Pedregal', 'Real Zapotlán', 'Rayos de Tláhuac', 'Combinado Obreros',
            'Pumas MX', 'Chivas Oro', 'Cruz Azul Norte', 'Lobos Galácticos'
        ];
        
        // Obtener slots de canchas y horarios disponibles
        $canchasConHorarios = Cancha::with('horarios')->get();
        $slots = [];
        foreach ($canchasConHorarios as $c) {
            foreach ($c->horarios as $h) {
                $slots[] = ['cancha_id' => $c->id, 'cancha_horario_id' => $h->id];
            }
        }

        $equipos = [];
        foreach ($nombresClubes as $index => $nombre) {
            $club = Club::create([
                'id' => (string) Str::uuid(),
                'nombre' => $nombre,
                'es_club' => true,
                'activo' => true
            ]);

            // Asignar un slot de cancha/horario al equipo (cíclico si hay menos de 8 slots)
            $slot = $slots[$index % count($slots)];

            $equipo = Equipo::create([
                'id' => (string) Str::uuid(),
                'club_id' => $club->id,
                'categoria_id' => $catAmateurId,
                'nombre_mostrado' => $nombre,
                'cancha_id' => $slot['cancha_id'],
                'cancha_horario_id' => $slot['cancha_horario_id'],
                'activo' => true
            ]);
            $equipos[] = $equipo;

            // Inscribir equipo al torneo (Pivot)
            DB::table('equipo_torneo')->insert([
                'id' => (string) Str::uuid(),
                'equipo_id' => $equipo->id,
                'torneo_id' => $torneo->id,
                'fecha_inscripcion' => Carbon::now()->subDays(15),
                'pagado_inscripcion' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Registrar Ingreso por inscripción
            Ingreso::create([
                'id' => (string) Str::uuid(),
                'torneo_id' => $torneo->id,
                'concepto' => "Inscripción: " . $equipo->nombre_mostrado,
                'categoria' => 'inscripcion',
                'monto' => 3200.00,
                'fecha' => Carbon::now()->subDays(14)
            ]);
        }

        // 6. Jornadas
        // Jornada 1 (Cerrada)
        $jornada1 = Jornada::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => $torneo->id,
            'numero' => 1,
            'fecha_inicio' => Carbon::now()->subDays(10)->startOfDay(),
            'fecha_fin' => Carbon::now()->subDays(4)->endOfDay(),
            'cerrada' => true
        ]);

        // Jornada 2 (Abierta - En curso)
        $jornada2 = Jornada::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => $torneo->id,
            'numero' => 2,
            'fecha_inicio' => Carbon::now()->subDays(3)->startOfDay(),
            'fecha_fin' => Carbon::now()->addDays(3)->endOfDay(),
            'cerrada' => false
        ]);

        if (empty($equipos)) return;

        // Partidos Jornada 1 (Simular 4 partidos JUGADOS)
        for ($i = 0; $i < 4; $i++) {
            $local = $equipos[$i];
            $visitante = $equipos[7 - $i];

            $partido = Partido::create([
                'id' => (string) Str::uuid(),
                'jornada_id' => $jornada1->id,
                'equipo_local_id' => $local->id,
                'equipo_visitante_id' => $visitante->id,
                'estado_partido_id' => $estadoJugadoId,
                'cancha_id' => $local->cancha_id,
                'cancha_horario_id' => $local->cancha_horario_id,
                'fecha' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'goles_local' => rand(0, 3),
                'goles_visitante' => rand(0, 3),
                'cerrado' => true
            ]);

            // Pago de Arbitraje Jornada 1
            $arbitroId = $arbitrosIds[rand(0, 4)];
            $arbitro = Arbitro::find($arbitroId);
            
            DB::table('partido_arbitro')->insert([
                'id' => (string) Str::uuid(),
                'partido_id' => $partido->id,
                'arbitro_id' => $arbitroId,
                'rol' => 'Central',
                'pago' => 450.00,
                'pagado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Egreso por arbitraje
            Egreso::create([
                'id' => (string) Str::uuid(),
                'torneo_id' => $torneo->id,
                'jornada_id' => $jornada1->id,
                'concepto' => "Arbitraje: {$arbitro->nombre} - Partido: {$local->nombre_mostrado} vs {$visitante->nombre_mostrado}",
                'categoria' => 'arbitraje',
                'monto' => 450.00,
                'fecha' => Carbon::now()->subDays(7)
            ]);
        }

        // Partidos Jornada 2 (Simular 2 JUGADOS y 2 PROGRAMADOS)
        $enfrentamientosJ2 = [
            [0, 2], [1, 3], [4, 6], [5, 7]
        ];

        foreach ($enfrentamientosJ2 as $idx => $pair) {
            $local = $equipos[$pair[0]];
            $visitante = $equipos[$pair[1]];
            
            $estatus = ($idx < 2) ? $estadoJugadoId : $estadoProgramadoId;
            $cerrado = ($idx < 2);

            $partido = Partido::create([
                'id' => (string) Str::uuid(),
                'jornada_id' => $jornada2->id,
                'equipo_local_id' => $local->id,
                'equipo_visitante_id' => $visitante->id,
                'estado_partido_id' => $estatus,
                'cancha_id' => $local->cancha_id,
                'cancha_horario_id' => $local->cancha_horario_id,
                'fecha' => Carbon::now()->addDays(rand(-1, 2))->format('Y-m-d'),
                'goles_local' => $cerrado ? rand(0, 2) : null,
                'goles_visitante' => $cerrado ? rand(0, 2) : null,
                'cerrado' => $cerrado
            ]);

            // Asignar árbitro pero solo pagar si ya se jugó
            $arbitroId = $arbitrosIds[rand(0, 4)];
            $arbitro = Arbitro::find($arbitroId);
            
            DB::table('partido_arbitro')->insert([
                'id' => (string) Str::uuid(),
                'partido_id' => $partido->id,
                'arbitro_id' => $arbitroId,
                'rol' => 'Central',
                'pago' => 450.00,
                'pagado' => $cerrado,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($cerrado) {
                Egreso::create([
                    'id' => (string) Str::uuid(),
                    'torneo_id' => $torneo->id,
                    'jornada_id' => $jornada2->id,
                    'concepto' => "Arbitraje: {$arbitro->nombre} (J2)",
                    'categoria' => 'arbitraje',
                    'monto' => 450.00,
                    'fecha' => now()
                ]);
            }
        }

        // 7. Flujo de Caja General (No vinculado a torneo)
        Egreso::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => null, // Caja General
            'concepto' => "Compra de cal de marcaje (10 bultos)",
            'categoria' => 'mantenimiento',
            'monto' => 850.00,
            'fecha' => Carbon::now()->subDays(5)
        ]);

        Egreso::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => null,
            'concepto' => "Papelería y formatos de registro",
            'categoria' => 'insumos',
            'monto' => 420.00,
            'fecha' => Carbon::now()->subDays(2)
        ]);

        Ingreso::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => null,
            'concepto' => "Patrocinio Global: 'Taller El Rayo'",
            'categoria' => 'patrocinio',
            'monto' => 5000.00,
            'fecha' => Carbon::now()->subDays(10)
        ]);

        // 8. Finanzas: Una multa pagada
        $equipoMultado = $equipos[0];
        $multa = Multa::create([
            'id' => (string) Str::uuid(),
            'equipo_id' => $equipoMultado->id,
            'torneo_id' => $torneo->id,
            'tipo_multa_id' => $tipoMultaAdmId,
            'motivo' => 'Falta de uniformidad (calcetas distintas)',
            'monto' => 150.00,
            'fecha' => Carbon::now()->subDays(6),
            'pagada' => true
        ]);

        Ingreso::create([
            'id' => (string) Str::uuid(),
            'torneo_id' => $torneo->id,
            'concepto' => "Cero Tolerancia: Pago de multa - " . $equipoMultado->nombre_mostrado,
            'categoria' => 'multa',
            'monto' => 150.00,
            'fecha' => Carbon::now()->subDays(3)
        ]);
        
        $this->command->info('¡Torneo Demo cargado con éxito! 8 equipos, 2 jornadas y finanzas activas.');
    }
}
