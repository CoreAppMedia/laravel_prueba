# Guía Postman: Fase 4 - Finanzas (Multas, Ingresos y Egresos)

Esta guía documenta los endpoints para la gestión económica del torneo, incluyendo el control de multas, ingresos manuales y gastos (egresos).

## Requisitos Previos
- Debes estar autenticado como Administrador o Desarrollador. Usa un `Bearer Token` válido.

---

## 1. Gestión de Multas (Fines)

### A. Listar Multas
- **Método**: GET
- **URL**: `{{base_url}}/api/multas`
- **Filtros Opcionales** (Query Params):
    - `torneo_id`: Filtrar por torneo.
    - `equipo_id`: Filtrar por equipo.
    - `pagada`: `true` o `false`.

### B. Registrar una Multa
- **Método**: POST
- **URL**: `{{base_url}}/api/multas`
- **Body** (JSON):
```json
{
    "equipo_id": "{{equipo_id}}",
    "torneo_id": "{{torneo_id}}",
    "tipo_multa_id": "{{tipo_multa_id}}",
    "partido_id": "{{partido_id}}",
    "motivo": "Conducta antideportiva en la banca.",
    "monto": 500.00,
    "fecha": "2026-03-23"
}
```
**Reglas:** `equipo_id` y `torneo_id` son obligatorios. El `monto` debe ser mayor a 0.

### C. Actualizar Multa
- **Método**: PUT
- **URL**: `{{base_url}}/api/multas/{{multa_id}}`
- **Body** (JSON):
```json
{
    "motivo": "Motivo actualizado por revisión académica.",
    "monto": 450.00
}
```
**Nota:** Solo se puede actualizar si la multa **no ha sido pagada**.

### D. Registrar Pago de Multa
- **Método**: PATCH
- **URL**: `{{base_url}}/api/multas/{{multa_id}}/pago`
**Efecto:** Marca la multa como pagada y genera automáticamente un registro en la tabla de `ingresos`.

### E. Eliminar Multa
- **Método**: DELETE
- **URL**: `{{base_url}}/api/multas/{{multa_id}}`
**Nota:** No se pueden eliminar multas ya pagadas.

---

## 2. Ingresos (Income)

### A. Listar Ingresos
- **Método**: GET
- **URL**: `{{base_url}}/api/ingresos`
- **Filtro**: `?torneo_id={{torneo_id}}`

### B. Registrar Ingreso Manual
- **Método**: POST
- **URL**: `{{base_url}}/api/ingresos`
- **Body** (JSON):
```json
{
    "torneo_id": "{{torneo_id}}",
    "concepto": "Patrocinio de Uniformes - Tienda Local",
    "monto": 2500.00,
    "fecha": "2026-03-23"
}
```

### C. Eliminar Registro de Ingreso
- **Método**: DELETE
- **URL**: `{{base_url}}/api/ingresos/{{ingreso_id}}`

---

## 3. Egresos / Salidas (Expenses)

### A. Listar Egresos
- **Método**: GET
- **URL**: `{{base_url}}/api/egresos`
- **Filtro**: `?torneo_id={{torneo_id}}`

### B. Registrar un Gasto (Egreso)
- **Método**: POST
- **URL**: `{{base_url}}/api/egresos`
- **Body** (JSON):
```json
{
    "torneo_id": "{{torneo_id}}",
    "concepto": "Pago de arbitraje jornada 1",
    "monto": 1200.00,
    "fecha": "2026-03-23"
}
```

### C. Eliminar Registro de Egreso
- **Método**: DELETE
- **URL**: `{{base_url}}/api/egresos/{{egreso_id}}`
