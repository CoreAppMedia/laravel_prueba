<!DOCTYPE html>

<html class="light" lang="es">

<head>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Heritage Pitch | El Legado del Fútbol</title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'zapo-black': '#000000',
                        'zapo-red': '#C0442A',
                        'zapo-gray': '#f5f5f7',
                        'zapo-near-black': '#1d1d1f',
                        'zapo-green': '#3A6B52', /* Fresh Stadium Green */
                        'zapo-link': '#008f45',
                        'zapo-link-dark': '#28cd41',
                        'zapo-gold': '#d4af37',  /* Victory Gold */
                        primary: '#00a351',
                        secondary: '#1d1d1f',
                        'border-gray': 'rgba(0, 0, 0, 0.12)',
                    },
                    fontFamily: {
                        headline: ['Inter', 'system-ui', 'sans-serif'],
                        body: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    borderRadius: {
                        'micro': '5px',
                        'zapo': '8px',
                        'comfortable': '11px',
                        'large': '12px',
                        'pill': '980px',
                    },
                    boxShadow: {
                        'zapo': '0 10px 30px rgba(0, 0, 0, 0.12)',
                        'zapo-hover': '0 20px 40px rgba(0, 0, 0, 0.22)',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #ffffff;
            color: #1d1d1f;
            -webkit-font-smoothing: antialiased;
        }

        .zapo-glass {
            background: rgba(0, 0, 0, 0.72);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
        }

        .zapo-glass-light {
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
        }

        .display-hero {
            font-size: 56px;
            font-weight: 600;
            line-height: 1.07;
            letter-spacing: -0.02em;
        }

        .animate-zapo {
            animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>

<body class="bg-background text-on-surface font-body leading-relaxed">

    <header
        class="relative pt-24 pb-32 px-8 bg-zapo-black overflow-hidden flex flex-col items-center justify-center text-center">
        <div class="max-w-4xl mx-auto z-10 animate-zapo opacity-0">
            <h1 class="font-headline text-white display-hero mb-6">
                Rol de Juego <span class="text-white/60">Dominical</span>
            </h1>
            <p class="text-[21px] text-white/80 max-w-2xl mx-auto mb-10 font-normal leading-tight">
                Consulta los horarios oficiales de la Jornada 14. <br />
                Todos los capitanes deben registrarse con 15 minutos de anticipación.
            </p>
            <div class="flex flex-wrap justify-center gap-6">
                <button
                    class="bg-zapo-green text-white px-8 py-3 rounded-pill font-normal text-[17px] hover:bg-zapo-green/90 transition-all">
                    Descargar Rol (PDF)
                </button>
                <a class="text-zapo-link-dark text-[17px] font-normal hover:underline flex items-center gap-1 group"
                    href="#">
                    Ver Mapa de Campos <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
        </div>
        <div class="mt-20 w-full max-w-screen-xl mx-auto z-0 relative px-4">
            <div class="aspect-[21/9] rounded-large overflow-hidden shadow-zapo-hover ring-1 ring-white/20 relative">
                <img alt="Football field" class="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc79LJUtThmGpiPsmkHbIqxLnv7S-svX4hz4ZPoohCq1LwOLDwM8CEtlptsyhdyq9wMGjblpTOhSMlv2VBZ3tHSuLQ2dzfrsyyf6L2zIEbGeEUdEYIC13WZwifiFvIJTbVWHEs5PwCsCFYLORfjskIqGlscMMlVED6TftHuoXoTFyNUgbqmTe9LX7hnurSuXzH4ph-2V3qzAaou3s6Oc0J15rUbMGPr1wXUwo9Yn2KQUlqcj5Z1MLtbsM1D-mdbUa7ribUbaJxLAA" />
                <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zapo-black to-transparent"></div>
            </div>
            <div
                class="absolute bottom-12 left-12 zapo-glass p-8 rounded-large border border-white/20 shadow-zapo-hover max-w-xs text-left backdrop-blur-3xl">
                <div class="text-white font-bold text-2xl mb-2 tracking-tight">Clásico de Veteranos</div>
                <p class="text-white/70 mb-4 font-medium text-lg">Atlético Legado vs Real Maestría</p>
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[12px] font-bold uppercase tracking-widest text-zapo-link-dark border border-white/10">
                    <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Campo 1 • 10:30 AM
                </div>
            </div>
        </div>
    </header>
    <section class="py-24 bg-zapo-gray px-8">
        <div class="max-w-screen-xl mx-auto">
            <div class="flex justify-between items-end mb-16">
                <div class="animate-zapo opacity-0">
                    <h2 class="font-headline text-4xl font-semibold text-zapo-near-black mb-4 tracking-tight">
                        Programación por Campo</h2>
                    <p class="text-zapo-near-black/60 font-medium text-[19px]">Horarios oficiales confirmados para este
                        Domingo</p>
                </div>
                <div class="flex gap-4">
                    <button class="p-3 rounded-full bg-white shadow-zapo hover:shadow-zapo-hover transition-all">
                        <span class="material-symbols-outlined text-zapo-near-black"
                            data-icon="chevron_left">chevron_left</span>
                    </button>
                    <button class="p-3 rounded-full bg-white shadow-zapo hover:shadow-zapo-hover transition-all">
                        <span class="material-symbols-outlined text-zapo-near-black"
                            data-icon="chevron_right">chevron_right</span>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Campo 1 -->
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-large shadow-zapo border border-black/[0.03]">
                        <h3 class="font-headline text-2xl font-semibold text-zapo-near-black">Campo 1</h3>
                        <span class="text-[12px] font-semibold text-zapo-near-black/40 uppercase tracking-widest">Sede
                            Principal</span>
                    </div>
                    <div class="space-y-4">
                        <div
                            class="p-6 bg-white rounded-large shadow-zapo border border-black/[0.03] hover:shadow-zapo-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                            <div class="flex justify-between items-start mb-4">
                                <span class="text-zapo-green font-bold text-sm tracking-tight">07:30 AM</span>
                                <span
                                    class="text-[10px] bg-zapo-gray text-zapo-near-black/60 px-2 py-1 rounded-micro font-bold tracking-wider">VETERANOS</span>
                            </div>
                            <div
                                class="text-[18px] font-semibold text-zapo-near-black group-hover:text-zapo-green transition-colors leading-tight">
                                Leones FC vs Dragones</div>
                        </div>
                        <div
                            class="p-6 bg-white rounded-large shadow-zapo border border-black/[0.03] hover:shadow-zapo-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                            <div class="flex justify-between items-start mb-4">
                                <span class="text-zapo-green font-bold text-sm tracking-tight">09:00 AM</span>
                                <span
                                    class="text-[10px] bg-zapo-gray text-zapo-near-black/60 px-2 py-1 rounded-micro font-bold tracking-wider">1RA
                                    DIVISIÓN</span>
                            </div>
                            <div
                                class="text-[18px] font-semibold text-zapo-near-black group-hover:text-zapo-green transition-colors leading-tight">
                                Titanes vs Deportivo</div>
                        </div>
                        <div
                            class="p-6 bg-zapo-black rounded-large shadow-zapo-hover border border-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                            <div class="absolute top-0 right-0 p-3 opacity-20">
                                <span class="material-symbols-outlined text-white text-4xl"
                                    data-icon="stadium">stadium</span>
                            </div>
                            <div class="flex justify-between items-start mb-4 relative z-10">
                                <span class="text-zapo-green font-bold text-sm tracking-tight">10:30 AM</span>
                                <span
                                    class="flex items-center gap-1.5 text-[10px] text-white bg-red-600 px-2 py-1 rounded-micro font-bold tracking-wider">
                                    <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>
                            <div
                                class="text-[18px] font-semibold text-white group-hover:text-zapo-green transition-colors leading-tight relative z-10">
                                Atlético vs Real</div>
                        </div>
                    </div>
                </div>
                <!-- Campo 2 -->
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-large shadow-zapo ring-1 ring-black/5">
                        <h3 class="font-headline text-2xl font-semibold text-zapo-near-black">Campo 2</h3>
                        <span class="text-[12px] font-semibold text-zapo-near-black/40 uppercase tracking-widest">Sede
                            Norte</span>
                    </div>
                    <div class="space-y-4">
                        <div
                            class="p-5 bg-white rounded-large shadow-zapo ring-1 ring-black/5 hover:scale-[1.02] transition-transform cursor-pointer group">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-zapo-green font-semibold text-sm">07:30</span>
                                <span
                                    class="text-[10px] bg-zapo-gray text-zapo-near-black/60 px-2 py-0.5 rounded-micro font-bold">2DA</span>
                            </div>
                            <div
                                class="text-[17px] font-semibold text-zapo-near-black group-hover:text-zapo-green transition-colors">
                                Esparta vs Troya</div>
                        </div>
                        <div
                            class="p-5 bg-white rounded-large shadow-zapo ring-1 ring-black/5 hover:scale-[1.02] transition-transform cursor-pointer group">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-zapo-green font-semibold text-sm">09:00</span>
                                <span
                                    class="text-[10px] bg-zapo-gray text-zapo-near-black/60 px-2 py-0.5 rounded-micro font-bold">2DA</span>
                            </div>
                            <div
                                class="text-[17px] font-semibold text-zapo-near-black group-hover:text-zapo-green transition-colors">
                                Halcones vs Águilas</div>
                        </div>
                    </div>
                </div>
                <!-- Campo 3 -->
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-large shadow-zapo ring-1 ring-black/5">
                        <h3 class="font-headline text-2xl font-semibold text-zapo-near-black">Campo 3</h3>
                        <span class="text-[12px] font-semibold text-zapo-near-black/40 uppercase tracking-widest">Sede
                            Sur</span>
                    </div>
                    <div class="space-y-4">
                        <div
                            class="p-5 bg-white rounded-large shadow-zapo ring-1 ring-black/5 hover:scale-[1.02] transition-transform cursor-pointer group">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-zapo-green font-semibold text-sm">07:30</span>
                                <span
                                    class="text-[10px] bg-zapo-gray text-zapo-near-black/60 px-2 py-0.5 rounded-micro font-bold">VET</span>
                            </div>
                            <div
                                class="text-[17px] font-semibold text-zapo-near-black group-hover:text-zapo-green transition-colors">
                                Palma vs Olivo</div>
                        </div>
                    </div>
                </div>
                <!-- Pendientes -->
                <div class="space-y-6">
                    <div class="bg-white/40 p-6 rounded-large border border-dashed border-black/10">
                        <h3 class="font-headline text-2xl font-semibold text-zapo-near-black opacity-40">Pendientes</h3>
                        <span class="text-[12px] font-semibold text-zapo-near-black/20 uppercase tracking-widest">Por
                            Asignar</span>
                    </div>
                    <div class="p-5 bg-white/20 rounded-large border border-dashed border-black/10">
                        <div class="text-[17px] font-semibold text-zapo-near-black/40 italic">Final Copa B</div>
                        <div class="text-[12px] text-zapo-near-black/20 mt-1">Sede TBD</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="py-24 bg-white px-8">
        <div class="max-w-screen-xl mx-auto">
            <h2
                class="font-headline text-4xl font-semibold mb-16 text-center text-zapo-near-black tracking-tight animate-zapo opacity-0">
                Estadísticas de la Liga</h2>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Primera Division -->
                <div
                    class="lg:col-span-8 bg-zapo-gray/50 p-2 rounded-[32px] border border-black/[0.03] relative overflow-hidden group shadow-inner">
                    <div class="p-8 bg-zapo-gray/30 rounded-[30px]">
                        <div class="flex justify-between items-center mb-10 px-4">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 bg-zapo-gold rounded-xl flex items-center justify-center shadow-zapo">
                                    <span class="material-symbols-outlined text-white text-[20px]"
                                        data-icon="emoji_events">emoji_events</span>
                                </div>
                                <h3 class="font-headline text-2xl font-semibold text-zapo-near-black">Primera División
                                </h3>
                            </div>
                            <a class="text-zapo-green font-semibold text-[15px] hover:underline flex items-center gap-1 bg-white px-4 py-2 rounded-full shadow-zapo border border-black/[0.03] transition-all hover:scale-105"
                                href="#">
                                Tabla Completa <span class="text-xs">↗</span>
                            </a>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr
                                        class="text-zapo-near-black/40 text-[11px] font-bold uppercase tracking-[0.1em]">
                                        <th class="pb-2 pl-6">Posición</th>
                                        <th class="pb-2">Club</th>
                                        <th class="pb-2 text-center">PJ</th>
                                        <th class="pb-2 text-center">Goles</th>
                                        <th class="pb-2 pr-6 text-right">Puntos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Row 1 (Leader) -->
                                    <tr
                                        class="bg-white rounded-2xl shadow-zapo hover:shadow-zapo-hover transition-all duration-300 group/row relative overflow-hidden">
                                        <td class="py-6 pl-6 font-bold text-zapo-gold text-xl relative">
                                            <div class="absolute left-0 top-0 bottom-0 w-1 bg-zapo-gold"></div>
                                            01
                                        </td>
                                        <td class="py-6 font-semibold text-zapo-near-black">
                                            <div class="flex items-center gap-4">
                                                <div
                                                    class="w-10 h-10 rounded-full bg-zapo-gray flex items-center justify-center text-[11px] font-bold text-black/30 border border-black/[0.05]">
                                                    TC</div>
                                                <div class="flex flex-col">
                                                    <span>Titanes de la Costa</span>
                                                    <span
                                                        class="text-[11px] text-green-600 font-bold uppercase tracking-wider">Líder
                                                        Gral</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-6 text-zapo-near-black/60 font-medium text-center">12</td>
                                        <td class="py-6 text-zapo-near-black font-semibold text-center">+24</td>
                                        <td
                                            class="py-6 pr-6 text-right font-bold text-3xl text-zapo-near-black tracking-tighter">
                                            34</td>
                                    </tr>
                                    <!-- Row 2 -->
                                    <tr
                                        class="bg-white/80 rounded-2xl shadow-zapo hover:shadow-zapo hover:bg-white transition-all duration-300 group/row border border-black/[0.02]">
                                        <td class="py-6 pl-6 font-bold text-zapo-near-black text-xl">02</td>
                                        <td class="py-6 font-semibold text-zapo-near-black">
                                            <div class="flex items-center gap-4">
                                                <div
                                                    class="w-10 h-10 rounded-full bg-zapo-gray flex items-center justify-center text-[11px] font-bold text-black/30 border border-black/[0.05]">
                                                    DL</div>
                                                <span>Deportivo Legado</span>
                                            </div>
                                        </td>
                                        <td class="py-6 text-zapo-near-black/60 font-medium text-center">12</td>
                                        <td class="py-6 text-zapo-near-black font-semibold text-center">+18</td>
                                        <td
                                            class="py-6 pr-6 text-right font-bold text-3xl text-zapo-near-black tracking-tighter">
                                            31</td>
                                    </tr>
                                    <!-- Row 3 -->
                                    <tr
                                        class="bg-white/80 rounded-2xl shadow-zapo hover:shadow-zapo hover:bg-white transition-all duration-300 group/row border border-black/[0.02]">
                                        <td class="py-6 pl-6 font-bold text-zapo-near-black text-xl">03</td>
                                        <td class="py-6 font-semibold text-zapo-near-black">
                                            <div class="flex items-center gap-4">
                                                <div
                                                    class="w-10 h-10 rounded-full bg-zapo-gray flex items-center justify-center text-[11px] font-bold text-black/30 border border-black/[0.05]">
                                                    RS</div>
                                                <span>Rayos de San Juan</span>
                                            </div>
                                        </td>
                                        <td class="py-6 text-zapo-near-black/60 font-medium text-center">13</td>
                                        <td class="py-6 text-zapo-near-black font-semibold text-center">+12</td>
                                        <td
                                            class="py-6 pr-6 text-right font-bold text-3xl text-zapo-near-black tracking-tighter">
                                            28</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- Segunda Division Sidebar -->
                <div class="lg:col-span-4 flex flex-col gap-8">
                    <div class="bg-white p-8 rounded-large shadow-zapo border border-black/[0.03] flex flex-col flex-1">
                        <h3 class="font-headline text-2xl font-semibold text-zapo-near-black mb-8">Segunda</h3>
                        <div class="space-y-4 flex-1">
                            <div
                                class="flex items-center justify-between p-5 bg-zapo-gray rounded-large border border-black/[0.02] hover:bg-white hover:shadow-zapo transition-all duration-300 group cursor-pointer">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-black/10">01</span>
                                    <span class="font-semibold text-zapo-near-black text-[17px]">Libertad FC</span>
                                </div>
                                <span class="font-bold text-zapo-green">29 pts</span>
                            </div>
                            <div
                                class="flex items-center justify-between p-5 bg-zapo-gray rounded-large border border-black/[0.02] hover:bg-white hover:shadow-zapo transition-all duration-300 group cursor-pointer">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[9px] font-bold text-black/10">02</span>
                                    <span class="font-semibold text-zapo-near-black text-[17px]">Unión Real</span>
                                </div>
                                <span class="font-bold text-zapo-green">27 pts</span>
                            </div>
                        </div>
                        <button
                            class="w-full mt-8 py-4 rounded-pill bg-zapo-near-black text-white font-semibold hover:bg-zapo-black transition-all shadow-zapo hover:shadow-zapo-hover active:scale-[0.98]">
                            Ranking Completo
                        </button>
                    </div>
                </div>
                <!-- Veteranos Module -->
                <div class="lg:col-span-12">
                    <div class="bg-zapo-black rounded-large overflow-hidden grid md:grid-cols-2 shadow-zapo-hover">
                        <div class="p-16 flex flex-col justify-center animate-zapo opacity-0">
                            <span class="text-zapo-green text-[12px] font-bold uppercase tracking-widest mb-4">Categoría
                                Elite</span>
                            <h3 class="font-headline text-5xl font-semibold text-white mb-6 leading-tight">Veteranos
                            </h3>
                            <p class="text-white/60 text-[19px] font-medium mb-10 leading-relaxed">La liga de los
                                maestros. Donde la experiencia redefine el juego cada fin de semana.</p>
                            <div class="flex gap-12">
                                <div>
                                    <div class="text-[12px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                        Líder Gral</div>
                                    <div class="text-2xl font-bold text-white">Atlético</div>
                                </div>
                                <div>
                                    <div class="text-[12px] font-bold text-white/40 uppercase tracking-widest mb-1">
                                        Pichichi</div>
                                    <div class="text-2xl font-bold text-zapo-gold">M. Rossi</div>
                                </div>
                            </div>
                        </div>
                        <div class="relative min-h-[400px]">
                            <img alt="Veterans playing" class="absolute inset-0 w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8O8tJgyW2u8naQbqClDPCqLgWv4ZgLFYOTwHwCvcGObAmUkWl-2R3Ao-22OAI0CKxpyLj4CGkaIJJZ_R2kMK_QwhhQa4EKppfYASnHm50yXU_ak3ZPcuZofbw3JOh8dDmZHmwEckW9B_WghrLHT_Spl7mY4vnUAAoAb0Zq-ygrj-YjaO1nmiAyb1hxXgrddsAmKJfepihAeJosyB9VIZD1Pt1zznmigDrtuXknhvERynqcmm6_F4CbHZ2NzwxPZxCbdIJhb1D2UU" />
                            <div class="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-zapo-black to-transparent">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="py-24 bg-white px-8">
        <div class="max-w-screen-xl mx-auto">
            <div class="flex justify-between items-baseline mb-16 animate-zapo opacity-0">
                <h2 class="font-headline text-4xl font-semibold text-zapo-near-black tracking-tight">Prensa & Archivo
                </h2>
                <a class="text-zapo-green font-medium text-[17px] hover:underline flex items-center gap-1 group"
                    href="#">
                    Explorar Todo <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="group cursor-pointer animate-zapo opacity-0" style="animation-delay: 0.1s;">
                    <div
                        class="aspect-[16/10] rounded-large overflow-hidden mb-8 shadow-zapo border border-black/[0.05] group-hover:shadow-zapo-hover transition-all duration-500">
                        <img alt="Training session"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa-0ee_x4LdE73pmNN8sUP4hVGe8HSUM907JWXL8ca383iq9pdW6KasRo8FB3DL7xCV2OlVBDkUaw4VdA6OjQ6Bk__9itjF6AXcGXwjCeK5hnan1wJZHKtPpHNTQUimtPEN7Jq2xASe4bmLY3ZIbpzhEee-G5DczpenLfdVgz_gyAidjBGyQ1w_s5gbefDESFCsOG_Kx96o692zA1N816T6DQRiYqUNFhuBHW67Hnp8qbpsBXkFYCj6m6hSAuietM8jTxn08x_B84" />
                    </div>
                    <span class="text-zapo-green text-[12px] font-bold uppercase tracking-widest mb-3 block">Crónica del
                        Partido</span>
                    <h3
                        class="font-headline text-[22px] font-semibold text-zapo-near-black mb-4 leading-tight group-hover:text-zapo-green transition-colors">
                        La remontada épica de Titanes bajo la lluvia</h3>
                    <div class="text-zapo-near-black/60 text-[17px] font-medium leading-relaxed line-clamp-2">El líder
                        demostró por qué es el favorito tras vencer 3-2 en los minutos finales.</div>
                </div>
                <div class="group cursor-pointer animate-zapo opacity-0" style="animation-delay: 0.2s;">
                    <div
                        class="aspect-[16/10] rounded-large overflow-hidden mb-8 shadow-zapo border border-black/[0.05] group-hover:shadow-zapo-hover transition-all duration-500">
                        <img alt="Referee whistle"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOsZasVqHsQoDQ4C-Jagv5uG0VkM6ojSkYL6oKhnEmufIdP4YVk_re-o3fkdAqm2DFYTwHpIPcHmvLJ2K-fmgpjFnxoOVq2Y6hAeh3j4Pxq2scqMVVjW3iiG48iWNpHnqd9HykMw5vlc6UZvPyY3ddg1UD0kSC6nPP-aWd_wtUgYO7VwnDB2T5-v87Lyt28Eqde5kgP-UfdOVG3zWZOyreX126R3KGdoGodRWd2y-vQNH2ZRFJYsJv3COTlu-xwwVfbwueLYzN1PU" />
                    </div>
                    <span
                        class="text-zapo-green text-[12px] font-bold uppercase tracking-widest mb-3 block">Institucional</span>
                    <h3
                        class="font-headline text-[22px] font-semibold text-zapo-near-black mb-4 leading-tight group-hover:text-zapo-green transition-colors">
                        Nuevas directrices arbitrales para la Liguilla</h3>
                    <div class="text-zapo-near-black/60 text-[17px] font-medium leading-relaxed line-clamp-2">El colegio
                        de árbitros anuncia cambios significativos para las fases finales.</div>
                </div>
                <div class="group cursor-pointer animate-zapo opacity-0" style="animation-delay: 0.3s;">
                    <div
                        class="aspect-[16/10] rounded-large overflow-hidden mb-8 shadow-zapo border border-black/[0.05] group-hover:shadow-zapo-hover transition-all duration-500">
                        <img alt="Trophy"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAftjuDoBdWo5-k1Qk4aetyW092i3TMMqnmYnTaEAP9YCpu683jEkyGhhysp9XtBxtFyJ1vtFHXSVUzgYFSfZmZdGHp01ChO_uiP2tuznJG6620c0QirV-6E1mVRC7zQWKv5YEw8P90KtRUbwkQC5Gy6Htla15eaEJ49E579QRdT5EqncIxOoCe41wnYi7oPE9GJRXiUM-nnhBAMPuXykQv7NZC6eAnk4mdh3EURNgROmvrhc9QE0sT9rosBcrxX_RfAkl4zUrg5Xo" />
                    </div>
                    <span class="text-zapo-green text-[12px] font-bold uppercase tracking-widest mb-3 block">Entrevista
                        Elite</span>
                    <h3
                        class="font-headline text-[22px] font-semibold text-zapo-near-black mb-4 leading-tight group-hover:text-zapo-green transition-colors">
                        Rossi: "Esta liga es mi hogar"</h3>
                    <div class="text-zapo-near-black/60 text-[17px] font-medium leading-relaxed line-clamp-2">
                        Conversamos con el máximo goleador histórico sobre su retiro en 2025.</div>
                </div>
            </div>
            <section class="py-24 bg-zapo-gray px-8">
                <div
                    class="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-white p-12 rounded-[32px] shadow-zapo hover:shadow-zapo-hover transition-all duration-500 relative overflow-hidden group border border-black/[0.03]">
                    <div class="z-10 animate-zapo opacity-0">
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 bg-zapo-gray rounded-full text-[12px] font-bold text-zapo-green mb-6 border border-black/[0.05]">
                            OFICIAL 2024
                        </div>
                        <h2 class="font-headline text-5xl font-semibold text-zapo-near-black mb-6 tracking-tight">Manual
                            de Juego</h2>
                        <p class="text-zapo-near-black/60 text-[21px] font-medium max-w-xl leading-relaxed">Descarga la
                            normativa oficial actualizada para la Temporada 2024. El respeto y el juego limpio son
                            nuestro legado.</p>
                    </div>
                    <button
                        class="bg-zapo-near-black text-white px-12 py-5 rounded-pill font-bold text-lg hover:bg-black transition-all shadow-zapo hover:shadow-zapo-hover z-10 active:scale-95">
                        Normativa PDF
                    </button>
                    <div
                        class="absolute -right-20 -bottom-20 w-96 h-96 bg-zapo-green/5 rounded-full blur-3xl group-hover:bg-zapo-green/10 transition-colors duration-700">
                    </div>
                </div>
            </section>
</body>

</html>