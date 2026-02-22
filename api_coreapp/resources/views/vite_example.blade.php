<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guía de Componentes UI - Vite + Tailwind</title>
    
    <!-- Google Fonts: Inter & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx','resources/js/api.js'])
    
    <style>
        body { font-family: 'Inter', sans-serif; }
        code { font-family: 'JetBrains Mono', monospace; }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c7c7c7; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">

    <!-- Sidebar Navigation (Static for Demo) -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-10">
        <div class="p-6 border-b border-slate-100">
            <h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                UI Components
            </h1>
            <p class="text-xs text-slate-400 mt-1">Vite + Tailwind Guide</p>
        </div>
        <nav class="flex-1 overflow-y-auto p-4 space-y-1">
            <a href="#buttons" class="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">Botones</a>
            <a href="#forms" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Formularios</a>
            <a href="#cards" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Tarjetas</a>
            <a href="#alerts" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Alertas</a>
            <a href="#badges" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Badges & Avatars</a>
            <a href="#navigation" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Navegación</a>
            <a href="#api-tester" class="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">API Tester</a>
        </nav>
    </div>

    <!-- Main Content -->
    <main class="lg:ml-64 p-8 max-w-7xl mx-auto space-y-16">

        <!-- Header -->
        <header class="mb-12">
            <h2 class="text-3xl font-bold text-slate-900">Galería de Componentes</h2>
            <p class="text-slate-500 mt-2 text-lg">Una colección completa de elementos UI modernos listos para usar en tu proyecto Laravel.</p>
        </header>

        <!-- SECTION: API TESTER -->
        <section id="api-tester" class="scroll-mt-20">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-slate-800">API Tester (Funcional)</h3>
                <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Interactivo</span>
            </div>
            
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex-1">
                        <p class="text-slate-600 mb-4">Prueba la conexión con tu API backend directamente desde aquí.</p>
                        <button id="btn-test-api" class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Consultar /api/test
                        </button>
                    </div>
                    <div class="flex-1">
                        <div id="api-result" class="hidden">
                            <div class="bg-slate-900 rounded-lg p-4 overflow-hidden">
                                <div class="flex items-center justify-between mb-2 border-b border-slate-700 pb-2">
                                    <span class="text-xs text-slate-400">Response JSON</span>
                                    <div class="flex space-x-1.5">
                                        <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                        <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                    </div>
                                </div>
                                <pre id="json-output" class="text-green-400 font-mono text-xs overflow-x-auto"></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: BUTTONS -->
        <section id="buttons" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Botones</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Variants -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Variantes</h4>
                    <div class="flex flex-wrap gap-3">
                        <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">Primary</button>
                        <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm">Secondary</button>
                        <button class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">Danger</button>
                        <button class="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition">Ghost</button>
                    </div>
                </div>

                <!-- Sizes -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Tamaños</h4>
                    <div class="flex flex-wrap items-center gap-3">
                        <button class="px-2.5 py-1.5 text-xs bg-indigo-600 text-white rounded-md">Small</button>
                        <button class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">Medium</button>
                        <button class="px-6 py-3 text-base bg-indigo-600 text-white rounded-xl">Large</button>
                    </div>
                </div>

                <!-- States -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Estados</h4>
                    <div class="flex flex-wrap gap-3">
                        <button disabled class="px-4 py-2 bg-indigo-600 text-white rounded-lg opacity-50 cursor-not-allowed">Disabled</button>
                        <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center cursor-wait">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading
                        </button>
                    </div>
                </div>

                <!-- With Icons -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Con Iconos</h4>
                    <div class="flex flex-wrap gap-3">
                        <button class="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-slate-800">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Crear Nuevo
                        </button>
                        <button class="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:text-red-500 hover:border-red-200 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: FORMS -->
        <section id="forms" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Formularios</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                
                <!-- Inputs -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" placeholder="Juan Pérez" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Email (con icono)</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                            </div>
                            <input type="email" placeholder="juan@ejemplo.com" class="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Selección</label>
                        <select class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                            <option>Opción 1</option>
                            <option>Opción 2</option>
                            <option>Opción 3</option>
                        </select>
                    </div>
                </div>

                <!-- Toggles & Checks -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Checkboxes</label>
                        <div class="space-y-2">
                            <label class="inline-flex items-center">
                                <input type="checkbox" class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                                <span class="ml-2 text-slate-600">Recordarme</span>
                            </label>
                            <br>
                            <label class="inline-flex items-center">
                                <input type="checkbox" checked class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                                <span class="ml-2 text-slate-600">Acepto términos (Checked)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Toggle Switch</label>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" class="sr-only peer">
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span class="ml-3 text-sm font-medium text-slate-700">Notificaciones</span>
                        </label>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Textarea</label>
                        <textarea rows="3" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"></textarea>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: CARDS -->
        <section id="cards" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Tarjetas</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Simple Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                    <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h4 class="text-lg font-bold text-slate-800 mb-2">Rendimiento</h4>
                    <p class="text-slate-600 text-sm">Optimizado para cargar rápido y ofrecer la mejor experiencia de usuario posible.</p>
                </div>

                <!-- Image Card -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
                    <div class="h-40 bg-slate-200 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Cover">
                    </div>
                    <div class="p-5">
                        <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Artículo</span>
                        <h4 class="text-lg font-bold text-slate-800 mt-1 mb-2">Diseño Moderno</h4>
                        <p class="text-slate-600 text-sm mb-4">Explorando las tendencias de diseño UI para el 2025.</p>
                        <a href="#" class="text-indigo-600 text-sm font-medium hover:underline">Leer más &rarr;</a>
                    </div>
                </div>

                <!-- Profile Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div class="w-20 h-20 mx-auto bg-slate-200 rounded-full overflow-hidden mb-4 ring-4 ring-slate-50">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" class="w-full h-full object-cover" alt="Avatar">
                    </div>
                    <h4 class="text-lg font-bold text-slate-800">Alex Morgan</h4>
                    <p class="text-slate-500 text-sm mb-4">Desarrollador Full Stack</p>
                    <div class="flex justify-center gap-2">
                        <button class="px-4 py-1.5 text-sm bg-slate-900 text-white rounded-full hover:bg-slate-800">Seguir</button>
                        <button class="px-4 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-full hover:bg-slate-50">Mensaje</button>
                    </div>
                </div>

            </div>
        </section>

        <!-- SECTION: ALERTS -->
        <section id="alerts" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Alertas</h3>
            
            <div class="space-y-4">
                <!-- Success -->
                <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 class="text-sm font-bold text-green-800">Operación Exitosa</h4>
                        <p class="text-sm text-green-700 mt-1">Los cambios han sido guardados correctamente en la base de datos.</p>
                    </div>
                </div>

                <!-- Warning -->
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg flex items-start">
                    <svg class="w-5 h-5 text-yellow-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <div>
                        <h4 class="text-sm font-bold text-yellow-800">Atención Requerida</h4>
                        <p class="text-sm text-yellow-700 mt-1">Tu suscripción está a punto de expirar. Renueva pronto.</p>
                    </div>
                </div>

                <!-- Error -->
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                    <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h4 class="text-sm font-bold text-red-800">Error del Sistema</h4>
                        <p class="text-sm text-red-700 mt-1">No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: BADGES & AVATARS -->
        <section id="badges" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Badges & Avatars</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Badges -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Badges</h4>
                    <div class="flex flex-wrap gap-3">
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Nuevo</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Error</span>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Borrador</span>
                    </div>
                </div>

                <!-- Avatars -->
                <div class="space-y-4">
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider">Avatars</h4>
                    <div class="flex items-center gap-4">
                        <img class="w-12 h-12 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                        <img class="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                        <img class="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                        
                        <!-- Avatar Group -->
                        <div class="flex -space-x-2 ml-4">
                            <img class="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                            <img class="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                            <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">+3</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION: NAVIGATION -->
        <section id="navigation" class="scroll-mt-20">
            <h3 class="text-xl font-semibold text-slate-800 mb-6 border-b border-slate-200 pb-2">Navegación</h3>
            
            <div class="space-y-8">
                <!-- Tabs -->
                <div>
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Tabs</h4>
                    <div class="border-b border-slate-200">
                        <nav class="-mb-px flex space-x-8">
                            <a href="#" class="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Cuenta</a>
                            <a href="#" class="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Seguridad</a>
                            <a href="#" class="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Notificaciones</a>
                        </nav>
                    </div>
                </div>

                <!-- Breadcrumbs -->
                <div>
                    <h4 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Breadcrumbs</h4>
                    <nav class="flex" aria-label="Breadcrumb">
                        <ol class="inline-flex items-center space-x-1 md:space-x-3">
                            <li class="inline-flex items-center">
                                <a href="#" class="text-slate-500 hover:text-slate-900 text-sm font-medium">Home</a>
                            </li>
                            <li>
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                    <a href="#" class="ml-1 text-slate-500 hover:text-slate-900 text-sm font-medium md:ml-2">Proyectos</a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                    <span class="ml-1 text-slate-400 text-sm font-medium md:ml-2">Detalle</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </section>

    </main>

</body>
</html>
