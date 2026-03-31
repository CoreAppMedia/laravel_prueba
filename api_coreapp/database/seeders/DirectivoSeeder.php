<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Directivo;
use App\Models\CatalogoTipoDueno;
use Illuminate\Support\Str;

class DirectivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipoDueno = CatalogoTipoDueno::where('nombre', 'Dueño Club')->first();
        $tipoDelegado = CatalogoTipoDueno::where('nombre', 'Delegado')->first();

        $directivos = [
            // Dueños de Clubes
            [
                'nombre' => 'Oscar Valdes',
                'telefono' => '3411234567',
                'direccion' => 'Av. Reforma 123, Zapotlán',
                'correo_electronico' => 'juan.perez@example.com',
                'catalogo_tipo_dueno_id' => $tipoDueno->id,
                'activo' => true,
            ],
            [
                'nombre' => 'Chano',
                'telefono' => '3419876543',
                'direccion' => 'Calle Morelos 45, Zapotlán',
                'correo_electronico' => 'elena.ortiz@example.com',
                'catalogo_tipo_dueno_id' => $tipoDueno->id,
                'activo' => true,
            ],
            [
                'nombre' => 'Ranas',
                'telefono' => '3415550123',
                'direccion' => 'Vecindad 72, Ciudad de México',
                'correo_electronico' => 'chespirito@example.com',
                'catalogo_tipo_dueno_id' => $tipoDueno->id,
                'activo' => true,
            ],

            // Delegados de Equipos
            [
                'nombre' => 'Lucio',
                'telefono' => '5511223344',
                'direccion' => 'Plaza Carso, CDMX',
                'correo_electronico' => 'carlos.slim@example.com',
                'catalogo_tipo_dueno_id' => $tipoDelegado->id,
                'activo' => true,
            ],
            [
                'nombre' => 'Shaggy',
                'telefono' => '3310009988',
                'direccion' => 'Guadalajara, Jalisco',
                'correo_electronico' => 'canelo.team@example.com',
                'catalogo_tipo_dueno_id' => $tipoDelegado->id,
                'activo' => true,
            ],
        ];

        foreach ($directivos as $d) {
            Directivo::updateOrCreate(
            ['correo_electronico' => $d['correo_electronico']],
                $d
            );
        }
    }
}