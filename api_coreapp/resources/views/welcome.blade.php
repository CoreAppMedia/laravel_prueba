@php
    $jornadaNum = 14;
    $fechaJornada = 'Domingo, 19 de Abril';
    
    $partidos = [
        'Cancha Zapotitlán #1' => [
            ['hora' => '07:30 AM', 'local' => 'Leones FC', 'visitante' => 'Dragones', 'cat' => 'Veteranos', 'live' => false],
            ['hora' => '09:00 AM', 'local' => 'Titanes', 'visitante' => 'Deportivo', 'cat' => '1ra División', 'live' => false],
            ['hora' => '10:30 AM', 'local' => 'CD ORO', 'visitante' => 'INTER ZAPOTITLAN', 'cat' => 'Premier', 'live' => true],
            ['hora' => '12:00 PM', 'local' => 'TORINO', 'visitante' => 'CD ATLANTE', 'cat' => 'Premier', 'live' => false],
        ],
        'Cancha Zapotitlán #2' => [
            ['hora' => '07:30 AM', 'local' => 'POLITECNICO', 'visitante' => 'A.C. LIBRADO', 'cat' => 'Amateur', 'live' => false],
            ['hora' => '09:00 AM', 'local' => 'NVO. NECAXA', 'visitante' => 'C.D. RECORD', 'cat' => 'Amateur', 'live' => false],
            ['hora' => '10:30 AM', 'local' => 'VASCO INDEPENDENCIA', 'visitante' => 'ATLANTE Z', 'cat' => 'Amateur', 'live' => false],
        ],
        'Los tres Martínez' => [
            ['hora' => '08:00 AM', 'local' => 'NECAXA A-2', 'visitante' => 'ANGELES', 'cat' => '2da División', 'live' => false],
            ['hora' => '09:30 AM', 'local' => 'ZAPORO CITY', 'visitante' => 'REVOLUCION', 'cat' => '2da División', 'live' => false],
        ]
    ];

    $posiciones = [
        ['pos' => 1, 'equipo' => 'CD ORO', 'pj' => 13, 'pg' => 10, 'pe' => 2, 'pp' => 1, 'pts' => 32],
        ['pos' => 2, 'equipo' => 'INTER ZAPOTITLAN', 'pj' => 13, 'pg' => 9, 'pe' => 3, 'pp' => 1, 'pts' => 30],
        ['pos' => 3, 'equipo' => 'TORINO', 'pj' => 13, 'pg' => 8, 'pe' => 4, 'pp' => 1, 'pts' => 28],
        ['pos' => 4, 'equipo' => 'CD ATLANTE', 'pj' => 13, 'pg' => 7, 'pe' => 3, 'pp' => 3, 'pts' => 24],
        ['pos' => 5, 'equipo' => 'POLITECNICO', 'pj' => 13, 'pg' => 6, 'pe' => 4, 'pp' => 3, 'pts' => 22],
    ];

    $goleadores = [
        ['nombre' => 'Carlos Martínez', 'equipo' => 'CD ORO', 'goles' => 15],
        ['nombre' => 'Luis Hernández', 'equipo' => 'INTER ZAPOTITLAN', 'goles' => 12],
        ['nombre' => 'Ricardo Gómez', 'equipo' => 'TORINO', 'goles' => 10],
    ];
@endphp

<!DOCTYPE html>
<html class="light" lang="es">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Clúbes Unidos | Liga Zapotitlán</title>

    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet" />
    
    @vite(['resources/css/dashboard.css'])
</head>

