<?php

return [

    'roles' => [

        'desarrollador' => [
            'id' => 1,
            'permissions' => ['*'],
        ],

        'admin' => [
            'id' => 2,
            'permissions' => ['*', '!auditlog.view'],
        ],

        'presidente' => [
            'id' => 3,
            'permissions' => ['*.view'],
        ],

        'tribunal' => [
            'id' => 4,
            'permissions' => [
                'multas.*',
                'partidos.gestionar_disciplina',
                'partidos.update',
                '*.view',
                '!ingresos.*',
                '!egresos.*',
                '!auditlog.*'
            ],
        ],

        'delegado' => [
            'id' => 5,
            'permissions' => [
                'equipos.update',
                'jugadores.*',
                '*.view',
                '!ingresos.*',
                '!egresos.*',
                '!auditlog.*'
            ],
        ],

        'tesorero' => [
            'id' => 6,
            'permissions' => [
                'ingresos.*',
                'egresos.*',
                'multas.marcar_pagada',
                '*.view',
                '!auditlog.*'
            ],
        ],

        'secretario' => [
            'id' => 7,
            'permissions' => [
                'ingresos.view',
                'egresos.view',
                'multas.view',
            ],
        ],

        'jugador' => [
            'id' => 8,
            'permissions' => [
                '*.view',
                '!ingresos.*',
                '!egresos.*',
                '!auditlog.*'
            ],
        ],

        'entrenador' => [
            'id' => 9,
            'permissions' => [
                'equipos.update',
                'jugadores.*',
                '*.view',
                '!ingresos.*',
                '!egresos.*',
                '!auditlog.*'
            ],
        ],

        'arbitro' => [
            'id' => 10,
            'permissions' => [
                'partidos.update',
                'partidos.registrar_resultado',
                'multas.create',
                'equipos.view',
                'jugadores.view',
                '!ingresos.*',
                '!egresos.*',
                '!auditlog.*'
            ],
        ],

    ],

];