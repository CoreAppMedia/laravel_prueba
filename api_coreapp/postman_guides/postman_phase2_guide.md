# Guía Postman: Fase 2 - Inscripciones, Jornadas y Partidos

Esta guía documenta los endpoints de la API creados para manejar la lógica deportiva principal del torneo.

## Requisitos Previos
- Debes estar autenticado como Administrador. Usa un token Sanctum de admin como `Bearer Token` en la pestaña de Authorization.

## 1. Inscripciones (EquipoTorneo)

### A. Inscribir un Equipo a un Torneo
- **Método**: POST
- **URL**: `http://localhost:8000/api/torneos/{{torneo_id}}/inscribir`
- **Body** (JSON):
```json
{
    "equipo_id": "{{equipo_id}}",
    "pagado_inscripcion": false
}
```
**Notas:** 
- El estatus del torneo debe ser `configuracion` o `abierto_inscripciones` y `es_abierto` debe ser `true`.
- La `categoria_id` del Equipo tiene que coincidir con la `categoria_id` del Torneo.
- No puedes inscribir al mismo equipo dos veces (al tiro con los duplicados).

### B. Registrar Pago de Inscripción
- **Método**: PATCH
- **URL**: `http://localhost:8000/api/torneos/{{torneo_id}}/equipos/{{equipo_id}}/pago`
- **Body** (JSON):
```json
{
    "pagado_inscripcion": true
}
```

### C. Listar Equipos Inscritos
- **Método**: GET
- **URL**: `http://localhost:8000/api/torneos/{{torneo_id}}/equipos-inscritos`

## 2. Jornadas

### A. Crear una Jornada
- **Método**: POST
- **URL**: `http://localhost:8000/api/torneos/{{torneo_id}}/jornadas`
- **Body** (JSON):
```json
{
    "numero": 1,
    "fecha_inicio": "2026-10-20",
    "fecha_fin": "2026-10-27"
}
```
**Notas:** `numero` representa el número de la Jornada (Jornada 1, Jornada 2, etc.). No se puede repetir el número dentro de un mismo torneo.

### B. Ver Jornadas de un Torneo
- **Método**: GET
- **URL**: `http://localhost:8000/api/torneos/{{torneo_id}}/jornadas`

### C. Cerrar una Jornada
- **Método**: PATCH
- **URL**: `http://localhost:8000/api/jornadas/{{jornada_id}}/cerrar`
**Notas:** ¡Ojo! No vas a poder cerrar una jornada si todavía hay partidos adentro que no estén marcados como `cerrados` (finalizados administrativamente).

## 3. Partidos

### A. Programar un Partido
- **Método**: POST
- **URL**: `http://localhost:8000/api/jornadas/{{jornada_id}}/partidos`
- **Body** (JSON):
```json
{
    "equipo_local_id": "{{equipo_local_id}}",
    "equipo_visitante_id": "{{equipo_visitante_id}}",
    "fecha": "2026-10-24 18:00:00"
}
```
**Notas:** Los dos equipos tienen que estar inscritos en el Torneo. Además, un equipo no puede jugar contra sí mismo (tienen que ser diferentes).

### B. Registrar el Resultado del Partido
- **Método**: PATCH
- **URL**: `http://localhost:8000/api/partidos/{{partido_id}}/resultado`
- **Body** (JSON):
```json
{
    "goles_local": 3,
    "goles_visitante": 1
}
```

### C. Cerrar un Partido
- **Método**: PATCH
- **URL**: `http://localhost:8000/api/partidos/{{partido_id}}/cerrar`
**Notas:** Cerrar un partido lo bloquea para que ya no le muevan al resultado. Debes cerrar todos los partidos de la jornada para poder cerrar la jornada completa.
