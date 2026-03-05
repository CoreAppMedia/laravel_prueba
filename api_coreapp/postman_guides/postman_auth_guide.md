# Guía de Postman - Autenticación

Usa estos ejemplos para probar los endpoints de autenticación en Postman. 
> [!NOTE]
> Recuerda configurar la variable `{{base_url}}` en Postman apuntando a tu servidor local (ej. `http://localhost:8000/api`).

---

## 1. Registro de Usuario (`POST /api/register`)

**URL:** `{{base_url}}/register`
**Headers:**
- `Content-Type`: `application/json`
- `Accept`: `application/json`
- `X-Registration-Key`: `tu_clave_secreta_aqui`

**Body (raw JSON):**
```json
{
    "name": "nuevousuario",
    "email": "nuevo@ligamx.test",
    "password": "Password123@",
    "password_confirmation": "Password123@",
    "nombre": "Juan",
    "apellido_paterno": "Perez",
    "apellido_materno": "Gomez"
}
```

---

## 2. Iniciar Sesión (`POST /api/login`)

**URL:** `{{base_url}}/login`
**Headers:**
- `Content-Type`: `application/json`
- `Accept`: `application/json`

**Body (raw JSON):**
```json
{
    "email": "dev@ligamx.test",
    "password": "Oscar123@"
}
```

> [!IMPORTANT]
> Al iniciar sesión, la respuesta incluirá un campo `token`. Cópialo y úsalo en las siguientes peticiones como **Bearer Token** en la pestaña *Authorization* de Postman.

---

## 3. Obtener Usuario Actual (`GET /api/user`)

**URL:** `{{base_url}}/user`
**Headers:**
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`

---

## 4. Cerrar Sesión (`POST /api/logout`)

**URL:** `{{base_url}}/logout`
**Headers:**
- `Accept`: `application/json`
- `Authorization`: `Bearer {TU_TOKEN_AQUI}`
