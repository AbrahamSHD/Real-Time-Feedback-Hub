# Real-Time Feedback Hub - Backend

Este repositorio contiene el código fuente del backend para el proyecto Real-Time Feedback Hub. Está construido con Node.js, Express, TypeScript, PostgreSQL y WebSockets nativos.

## Arquitectura

El sistema utiliza un enfoque **híbrido** diseñado para maximizar la eficiencia y mejorar la experiencia del usuario:
- **API REST**: Se encarga de la carga inicial de datos y el procesamiento de todas las operaciones CRUD (creación de mensajes, asignación de *likes*). Esto garantiza fiabilidad, un estado inicial consistente y manejo estándar de errores HTTP.
- **WebSockets Nativos (ws)**: Gestiona la reactividad en tiempo real. En lugar de que los clientes hagan *polling* al servidor, estos mantienen una conexión persistente. Cada vez que una operación REST muta el estado (como enviar un nuevo mensaje o dar un *like*), el servidor emite un evento a través de WebSocket a todos los clientes conectados, manteniendo las interfaces sincronizadas instantáneamente con una latencia mínima.

## Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas antes de iniciar:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker y Docker Compose](https://www.docker.com/products/docker-desktop/) (para contenedorizar la base de datos PostgreSQL)
- NPM (incluido con Node.js)

## Pasos para levantar el proyecto

Sigue estos pasos para tener el servidor y la base de datos corriendo localmente:

### 1. Instalar dependencias

En la raíz del directorio backend, instala los paquetes necesarios:

```bash
npm install
```

### 2. Configuración de Variables de Entorno

Copia el archivo de ejemplo para crear tu configuración local:

```bash
cp .env.example .env
```
*(Asegúrate de revisar el archivo `.env` para confirmar que las credenciales de la base de datos coincidan con las de tu entorno).*

### 3. Levantar la base de datos

Utiliza Docker Compose para iniciar el contenedor de PostgreSQL en segundo plano. Esto creará la base de datos y ejecutará el esquema inicial de tablas:

```bash
docker-compose up -d
```

### 4. Poblar datos (Seeding)

Ejecuta el script de semilla para insertar datos de prueba iniciales en la base de datos:

```bash
npm run seed
```

### 5. Iniciar el servidor (Desarrollo)

Arranca el servidor en modo desarrollo (con recarga en caliente utilizando `ts-node-dev`):

```bash
npm run dev
```

El servidor REST estará disponible en `http://localhost:3000` y el servidor de WebSockets aceptará conexiones en `ws://localhost:3000`.

---

## Documentación de la API (REST)

El backend expone los siguientes endpoints bajo el prefijo `/api/messages`:

### `GET /api/messages`
- **Descripción**: Obtiene la lista de los últimos 50 mensajes ordenados desde el más reciente al más antiguo.
- **Respuesta Exitosa**: `200 OK` (Array de objetos).

### `POST /api/messages`
- **Descripción**: Crea y almacena un nuevo mensaje de feedback.
- **Body Requerido**: `{"text": "Contenido del mensaje"}` (application/json).
- **Respuesta Exitosa**: `201 Created` (Devuelve el objeto del mensaje insertado).

### `POST /api/messages/:id/like`
- **Descripción**: Incrementa en 1 el contador de *likes* de un mensaje específico.
- **Parámetros**: `:id` (UUID o identificador del mensaje en la URL).
- **Respuesta Exitosa**: `200 OK` (Devuelve el objeto del mensaje actualizado).

---

## Eventos de WebSocket

El servidor emite eventos en formato JSON a todos los clientes conectados cuando el estado cambia. La estructura de los mensajes emitidos es la siguiente:
`{ "event": "NOMBRE_DEL_EVENTO", "payload": { ... } }`

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `NEW_MESSAGE` | Emitido cuando se crea un nuevo mensaje exitosamente a través del endpoint REST correspondiente. | El objeto del mensaje recién creado. |
| `LIKE_UPDATED` | Emitido cuando se registra un nuevo *like* en un mensaje existente. | El objeto del mensaje actualizado con el nuevo conteo de *likes*. |
