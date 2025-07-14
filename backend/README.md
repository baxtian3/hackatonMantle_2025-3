# AlterEgo Chain Backend

Backend para la aplicación conversacional experimental "AlterEgo Chain", centrada en la creación de clones virtuales del usuario.

## 🚀 Características

- API REST con Express.js
- Integración con Google Gemini AI (modelo gemini-2.0-flash-exp)
- Generación de clones virtuales basados en descripciones personales
- Almacenamiento de conversaciones en formato JSON
- Validación de datos de entrada
- Manejo de errores robusto

## 📋 Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3001`

## 📚 API Documentation

### POST /crear-clon0

Crea el clon 0 (primera instancia) basado en la semilla del usuario.

**URL:** `http://localhost:3001/crear-clon0`

**Método:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user_seed": "Descripción personal del usuario"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-generado",
  "respuesta_clon": "Respuesta generada por el clon"
}
```

**Respuesta de error (400):**
```json
{
  "error": "La semilla del usuario es requerida y debe ser un texto válido"
}
```

**Respuesta de error (500):**
```json
{
  "error": "Error interno del servidor",
  "detalles": "Descripción del error"
}
```

### GET /

Ruta de prueba que muestra información del API.

**URL:** `http://localhost:3001/`

**Método:** `GET`

**Respuesta:**
```json
{
  "mensaje": "AlterEgo Chain Backend - API funcionando correctamente",
  "version": "1.0.0",
  "rutas_disponibles": [
    "POST /crear-clon0 - Crear clon 0 con semilla del usuario"
  ]
}
```

## 📁 Estructura de Archivos

```
backend/
├── conversaciones/          # Directorio donde se guardan las conversaciones
│   └── [uuid].json        # Archivos JSON con las conversaciones
├── server.js              # Archivo principal del servidor
├── package.json           # Dependencias y scripts
└── README.md             # Documentación
```

## 💾 Almacenamiento de Conversaciones

Cada conversación se guarda en un archivo JSON con la siguiente estructura:

```json
{
  "id": "uuid-generado",
  "tipo": "clon_0",
  "semilla": "texto original del usuario",
  "mensajes": [
    {
      "rol": "usuario",
      "contenido": "texto original del usuario"
    },
    {
      "rol": "clon",
      "contenido": "respuesta generada por Gemini"
    }
  ]
}
```

## 🤖 Prompt del Sistema

El clon 0 utiliza un prompt especializado que:

- Se comporta como la voz interior del usuario
- Habla desde la honestidad, duda, deseo o dolor
- No explica que es una IA
- Mantiene un tono emocionalmente realista
- Comienza con una reflexión íntima y honesta

## 🔧 Configuración

### Variables de Entorno

Puedes crear un archivo `.env` en el directorio `backend/` para configurar:

```env
PORT=3001
GEMINI_API_KEY=tu_api_key_aqui
```

### API Key de Gemini

La API key de Gemini está configurada directamente en el código. Para mayor seguridad, considera usar variables de entorno.

## 🧪 Testing

Puedes probar la API usando curl:

```bash
# Probar la ruta de prueba
curl http://localhost:3001/

# Crear un clon 0
curl -X POST http://localhost:3001/crear-clon0 \
  -H "Content-Type: application/json" \
  -d '{
    "user_seed": "Soy una persona que siempre busca la perfección pero nunca la alcanza. Me frustro fácilmente cuando las cosas no salen como espero."
  }'
```

## 🚨 Manejo de Errores

El backend incluye manejo de errores para:

- Datos de entrada inválidos
- Errores de la API de Gemini
- Errores de escritura de archivos
- Errores de red

## 📝 Logs

El servidor registra:
- Inicio del servidor
- Conversaciones guardadas
- Errores detallados

## 🔄 Próximas Funcionalidades

- Soporte para múltiples clones
- Historial de conversaciones
- Autenticación de usuarios
- Rate limiting
- Compresión de respuestas

## 📄 Licencia

MIT License