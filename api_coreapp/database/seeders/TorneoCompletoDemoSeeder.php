<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;
use App\Models\Equipo;
use App\Models\Cancha;
use App\Models\CanchaHorario;
use App\Models\CatalogoCategoria;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TorneoCompletoDemoSeeder extends Seeder
{
    /**
     * Configuración de sedes (canchas)
     * Modifica este array para personalizar las canchas
     */
    private function getConfiguracionCanchas()
    {
        return [
            [
                'nombre' => 'Cancha zapotitlán #1',
                'direccion' => 'Deportivo de Santiago zapotitlán, Tláhuac',
                'tipo_cancha' => 'Fútbol 11',
                'techada' => true,
                'iluminacion' => true,
                'capacidad' => 500,
                'horarios' => [
                    ['dia_semana' => 7, 'hora_inicio' => '07:30', 'hora_fin' => '09:00'], // Domingo 7:30-9
                    ['dia_semana' => 7, 'hora_inicio' => '09:00', 'hora_fin' => '10:30'], // Domingo 09-10:30
                    ['dia_semana' => 7, 'hora_inicio' => '10:30', 'hora_fin' => '12:00'], // Domingo 10:30-12
                    ['dia_semana' => 7, 'hora_inicio' => '12:00', 'hora_fin' => '13:30'], // Domingo 12-13:30
                    ['dia_semana' => 7, 'hora_inicio' => '13:30', 'hora_fin' => '15:00'], // Domingo 13:30-15
                    ['dia_semana' => 7, 'hora_inicio' => '15:00', 'hora_fin' => '16:30'], // Domingo 15-16:30
                ]
            ],
            [
                'nombre' => 'Cancha zapotitlán #2',
                'direccion' => 'Deportivo de Santiago zapotitlán, Tláhuac',
                'tipo_cancha' => 'Fútbol 11',
                'techada' => false,
                'iluminacion' => false,
                'capacidad' => 500,
                'horarios' => [
                    ['dia_semana' => 7, 'hora_inicio' => '07:30', 'hora_fin' => '09:00'], // Domingo 7:30-9
                    ['dia_semana' => 7, 'hora_inicio' => '09:00', 'hora_fin' => '10:30'], // Domingo 09-10:30
                    ['dia_semana' => 7, 'hora_inicio' => '10:30', 'hora_fin' => '12:00'], // Domingo 10:30-12
                    ['dia_semana' => 7, 'hora_inicio' => '12:00', 'hora_fin' => '13:30'], // Domingo 12-13:30
                    ['dia_semana' => 7, 'hora_inicio' => '13:30', 'hora_fin' => '15:00'], // Domingo 13:30-15
                    ['dia_semana' => 7, 'hora_inicio' => '15:00', 'hora_fin' => '16:30'], // Domingo 15-16:30
                ]
            ],
            [
                'nombre' => 'Cancha Los tres Martinez',
                'direccion' => 'Calle Los tres Martinez, Tláhuac',
                'tipo_cancha' => 'Fútbol 11',
                'techada' => false,
                'iluminacion' => false,
                'capacidad' => 150,
                'horarios' => [
                    ['dia_semana' => 7, 'hora_inicio' => '07:30', 'hora_fin' => '09:00'], // Domingo 7:30-9
                    ['dia_semana' => 7, 'hora_inicio' => '09:00', 'hora_fin' => '10:30'], // Domingo 09-10:30
                    ['dia_semana' => 7, 'hora_inicio' => '10:30', 'hora_fin' => '12:00'], // Domingo 10:30-12
                    ['dia_semana' => 7, 'hora_inicio' => '12:00', 'hora_fin' => '13:30'], // Domingo 12-13:30
                    ['dia_semana' => 7, 'hora_inicio' => '13:30', 'hora_fin' => '15:00'], // Domingo 13:30-15
                    ['dia_semana' => 7, 'hora_inicio' => '15:00', 'hora_fin' => '16:30'], // Domingo 15-16:30
                ]
            ]
        ];
    }

    /**
     * Configuración de equipos
     * Modifica este array para personalizar los clubes y equipos
     */
    private function getConfiguracionEquipos()
    {
        return [
            [
                'nombre_club' => 'CD ORO',
                'nombre_equipo' => 'CD ORO',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable CD ORO'
            ],
            [
                'nombre_club' => 'INTER ZAPOTITLAN',
                'nombre_equipo' => 'INTER ZAPOTITLAN',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable INTER ZAPOTITLAN'
            ],
            [
                'nombre_club' => 'TORINO',
                'nombre_equipo' => 'TORINO',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable TORINO'
            ],
            [
                'nombre_club' => 'CD ATLANTE',
                'nombre_equipo' => 'CD ATLANTE',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable CD ATLANTE'
            ],
            [
                'nombre_club' => 'POLITECNICO',
                'nombre_equipo' => 'POLITECNICO',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable POLITECNICO'
            ],
            [
                'nombre_club' => 'A.C. LIBRADO',
                'nombre_equipo' => 'A.C. LIBRADO',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable A.C. LIBRADO'
            ],
            [
                'nombre_club' => 'NVO. NECAXA',
                'nombre_equipo' => 'NVO. NECAXA',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable NVO. NECAXA'
            ],
            [
                'nombre_club' => 'C.D. RECORD',
                'nombre_equipo' => 'C.D. RECORD',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable C.D. RECORD'
            ],
            [
                'nombre_club' => 'VASCO INDEPENDENCIA',
                'nombre_equipo' => 'VASCO INDEPENDENCIA',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable VASCO INDEPENDENCIA'
            ],
            [
                'nombre_club' => 'ATLANTE Z',
                'nombre_equipo' => 'ATLANTE Z',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable ATLANTE Z'
            ],
            [
                'nombre_club' => 'NECAXA A-2',
                'nombre_equipo' => 'NECAXA A-2',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable NECAXA A-2'
            ],
            [
                'nombre_club' => 'ANGELES',
                'nombre_equipo' => 'ANGELES',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable ANGELES'
            ],
            [
                'nombre_club' => 'ZAPORO CITY',
                'nombre_equipo' => 'ZAPORO CITY',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable ZAPORO CITY'
            ],
            [
                'nombre_club' => 'REVOLUCION',
                'nombre_equipo' => 'REVOLUCION',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable REVOLUCION'
            ],
            [
                'nombre_club' => 'MORELOS',
                'nombre_equipo' => 'MORELOS',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable MORELOS'
            ],
            [
                'nombre_club' => 'VILLALOBOS',
                'nombre_equipo' => 'VILLALOBOS',
                'telefono_contacto' => '5511111111',
                'responsable' => 'Responsable VILLALOBOS'
            ]
        ];
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equiposConfig = $this->getConfiguracionEquipos();
        $canchasConfig = $this->getConfiguracionCanchas();
        
        // 1. Asegurar que los catálogos existan
        $this->call([
            CatalogosSeeder::class,
        ]);

        $catAmateurId = CatalogoCategoria::where('nombre', 'LIKE', '%Amateur%')->first()?->id;

        // 2. Crear Sedes (Canchas) y sus Horarios
        $canchasCreadas = [];
        foreach ($canchasConfig as $canchaConfig) {
            $cancha = Cancha::create([
                'id' => (string) Str::uuid(),
                'nombre' => $canchaConfig['nombre'],
                'direccion' => $canchaConfig['direccion'],
                'imagen_url' => 'https://images.unsplash.com/photo-1518605368461-1ee7c191a039?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'activa' => true
            ]);
            
            // Crear horarios de la cancha
            foreach ($canchaConfig['horarios'] as $horario) {
                CanchaHorario::create([
                    'id' => (string) Str::uuid(),
                    'cancha_id' => $cancha->id,
                    'dia_semana' => $horario['dia_semana'],
                    'hora' => $horario['hora_inicio'] . ':00',
                    'activo' => true
                ]);
            }
            
            $canchasCreadas[] = $cancha;
        }

        // 3. Crear Clubes y Equipos
        
        if (empty($equiposConfig)) {
            $this->command->error('No hay equipos configurados. Edita getConfiguracionEquipos().');
            return;
        }

        $equipos = [];
        foreach ($equiposConfig as $index => $equipoConfig) {
            $club = Club::create([
                'id' => (string) Str::uuid(),
                'nombre' => $equipoConfig['nombre_club'],
                'telefono' => $equipoConfig['telefono_contacto'],
                'es_club' => true,
                'activo' => true
            ]);

            // Crear equipo SIN asignar cancha (para asignación manual posterior)
            $equipo = Equipo::create([
                'id' => (string) Str::uuid(),
                'club_id' => $club->id,
                'categoria_id' => $catAmateurId,
                'nombre_mostrado' => $equipoConfig['nombre_equipo'],
                'cancha_id' => null, // Sin asignar
                'cancha_horario_id' => null, // Sin asignar
                'activo' => true
            ]);
            $equipos[] = $equipo;
        }
        
        $this->command->info('¡Sedes y equipos cargados con éxito!');
        $this->command->info('- ' . count($canchasCreadas) . ' sedes (canchas) creadas con sus horarios');
        $this->command->info('- ' . count($equipos) . ' equipos creados sin cancha asignada');
        $this->command->info('');
        $this->command->info('Puedes asignar manualmente las canchas a los equipos cuando sea necesario.');
    }
}
