# Guía de Postman - Gestión de Usuarios

Usa estos ejemplos para probar los endpoints de administración de usuarios en Postman. 
> [!WARNING]
> Estos endpoints requieren que el usuario logueado en el Bearer token tenga rol de administrador (ej, con el token del email `dev@ligamx.test`).

---

## 1. Actualizar Usuario (`PUT /api/users/{id}`)

**URL:** `{{base_url}}/users/{uuid_del_usuario}`
**Headers:**
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`

**Body (raw JSON):**
```json
{
    "name": "admin_modificado",
    "email": "admin2@ligamx.test",
    "nombre": "Administrador",
    "apellido_paterno": "Principal",
    "apellido_materno": "",
    "permiso_id": 2,
    "rol_id": 1,
    "asignado": null
}
```

---

## 2. Cambiar Contraseña de Usuario (`PUT /api/users/{id}/password`)

**URL:** `{{base_url}}/users/{uuid_del_usuario}/password`
**Headers:**
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`

**Body (raw JSON):**
```json
{
    "password": "NuevaPassword123@",
    "password_confirmation": "NuevaPassword123@"
}
```

---

## 3. Activar/Desactivar Usuario (`PATCH /api/users/{id}/status`)

**URL:** `{{base_url}}/users/{uuid_del_usuario}/status`
**Headers:**
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`

*(No requiere Body)*

---

## 4. Eliminar Usuario - Soft Delete (`DELETE /api/users/{id}`)

**URL:** `{{base_url}}/users/{uuid_del_usuario}`
**Headers:**
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`
