<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Seed Permisos
        $permisos = [
            'desarrollador',
            'admin',
            'presidente',
            'delegado',
            'tesorero',
            'secretario',
            'jugador',
            'entrenador',
            'arbitro',
        ];

        foreach ($permisos as $permisoNombre) {
            Permiso::firstOrCreate(['nombre' => $permisoNombre]);
        }

        // Seed Roles
        $roles = [
            'escritura y lectura',
            'lectura',
        ];

        foreach ($roles as $rolNombre) {
            Rol::firstOrCreate(['nombre' => $rolNombre]);
        }

        // Usuarios genéricos para pruebas
        // Debe cumplir con la política fuerte: min 8, may/min, número y símbolo
        $passwordPlano = 'Oscar123@';

        $rolEscrituraLectura = Rol::where('nombre', 'escritura y lectura')->first();
        $rolLectura = Rol::where('nombre', 'lectura')->first();

        $usuarios = [
            [
                'permiso' => 'desarrollador',
                'rol' => $rolEscrituraLectura,
                'name' => 'dev',
                'email' => 'dev@ligamx.test',
                'nombre' => 'Dev',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'admin',
                'rol' => $rolEscrituraLectura,
                'name' => 'admin',
                'email' => 'admin@ligamx.test',
                'nombre' => 'Admin',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'presidente',
                'rol' => $rolEscrituraLectura,
                'name' => 'presidente',
                'email' => 'presidente@ligamx.test',
                'nombre' => 'Presidente',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'delegado',
                'rol' => $rolLectura,
                'name' => 'delegado',
                'email' => 'delegado@ligamx.test',
                'nombre' => 'Delegado',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'tesorero',
                'rol' => $rolEscrituraLectura,
                'name' => 'tesorero',
                'email' => 'tesorero@ligamx.test',
                'nombre' => 'Tesorero',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'secretario',
                'rol' => $rolEscrituraLectura,
                'name' => 'secretario',
                'email' => 'secretario@ligamx.test',
                'nombre' => 'Secretario',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'jugador',
                'rol' => $rolLectura,
                'name' => 'jugador',
                'email' => 'jugador@ligamx.test',
                'nombre' => 'Jugador',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'entrenador',
                'rol' => $rolLectura,
                'name' => 'entrenador',
                'email' => 'entrenador@ligamx.test',
                'nombre' => 'Entrenador',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
            [
                'permiso' => 'arbitro',
                'rol' => $rolLectura,
                'name' => 'arbitro',
                'email' => 'arbitro@ligamx.test',
                'nombre' => 'Árbitro',
                'apellido_paterno' => 'Liga',
                'apellido_materno' => 'MX',
            ],
        ];

        foreach ($usuarios as $u) {
            $permiso = Permiso::where('nombre', $u['permiso'])->first();

            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make($passwordPlano),
                    'permiso_id' => $permiso?->id,
                    'rol_id' => $u['rol']?->id,
                    'active' => true,
                    'nombre' => $u['nombre'],
                    'apellido_paterno' => $u['apellido_paterno'],
                    'apellido_materno' => $u['apellido_materno'],
                    'asignado' => null,
                ]
            );
        }

        /*
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        */
    }
}
