# Guía de Postman - Endpoints Fase 1

Usa estos ejemplos para probar los endpoints estructurales base en Postman. 
> [!IMPORTANT]
> Todos estos endpoints están protegidos. Necesitas el enviarlo con el **Bearer Token** en la pestaña *Authorization* obtenido tras iniciar sesión.

---

## 1. Temporadas (`/api/temporadas`)

### Listar Temporadas (`GET /api/temporadas`)
**URL:** `{{base_url}}/temporadas`
*(No requiere body)*

### Crear Temporada (`POST /api/temporadas`)
**URL:** `{{base_url}}/temporadas`
**Body (JSON):**
```json
{
    "nombre": "Apertura 2027",
    "fecha_inicio": "2027-01-01",
    "fecha_fin": "2027-06-30",
    "activa": true
}
```

---

## 2. Torneos (`/api/torneos`)

### Listar Torneos (`GET /api/torneos`)
**URL:** `{{base_url}}/torneos`
*(No requiere body)*

### Crear Torneo (`POST /api/torneos`)
> [!NOTE] 
> Asegúrate de usar UUIDs reales de tu base de datos para `temporada_id` y `tipo_torneo_id`.

**URL:** `{{base_url}}/torneos`
**Body (JSON):**
```json
{
    "temporada_id": "REEMPLAZAR-CON-UUID-TEMPORADA",
    "tipo_torneo_id": "REEMPLAZAR-CON-UUID-TIPO-TORNEO",
    "nombre": "Copa de Verano",
    "fecha_inicio": "2027-07-01",
    "fecha_fin": "2027-08-30",
    "es_abierto": true,
    "costo_inscripcion": 3000.50,
    "costo_arbitraje_por_partido": 500,
    "estatus": "Activo"
}
```

---

## 3. Clubes (`/api/clubs`)

### Listar Clubes (`GET /api/clubs`)
**URL:** `{{base_url}}/clubs`
*(No requiere body)*

### Crear Club (`POST /api/clubs`)
**URL:** `{{base_url}}/clubs`
**Body (JSON):**
```json
{
    "nombre": "Atlas FC",
    "es_club": true,
    "telefono": "3312345678",
    "correo": "contacto@atlasfc.mx",
    "activo": true
}
```

---

## 4. Equipos (`/api/equipos`)

### Listar Equipos (`GET /api/equipos`)
**URL:** `{{base_url}}/equipos`
*(No requiere body)*

### Crear Equipo (`POST /api/equipos`)
> [!NOTE] 
> Usa UUIDs válidos. Recuerda que no puede haber dos equipos con el mismo nombre dentro del mismo club y la misma categoría.

**URL:** `{{base_url}}/equipos`
**Body (JSON):**
```json
{
    "club_id": "REEMPLAZAR-CON-UUID-CLUB",
    "categoria_id": "REEMPLAZAR-CON-UUID-CATEGORIA",
    "nombre_mostrado": "Atlas Categoría Libre",
    "activo": true
}
```

### Cambiar Estatus del Equipo (`PATCH /api/equipos/{id}/status`)
**URL:** `{{base_url}}/equipos/REEMPLAZAR-CON-UUID-EQUIPO/status`
*(No requiere body)*
