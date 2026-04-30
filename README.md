# MongoDB Slack - Backend

Este es el backend para la aplicación de clon de Slack, construida con Node.js, Express y MongoDB.

## 🚀 Despliegue

Puedes encontrar la API desplegada en:
[mongo-db-slack-backend.vercel.app](https://mongo-db-slack-backend.vercel.app/)

## 🛠️ Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/lucashg11/MongoDB-Slack-Backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y añade las variables necesarias (PORT, MONGO_URI, JWT_SECRET, CLOUDINARY_*, etc.).

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Iniciar el servidor en modo producción:**
   ```bash
   npm start
   ```

## 📚 Documentación de Endpoints

### Autenticación (`/api/auth`)
- `POST /register`: Registrar un nuevo usuario.
- `POST /login`: Iniciar sesión.
- `GET /verify-email`: Verificar correo electrónico.
- `POST /reset-password-request`: Solicitar restablecimiento de contraseña.
- `POST /reset-password/:reset_password_token`: Restablecer contraseña.

### Usuarios (`/api/user`)
- `GET /me`: Obtener información del usuario autenticado.
- `PATCH /profile`: Actualizar el perfil del usuario.

### Archivos (`/api/file`)
- `POST /upload`: Subir un archivo (imagen).

### Workspaces (`/api/workspace`)
- `GET /`: Obtener todos los workspaces del usuario.
- `POST /`: Crear un nuevo workspace.
- `GET /:workspace_id`: Obtener detalles de un workspace.
- `PATCH /:workspace_id`: Actualizar un workspace (Admin/Owner).
- `DELETE /:workspace_id`: Eliminar un workspace (Admin/Owner).
- `GET /:workspace_id/channels`: Obtener canales de un workspace.
- `POST /:workspace_id/channels`: Crear un canal (Admin/Owner).
- `DELETE /:workspace_id/channels/:channel_id`: Eliminar un canal (Admin/Owner).
- `GET /:workspace_id/member`: Listar miembros del workspace.
- `POST /:workspace_id/member/invite`: Invitar a un miembro (Admin/Owner).
- `GET /:workspace_id/member/respond`: Responder a una invitación.
- `PUT /:workspace_id/member/:member_id`: Actualizar rol de un miembro (Admin/Owner).
- `DELETE /:workspace_id/member/:member_id`: Eliminar un miembro.
- `GET /:workspace_id/channels/:channel_id/message`: Obtener mensajes de un canal.
- `POST /:workspace_id/channels/:channel_id/message`: Enviar un mensaje.
- `POST /:workspace_id/channels/:channel_id/invite`: Invitar a un miembro al canal (Admin/Owner).

## 🔑 Credenciales de Prueba

Para probar la aplicación, puedes usar las siguientes cuentas:

**Owner:**
- **Email:** `test.backend.dwfs@gmail.com`
- **Password:** `owner1234`

**Admin:**
- **Email:** `test2.backend.dwfs@gmail.com`
- **Password:** `admin1234`
