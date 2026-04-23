# Análisis del Proyecto: CoreAppMedia (Laravel API)

Este documento contiene un análisis exhaustivo de la arquitectura, diseño, endpoints y estructura de la base de datos del proyecto **CoreAppMedia**, un sistema de gestión deportiva y torneos robusto basado en Laravel.

## 🎨 1. Diseño y Estilo (Apple Inspired Design System)
El proyecto cuenta con un sistema de diseño altamente refinado basado en la filosofía de Apple, detallado en `DESIGN.md`, enfocado en ser reductivo, cinemático y centrado en el producto.

**Paleta de Colores Base:**
- **Fondo Oscuro (Pure Black):** `#000000` - Usado para secciones hero y presentaciones inmersivas.
- **Fondo Claro (Light Gray):** `#f5f5f7` - Usado para contenido informativo, previniendo esterilidad visual.
- **Texto Principal:** `#1d1d1f` (Sobre claros) y `#ffffff` (Sobre oscuros).
- **Acento Interactivo (Apple Blue):** `#0071e3` - Es **el único** color cromático, reservado exclusivamente para elementos interactivos (Botones de CTA, focus rings, links). Solo admite variantes sutiles como `#0066cc` o `#2997ff` dependiendo del fondo.

**Tipografía:**
- **Familia:** Apple System Typography (SF Pro).
- **SF Pro Display:** Reservada para encabezados grandes (20px+). Presenta line-heights altamente ajustados (ej. 1.07), letter-spacing ligeramente negativo y grosores entre 400 y 600.
- **SF Pro Text:** Optimizada para cuerpo de texto y lecturabilidad y elementos de UI (<19px).
- Se prohíben fuentes extra bold, texturas de fondo y se impone un aspecto "maquinado", directo y sumamente profesional.

**Componentes Visuales y Formas:**
- **Botones:** Uso icónico del formato en "pastilla" (Pill CTAs con `980px` auto-radius) para acciones prominentes.
- **Glassmorphism:** Aprovechamiento del efecto blur traslúcido (`backdrop-filter: saturate(180%) blur(20px)`) sobre fondos oscuros, particularmente para la barra principal de navegación flotante.
- **Sombras Mínimas:** En la filosofía Apple el sistema de sombras es sumamente suave y difuminado (`rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`), creando profundidad real. O mitigando relieves mediante diferencias directas de color puro entre "Cards" (`#272729` y variaciones).
- **Ausencia de bordes rígidos:** Las separaciones de layout se basan en bloques de alto contraste, amplios márgenes (arquitectura cinemática con espacios pensados para "respirar").

---

## 🗄️ 2. Arquitectura de Datos (Modelos y Migraciones)
El proyecto está respaldado por **46 migraciones** detalladas orientadas a un ecosistema puramente relacional para controlar eventos dinámicos. Incluye **24 Modelos** en Eloquent organizados con *SoftDeletes* y seguimientos de flujos temporales.

### Entidades Principales (Modelos):
- **Core Deportivo:** `Temporada`, `Torneo`, `Jornada`, `Partido`.
- **Estructura Administrativa de Competidores:** `Club`, `Equipo`, `Cancha`, `CanchaHorario`, `Directivo` (Propietarios o Delegados de clubes y equipos).
- **Personal Especializado (Jueces):** `Arbitro`, `PartidoArbitro`.
- **Relaciones & Pivotes de Lógica Compleja:** `EquipoTorneo` (controla si un equipo ya pagó en una competición específica).
- **Gestión Financiera Total:** `Ingreso`, `Egreso`, `Multa`.
- **Sistema base y Permisología:** `User`, `Rol`, `Permiso`, `AuditLog` (Trazabilidad detallada).
- **Catálogos Dinámicos (Clasificadores):** `CatalogoCategoria`, `CatalogoEstadoPartido`, `CatalogoTipoDueno`, `CatalogoTipoMulta`, `CatalogoTipoTorneo`.

**Evolución y Control de Estado de las Entidades:**
La BBDD cuenta con lógica de evolución. `Partidos` y `Jornadas` soportan múltiples estados transitorios como suspensión de pagos de arbitraje (`motivos_no_pago`), posposición por desastres (suspensiones automáticas e impactos a las `Canchas`), integrando una fina traza de eventos interdependientes.

---

## 🎮 3. Lógica de Negocio (Controladores)
El backend distribuye sus funciones REST en múltiples controladores bajo el namespace `App\Http\Controllers\Api` (y el principal global). Tienen una orientación extrema y muy acoplada al sistema Auth y Middlewares Sanctum para seguridad.

