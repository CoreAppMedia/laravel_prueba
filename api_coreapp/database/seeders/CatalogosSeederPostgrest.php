<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CatalogoTipoTorneo;
use App\Models\CatalogoCategoria;
use App\Models\CatalogoEstadoPartido;
use App\Models\CatalogoTipoMulta;

class CatalogosSeederPostgrest extends Seeder
{
    public function run(): void
    {

        /*
        |--------------------------------------------------------------------------
        | Tipos de Torneo
        |--------------------------------------------------------------------------
        */
        $tiposTorneo = [
            [
                'nombre' => 'Liga',
                'descripcion' => 'Torneo regular todos contra todos',
                'activo' => true,
            ],
            [
                'nombre' => 'Copa',
                'descripcion' => 'Torneo eliminatorio directo',
                'activo' => true,
            ],
        ];

        foreach ($tiposTorneo as $item) {
            CatalogoTipoTorneo::firstOrCreate(
                ['nombre' => $item['nombre']],
                $item
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Categorías
        |--------------------------------------------------------------------------
        */
        $categorias = [
            [
                'nombre' => 'Amateur',
                'descripcion' => 'Categoría libre amateur',
                'activo' => true,
            ],
            [
                'nombre' => 'Reserva',
                'descripcion' => 'Categoría reserva especial',
                'activo' => true,
            ],
        ];

        foreach ($categorias as $item) {
            CatalogoCategoria::firstOrCreate(
                ['nombre' => $item['nombre']],
                $item
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Estados de Partido
        |--------------------------------------------------------------------------
        */
        $estadosPartido = [
            [
                'nombre' => 'Programado',
                'descripcion' => 'Partido aún no jugado',
                'activo' => true,
            ],
            [
                'nombre' => 'Jugado',
                'descripcion' => 'Partido finalizado correctamente',
                'activo' => true,
            ],
            [
                'nombre' => 'Suspendido',
                'descripcion' => 'Partido suspendido por alguna causa',
                'activo' => true,
            ],
        ];

        foreach ($estadosPartido as $item) {
            CatalogoEstadoPartido::firstOrCreate(
                ['nombre' => $item['nombre']],
                $item
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Tipos de Multa
        |--------------------------------------------------------------------------
        */
        $tiposMulta = [
            [
                'nombre' => 'No presentación',
                'descripcion' => 'Equipo no se presentó al encuentro',
                'es_economica' => true,
                'monto_default' => 1000.00,
                'activo' => true,
            ],
            [
                'nombre' => 'Cancha en mal estado',
                'descripcion' => 'Cancha no apta por condiciones climáticas',
                'es_economica' => false,
                'monto_default' => 0.00,
                'activo' => true,
            ],
        ];

        foreach ($tiposMulta as $item) {
            CatalogoTipoMulta::firstOrCreate(
                ['nombre' => $item['nombre']],
                $item
            );
        }
    }
}