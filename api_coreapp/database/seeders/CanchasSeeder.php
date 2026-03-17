<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cancha;
use App\Models\CanchaHorario;

class CanchasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $canchasData = [
            [
                'nombre' => 'Campo Zapotilan #1',
                'direccion' => 'Sebastián Trejo, Santiago Sur, Tláhuac, 13300 Ciudad de México, CDMX',
                'imagen_url' => 'https://images.unsplash.com/photo-1518605368461-1ee7c191a039?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'activa' => true,
                'horarios' => [
                    ['dia_semana' => 7, 'hora' => '07:30:00'],
                    ['dia_semana' => 7, 'hora' => '09:00:00'],
                    ['dia_semana' => 7, 'hora' => '10:30:00'],
                    ['dia_semana' => 7, 'hora' => '12:00:00'],
                ]
            ],
            [
                'nombre' => 'Campo Zapotilan #2',
                'direccion' => 'Sebastián Trejo, Santiago Sur, Tláhuac, 13300 Ciudad de México, CDMX',
                'imagen_url' => 'https://images.unsplash.com/photo-1513128034602-7814ccbccd4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'activa' => true,
                'horarios' => [
                    ['dia_semana' => 7, 'hora' => '07:30:00'],
                    ['dia_semana' => 7, 'hora' => '09:00:00'],
                    ['dia_semana' => 7, 'hora' => '10:30:00'],
                    ['dia_semana' => 7, 'hora' => '12:00:00'],
                ]
            ],
            [
                'nombre' => 'Campo Los tres Martinez',
                'direccion' => 'Cuitláhuac, Tláhuac, 13419 Ciudad de México, CDMX',
                'imagen_url' => 'https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'activa' => true,
                'horarios' => [
                    ['dia_semana' => 7, 'hora' => '07:30:00'],
                    ['dia_semana' => 7, 'hora' => '09:00:00'],
                    ['dia_semana' => 7, 'hora' => '10:30:00'],
                    ['dia_semana' => 7, 'hora' => '12:00:00'],
                ]
            ]
        ];

        foreach ($canchasData as $data) {
            $cancha = Cancha::updateOrCreate(
                ['nombre' => $data['nombre']],
                [
                    'direccion' => $data['direccion'],
                    'imagen_url' => $data['imagen_url'],
                    'activa' => $data['activa'],
                ]
            );

            // Eliminar horarios anteriores para no duplicarlos si se corre el seeder de nuevo
            $cancha->horarios()->delete();

            foreach ($data['horarios'] as $horario) {
                CanchaHorario::create([
                    'cancha_id' => $cancha->id,
                    'dia_semana' => $horario['dia_semana'],
                    'hora' => $horario['hora'],
                    'activo' => true
                ]);
            }
        }
    }
}