### Controladores Clave:
- **Core de la App:** `TorneoController`, `TemporadaController`, `EquipoController`, `ClubController`, `DirectivoController`, `CanchaController`.
- **Infraestructura y Accesos:** `AuthController`, `PasswordResetController`, `UserController`.
- **Operatividad Dinámica (Workflow Jornadas y Árbitros):** `JornadaController`, `PartidoController`, `ArbitroController`, `PartidoArbitroController`.
- **Módulo Contable (Fases 4 y 5):** `IngresoController`, `EgresoController`, `MultaController`, `FinanzasReporteController` (Reportes de balance global y resúmenes estructurados).

---

## 🌐 4. Endpoints y Rutas (API)
Configurados dentro del enrutador central `routes/api.php`, destacan un altísimo rigor en la separación de responsabilidades acopladas con el Middleware *Gates* de roles de usuario (`can:torneos.view`, `can:equipos.create`).

### Fases Operacionales Listadas:

**4.1. Core Access (Autenticación e Identidad)**
- `POST /register`, `POST /login`, `POST /forgot-password`, `POST /reset-password`
- Middleware exclusivo (`admin_or_dev`): `GET /users`, y sus derivados para cambios de pass, toggles de estado y destrucción/desactivación.

**4.2. Base del Torneo (Creación de Ligas y Dependencias)**
- **Temporadas y Ligas:** CRUD total de `/temporadas`, `/torneos`.
- **Equipos y Clubes:** Endpoints de `/clubs` y `/equipos` con la posibilidad de alternancia de estatus `PATCH /equipos/{equipo}/status`.
- **Logística Operativa (Terreno y Tiempo):** `POST /canchas/{cancha}/horarios` y su gestión CRUD.
- **Pivote Administrativo:** Asignación y vistas cruzadas de directivos (`/directivos/disponibles-para-club`, `/directivos/disponibles-para-equipo`).

**4.3. Motor de Campeonato (Jornadas, Transcurrir del Torneo)**
- Inscripción (`POST /torneos/{torneo}/inscribir`) controlando registros de pago por torneo-equipo.
- Administrar eventos vitales de una temporada en la ruta `jornadas`: `PATCH /jornadas/{jornada}/cerrar`, `/suspender` o `/reactivar`.
- Alteración de Células Competitivas: Sobre la colección de `/partidos` recaen inyecciones críticas como el `PATCH /partidos/{partido}/resultado` o cobros explícitos de multas e impactos de sanciones a pie de evento.

**4.4. Operatividad Arbitral**
- Base global `/arbitros`.
- Endpoint de Relación Torneo-Árbitro: `POST /torneos/{torneo}/arbitros` (un árbitro está inscrito a un torneo en particular).
- Endpoint del Partido (Día del juego): Asignaciones y destituciones desde la ruta `partidos/{partido}/arbitros`.

**4.5. Auditoría y Balance Financiero**
- Se provee toda la estructura *in-out* del dinero en endpoints paralelos: `/multas`, `/ingresos` y `/egresos`.
- Cierre lógico de liquidaciones: `PATCH /multas/{multa}/pago`, `PATCH /partido-arbitro/{id}/pago`, `PATCH /partidos/{partido}/pago-arbitraje`.
- Consumo Analítico: Endpoints que exponen reportes tabulados complejos:
  - `GET /finanzas/balance-global`
  - `GET /finanzas/resumen-torneo/{torneo}`
  - `GET /finanzas/resumen-jornada/{torneo}/{jornada}`
  - `GET /finanzas/recibo-arbitraje/{torneo}/{jornada}`

**4.6. Catálogos Constantes**
Acceso simplificado a entidades neutras del frontend (`tipos-torneo`, `categorias`, `estados-partido`, `tipos-multa`, `tipos-duenos`).

---

## 🚀 Resumen Técnico General
CoreAppMedia ostenta un sólido equilibrio arquitectónico: se vale de Laravel para orquestar una maquinaria pesada y confiable en su backend financiero y de calendarización. Sin embargo, no descuida el frontend que lo consume: la exigencia de un ecosistema que cumpla con directrices **Apple-like** proyecta interfaces con márgenes limpios, ausencias de decoraciones superfluas y con altísima precisión tipográfica focalizada únicamente en la legibilidad y la visualización monumental ("hero") del contenido deportivo.
