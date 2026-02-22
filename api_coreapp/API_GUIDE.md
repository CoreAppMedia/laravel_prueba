# Guía de Uso de API - CoreAppMedia

Este documento sirve como referencia para los endpoints de la API. Incluye la URL, método, descripción y ejemplos de cuerpo (Body) para probar en Postman.

Base URL: `http://127.0.0.1:8000/api`

---

## 1. Prueba de Conexión
Verifica que la API esté funcionando correctamente.

- **Método**: `GET`
- **Endpoint**: `/test`
- **Auth**: No requerida

**Respuesta Exitosa:**
```json
{
    "status": "ok",
    "message": "API CoreAppMedia esta correcto"
}
```

---

## 2. Autenticación

### 2.1 Registro de Usuario
Crea una nueva cuenta de usuario.

- **Método**: `POST`
- **Endpoint**: `/register`
- **Headers**:
    - `Content-Type`: `application/json`
    - `Accept`: `application/json`
    - `X-Registration-Key`: `tu_clave_secreta` (Requerido)

**Body (JSON):**
```json
{
    "name": "juanperez",
    "email": "juan@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "nombre": "Juan",
    "apellido_paterno": "Perez",
    "apellido_materno": "Lopez",
    "permiso_id": 1, 
    "rol_id": 1,
    "asignado": ["proyecto1", "seccion2"]
}
```
*Nota: `permiso_id` y `rol_id` deben ser IDs válidos de los catálogos. `asignado` es opcional.*

---

### 2.2 Iniciar Sesión (Login)
Autentica un usuario y devuelve un token de acceso.

- **Método**: `POST`
- **Endpoint**: `/login`
- **Headers**:
    - `Content-Type`: `application/json`
    - `Accept`: `application/json`

**Body (JSON):**
```json
{
    "email": "juan@example.com",
    "password": "password123"
}
```

**Respuesta Exitosa:**
```json
{
    "access_token": "1|...",
    "token_type": "Bearer",
    "user": { ... }
}
```

---

### 2.3 Cerrar Sesión (Logout)
Revoca el token de acceso actual.

- **Método**: `POST`
- **Endpoint**: `/logout`
- **Auth**: Bearer Token (requerido)
- **Headers**:
    - `Authorization`: `Bearer <tu_token_aqui>`
    - `Accept`: `application/json`

---

### 2.4 Obtener Usuario Actual
Devuelve la información del usuario autenticado.

- **Método**: `GET`
- **Endpoint**: `/user`
- **Auth**: Bearer Token (requerido)
- **Headers**:
    - `Authorization`: `Bearer <tu_token_aqui>`
    - `Accept`: `application/json`

---

## 3. Recuperación de Contraseña

### 3.1 Enviar Link de Recuperación
Envía un correo con el token para restablecer la contraseña.

- **Método**: `POST`
- **Endpoint**: `/forgot-password`
- **Headers**: `Content-Type: application/json`

**Body (JSON):**
```json
{
    "email": "juan@example.com"
}
```

### 3.2 Restablecer Contraseña
Cambia la contraseña usando el token recibido por correo.

- **Método**: `POST`
- **Endpoint**: `/reset-password`
- **Headers**: `Content-Type: application/json`

**Body (JSON):**
```json
{
    "token": "token_recibido_por_correo",
    "email": "juan@example.com",
    "password": "nueva_password123",
    "password_confirmation": "nueva_password123"
}
```

---

## 4. Gestión de Usuarios (Protegido)
**Requisito**: Solo usuarios con `permiso_id: 1` y `rol_id: 1`.

### 4.1 Editar Usuario
- **Método**: `PUT`
- **Endpoint**: `/users/{id}`
- **Auth**: Bearer Token (requerido)

**Body (JSON):**
```json
{
    "nombre": "Nuevo Nombre",
    "rol_id": 2
}
```

### 4.2 Eliminar Usuario
- **Método**: `DELETE`
- **Endpoint**: `/users/{id}`
- **Auth**: Bearer Token (requerido)

### 4.3 Cambiar Contraseña de Usuario (Admin)
Permite a un administrador cambiar la contraseña de cualquier usuario.

- **Método**: `PUT`
- **Endpoint**: `/users/{id}/password`
- **Auth**: Bearer Token (requerido, Permiso 1 y Rol 1)
- **Headers**:
    - `Authorization`: `Bearer <tu_token_aqui>`
    - `Content-Type`: `application/json`
    - `Accept`: `application/json`

**Body (JSON):**
```json
{
    "password": "NuevaPassword123!",
    "password_confirmation": "NuevaPassword123!"
}
```

### 4.4 Activar/Desactivar Usuario (Admin)
Permite a un administrador cambiar el estado activo/inactivo de un usuario.

- **Método**: `PATCH`
- **Endpoint**: `/users/{id}/status`
- **Auth**: Bearer Token (requerido, Permiso 1 y Rol 1)
- **Headers**:
    - `Authorization`: `Bearer <tu_token_aqui>`
    - `Content-Type`: `application/json`
    - `Accept`: `application/json`

**Body (JSON):**
```json
{
    "active": true // o false para desactivar
}
```