<body class="bg-zapo-gray text-secondary font-body leading-relaxed">

    <!-- Nav -->
    <nav class="absolute top-0 w-full z-50 py-6 px-8 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div class="text-white font-bold text-xl tracking-tight flex items-center gap-2">
            <img src="{{ asset('images/logo_final.png') }}" alt="logo-dashboard" class="w-14 h-14">
            Clúbes Unidos Zapotitlán
        </div>
        <div class="flex gap-6 items-center">
            <a href="#rol" class="text-white/80 hover:text-white transition-colors text-sm font-medium">Rol de Juego</a>
            <a href="#tabla" class="text-white/80 hover:text-white transition-colors text-sm font-medium">Posiciones</a>
            @if (Route::has('login'))
                @auth
                    <a href="{{ url('/panel') }}" class="bg-zapo-green text-white px-5 py-2 rounded-pill font-medium hover:bg-zapo-green/90 transition-all text-sm">Panel Admin</a>
                @else
                    <a href="{{ route('login') }}" class="text-white font-medium hover:text-zapo-link-dark transition-colors text-sm">Iniciar Sesión</a>
                    <a href="{{ route('register') }}" class="border border-white/30 text-white px-5 py-2 rounded-pill font-medium hover:bg-white/10 transition-all text-sm">Unirse a la Liga</a>
                @endauth
            @endif
        </div>
    </nav>

    <!-- Hero -->
    <header class="relative pt-40 pb-48 px-8 overflow-hidden flex flex-col items-center justify-center text-center">
        <!-- Video Background -->
        <video 
            autoplay 
            muted 
            loop 
            playsinline
            class="absolute inset-0 w-full h-full object-cover z-0"
        >
            <source src="{{ asset('videos/dashbord.mov') }}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        
        <!-- Overlay for text readability -->
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        
        <div class="max-w-4xl mx-auto z-20 animate-zapo">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[12px] font-bold uppercase tracking-widest text-zapo-link-dark border border-white/10 mb-6 drop-shadow-lg">
                <span class="w-2 h-2 bg-zapo-link-dark rounded-full animate-pulse"></span>
                Temporada 2026 • Clausura
            </div>
            <h1 class="font-headline text-white display-hero mb-6 drop-shadow-2xl">
                Liga de Fútbol <span class="text-zapo-link-dark italic">Zapotitlán</span>
            </h1>
            <p class="text-[21px] text-white/70 max-w-2xl mx-auto mb-10 font-normal leading-tight drop-shadow-lg">
                El corazón del fútbol amateur en Tláhuac. Consulta resultados, estadísticas y la programación semanal de todas nuestras categorías.
            </p>
            <div class="flex flex-wrap justify-center gap-6">
                <a href="#rol" class="bg-zapo-green text-white px-8 py-3 rounded-pill font-semibold text-[17px] hover:shadow-zapo-hover shadow-lg transition-all drop-shadow-lg">
                    Ver Rol de Juego
                </a>
                <button class="text-white text-[17px] font-medium hover:text-zapo-link-dark transition-colors flex items-center gap-2 drop-shadow-lg">
                    <span class="material-symbols-outlined">download</span>
                    Reglamento (PDF)
                </button>
            </div>
        </div>
        
        <!-- Abstract Decoration -->
        <div class="absolute inset-0 opacity-20 pointer-events-none z-10">
            <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zapo-green blur-[120px] rounded-full"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zapo-link-dark blur-[100px] rounded-full"></div>
        </div>
    </header>

    <!-- Main Content Grid -->
    <main class="max-w-screen-xl mx-auto px-8 -mt-20 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Left Column: Matches -->
            <div id="rol" class="lg:col-span-8 space-y-12">
                
                <div class="bg-white rounded-large shadow-zapo overflow-hidden border border-black/[0.03]">
                    <div class="p-8 border-b border-black/[0.05] flex justify-between items-center bg-white">
                        <div>
                            <h2 class="font-headline text-2xl font-bold text-zapo-near-black tracking-tight">Rol de Juego</h2>
                            <p class="text-zapo-near-black/50 text-sm font-medium">Jornada {{ $jornadaNum }} • {{ $fechaJornada }}</p>
                        </div>
                        <div class="flex gap-2">
                             <span class="material-symbols-outlined text-zapo-near-black/20 text-3xl">calendar_today</span>
                        </div>
                    </div>

                    <div class="divide-y divide-black/[0.03]">
                        @foreach($partidos as $sede => $listaPartidos)
                            <div class="p-8">
                                <h3 class="font-headline text-lg font-bold text-zapo-near-black mb-6 flex items-center gap-2">
                                    <span class="w-1.5 h-6 bg-zapo-green rounded-full"></span>
                                    {{ $sede }}
                                </h3>
                                <div class="grid gap-4">
                                    @foreach($listaPartidos as $partido)
                                        <div class="flex items-center justify-between p-5 rounded-xl border border-black/[0.03] hover:bg-zapo-gray transition-colors group">
                                            <div class="w-20 text-sm font-bold text-zapo-green">{{ $partido['hora'] }}</div>
                                            <div class="flex-1 flex items-center justify-center gap-4 px-4">
                                                <div class="flex-1 text-right font-semibold text-zapo-near-black">{{ $partido['local'] }}</div>
                                                <div class="flex flex-col items-center">
                                                    <span class="text-[10px] font-black text-black/20 tracking-widest uppercase">VS</span>
                                                    @if($partido['live'])
                                                        <span class="flex items-center gap-1.5 text-[9px] text-white bg-red-600 px-2 py-0.5 rounded-micro font-bold tracking-wider mt-1 animate-pulse">LIVE</span>
                                                    @endif
                                                </div>
                                                <div class="flex-1 text-left font-semibold text-zapo-near-black">{{ $partido['visitante'] }}</div>
                                            </div>
                                            <div class="w-24 text-right">
                                                <span class="text-[10px] bg-zapo-gray border border-black/[0.05] text-zapo-near-black/60 px-2 py-1 rounded-micro font-bold tracking-wider group-hover:bg-white transition-colors">
                                                    {{ $partido['cat'] }}
                                                </span>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- Fields Section -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-large shadow-zapo border border-black/[0.03]">
                        <span class="material-symbols-outlined text-zapo-green mb-4">location_on</span>
                        <h4 class="font-bold text-sm mb-1">Cancha Zapotitlán #1</h4>
                        <p class="text-xs text-zapo-near-black/50 leading-relaxed">Sede techada con iluminación y capacidad para 500 personas.</p>
                    </div>
                    <div class="bg-white p-6 rounded-large shadow-zapo border border-black/[0.03]">
                        <span class="material-symbols-outlined text-zapo-green mb-4">sports_soccer</span>
                        <h4 class="font-bold text-sm mb-1">Cancha Zapotitlán #2</h4>
                        <p class="text-xs text-zapo-near-black/50 leading-relaxed">Pasto sintético profesional. Gradas techadas para afición.</p>
                    </div>
                    <div class="bg-white p-6 rounded-large shadow-zapo border border-black/[0.03]">
                        <span class="material-symbols-outlined text-zapo-green mb-4">stadium</span>
                        <h4 class="font-bold text-sm mb-1">Los tres Martínez</h4>
                        <p class="text-xs text-zapo-near-black/50 leading-relaxed">Campo insignia de nuestra categoría 2da División.</p>
                    </div>
                </div>

            </div>

            <!-- Right Column: Stats -->
            <aside id="tabla" class="lg:col-span-4 space-y-8">
                
                <!-- Standings Table -->
                <div class="bg-white rounded-large shadow-zapo border border-black/[0.03] overflow-hidden">
                    <div class="p-6 border-b border-black/[0.05]">
                        <h2 class="font-headline text-lg font-bold text-zapo-near-black tracking-tight">Tabla General</h2>
                        <p class="text-zapo-near-black/50 text-[11px] font-bold uppercase tracking-wider">Categoría Premier</p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-zapo-gray/50 text-[10px] font-black tracking-widest text-zapo-near-black/40 uppercase">
                                <tr>
                                    <th class="py-3 px-4">POS</th>
                                    <th class="py-3 px-4">EQUIPO</th>
                                    <th class="py-3 px-4 text-center">PJ</th>
                                    <th class="py-3 px-4 text-center">PTS</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-black/[0.03]">
                                @foreach($posiciones as $p)
                                    <tr class="text-sm">
                                        <td class="py-4 px-4 font-black {{ $p['pos'] <= 4 ? 'text-zapo-green' : 'text-zapo-near-black/30' }}">
                                            {{ sprintf('%02d', $p['pos']) }}
                                        </td>
                                        <td class="py-4 px-4 font-bold text-zapo-near-black">{{ $p['equipo'] }}</td>
                                        <td class="py-4 px-4 text-center text-zapo-near-black/60">{{ $p['pj'] }}</td>
                                        <td class="py-4 px-4 text-center font-black text-zapo-near-black">{{ $p['pts'] }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="p-4 bg-zapo-gray/30 text-center">
                        <a href="#" class="text-[11px] font-bold text-zapo-link-dark hover:underline">VER TABLA COMPLETA</a>
                    </div>
                </div>

                <!-- Top Scorers -->
                <div class="bg-white rounded-large shadow-zapo border border-black/[0.03] p-6">
                    <h2 class="font-headline text-lg font-bold text-zapo-near-black tracking-tight mb-6">Líderes de Goleo</h2>
                    <div class="space-y-4">
                        @foreach($goleadores as $g)
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-zapo-gray flex items-center justify-center font-black text-zapo-near-black/30 text-xs shadow-inner">
                                    {{ $loop->iteration }}
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-bold text-zapo-near-black leading-tight">{{ $g['nombre'] }}</div>
                                    <div class="text-[10px] font-bold text-zapo-near-black/40 uppercase">{{ $g['equipo'] }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-black text-zapo-green leading-none">{{ $g['goles'] }}</div>
                                    <div class="text-[9px] font-bold opacity-30">GOLES</div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>

                <!-- Advertising / Promo -->
                <div class="rounded-large bg-zapo-black p-8 text-center relative overflow-hidden group shadow-zapo-hover">
                    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
                    <div class="relative z-10">
                        <h3 class="text-white font-bold text-xl mb-2 tracking-tight">¿Quieres inscribir a tu equipo?</h3>
                        <p class="text-white/60 text-xs mb-6 px-4">Las inscripciones para el Torneo Apertura 2024 abren pronto.</p>
                        <a href="{{ route('register') }}" class="inline-block bg-white text-zapo-black px-6 py-2 rounded-pill font-bold text-xs hover:bg-zapo-link-dark hover:text-white transition-all transform hover:scale-105">
                            Más Información
                        </a>
                    </div>
                </div>

            </aside>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-zapo-black mt-32 py-20 px-8 border-t border-white/5 relative bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-zapo-green/10 via-transparent to-transparent">
        <div class="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="md:col-span-2">
                <div class="text-white font-bold text-2xl tracking-tight mb-6 flex items-center gap-2">
                    <img src="{{ asset('images/logo_final.png') }}" alt="logo-dashboard" class="w-14 h-14">
                   Clúbes Unidos Zapotitlán
                </div>
                <p class="text-white/40 max-w-sm mb-6 leading-relaxed">
                    Elevando el estándar del fútbol local. Proporcionamos transparencia y profesionalismo a través de tecnología dedicada al deporte.
                </p>
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-zapo-green hover:text-white transition-all cursor-pointer">
                        <span class="material-symbols-outlined text-xl">facebook</span>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-zapo-green hover:text-white transition-all cursor-pointer">
                        <span class="material-symbols-outlined text-xl">share</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Atajos</h4>
                <ul class="space-y-4 text-white/40 text-sm font-medium">
                    <li><a href="#rol" class="hover:text-zapo-link-dark">Rol de Juego</a></li>
                    <li><a href="#tabla" class="hover:text-zapo-link-dark">Tablas de Posiciones</a></li>
                    <li><a href="#" class="hover:text-zapo-link-dark">Goleadores</a></li>
                    <li><a href="#" class="hover:text-zapo-link-dark">Canchas</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 text-sm uppercase tracking-widest">Sistema</h4>
                <ul class="space-y-4 text-white/40 text-sm font-medium">
                    <li><a href="{{ route('login') }}" class="hover:text-zapo-link-dark">Dashboard Capitanes</a></li>
                    <li><a href="{{ route('register') }}" class="hover:text-zapo-link-dark">Registro</a></li>
                    <li><a href="#" class="hover:text-zapo-link-dark">Soporte</a></li>
                </ul>
            </div>
        </div>
        <div class="max-w-screen-xl mx-auto pt-20 mt-20 border-t border-white/5 text-center">
            <p class="text-[11px] font-bold text-white/20 tracking-widest uppercase">
                Copyright © 2026 Clúbes Unidos Zapotitlán. Desarrollado con pasión por el fútbol.
            </p>
        </div>
    </footer>

    @if($partidos['Cancha Zapotitlán #1'][2]['live'])
    <!-- Toast Live Match Reminder -->
    <div class="fixed bottom-8 right-8 z-[60] animate-bounce-slow">
        <div class="bg-zapo-black border border-zapo-link-dark/30 p-4 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
            <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
            <div>
                <div class="text-[10px] font-black text-zapo-link-dark tracking-widest uppercase mb-0.5">En Vivo Ahora</div>
                <div class="text-sm font-bold text-white">CD ORO vs INTER</div>
            </div>
        </div>
    </div>
    @endif

</body>

</html>