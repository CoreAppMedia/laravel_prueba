# Guía Postman: Fase 3 - Árbitros y Pagos

Esta guía documenta los endpoints de la API creados para la gestión de árbitros, su asignación a torneos y encuentros, y el seguimiento de sus pagos.

## Requisitos Previos
- Debes estar autenticado como Administrador. Usa un token Sanctum de admin como `Bearer Token` en la pestaña de Authorization.

## 1. Catálogo General de Árbitros

### A. Listar Todos los Árbitros
- **Método**: GET
- **URL**: `{{base_url}}/api/arbitros`

### B. Registrar un Nuevo Árbitro
- **Método**: POST
- **URL**: `{{base_url}}/api/arbitros`
- **Body** (JSON):
```json
{
    "nombre": "Juan Pérez",
    "telefono": "5512345678",
    "activo": true
}
```

### C. Actualizar un Árbitro
- **Método**: PUT
- **URL**: `{{base_url}}/api/arbitros/{{arbitro_id}}`
- **Body** (JSON):
```json
{
    "nombre": "Juan Pérez Modificado",
    "telefono": "5500000000",
    "activo": true
}
```

### D. Eliminar un Árbitro
- **Método**: DELETE
- **URL**: `{{base_url}}/api/arbitros/{{arbitro_id}}`

---

## 2. Árbitros en Torneos

### A. Inscribir Árbitro a un Torneo
- **Método**: POST
- **URL**: `{{base_url}}/api/torneos/{{torneo_id}}/arbitros`
- **Body** (JSON):
```json
{
    "arbitro_id": "{{arbitro_id}}"
}
```
**Notas:** El árbitro debe existir en el catálogo general y estar marcado como `activo`.

### B. Ver Árbitros de un Torneo
- **Método**: GET
- **URL**: `{{base_url}}/api/torneos/{{torneo_id}}/arbitros`

### C. Remover Árbitro de un Torneo
- **Método**: DELETE
- **URL**: `{{base_url}}/api/torneos/{{torneo_id}}/arbitros/{{arbitro_id}}`

---

## 3. Árbitros en Partidos (Encuentros)

### A. Asignar Árbitro a un Partido
- **Método**: POST
- **URL**: `{{base_url}}/api/partidos/{{partido_id}}/arbitros`
- **Body** (JSON):
```json
{
    "arbitro_id": "{{arbitro_id}}",
    "rol": "Central",
    "pago": 250.00
}
```
**Roles Sugeridos:** `Central`, `Asistente 1`, `Asistente 2`, `Cuarto Árbitro`.

### B. Remover Árbitro de un Partido
- **Método**: DELETE
- **URL**: `{{base_url}}/api/partidos/{{partido_id}}/arbitros/{{arbitro_id}}`

### C. Registrar/Actualizar Pago de Arbitraje
- **Método**: PATCH
- **URL**: `{{base_url}}/api/partido-arbitro/{{pivot_id}}/pago`
- **Body** (JSON):
```json
{
    "pagado": true,
    "motivo_pago": "Pago efectuado al concluir el encuentro sin incidentes."
}
```
**Notas:** 
- El `pivot_id` es el ID de la relación en la tabla `partido_arbitro`.
- Solo se puede registrar el pago si el partido ya concluyó (estatus `jugado`, `finalizado` o marcado como `cerrado`) o si fue `suspendido`.
- Si el pago no se efectúa, se recomienda usar `motivo_pago` para documentar la sanción o incidencia.
