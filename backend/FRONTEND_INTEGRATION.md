# Integración Frontend - Backend

## 🔗 Configuración de Conexión

El backend de AlterEgo Chain está configurado para ejecutarse en `http://localhost:3001`.

### Endpoints Disponibles

#### POST /crear-clon0

**URL:** `http://localhost:3001/crear-clon0`

**Headers requeridos:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user_seed": "Descripción personal del usuario"
}
```

**Respuesta exitosa:**
```json
{
  "id": "uuid-generado",
  "respuesta_clon": "Respuesta generada por el clon"
}
```

## 📝 Ejemplo de Uso en JavaScript

```javascript
// Función para crear clon 0
async function crearClon0(userSeed) {
  try {
    const response = await fetch('http://localhost:3001/crear-clon0', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_seed: userSeed
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creando clon:', error);
    throw error;
  }
}

// Ejemplo de uso
const userSeed = "Soy una persona que siempre busca la perfección pero nunca la alcanza.";
const resultado = await crearClon0(userSeed);
console.log('ID del clon:', resultado.id);
console.log('Respuesta del clon:', resultado.respuesta_clon);
```

## 📝 Ejemplo de Uso en React

```jsx
import { useState } from 'react';

function AlterEgoForm() {
  const [userSeed, setUserSeed] = useState('');
  const [clonResponse, setClonResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/crear-clon0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_seed: userSeed
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error desconocido');
      }

      const data = await response.json();
      setClonResponse(data.respuesta_clon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={userSeed}
          onChange={(e) => setUserSeed(e.target.value)}
          placeholder="Describe tu versión íntima..."
          rows={4}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creando clon...' : 'Crear Clon 0'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {clonResponse && (
        <div className="clon-response">
          <h3>Respuesta del Clon:</h3>
          <p>{clonResponse}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 Configuración de CORS

El backend ya está configurado con CORS habilitado para permitir conexiones desde el frontend. Si necesitas configurar orígenes específicos, puedes modificar el archivo `server.js`:

```javascript
// Configuración específica de CORS
app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
```

## 🚨 Manejo de Errores

### Errores Comunes

1. **400 Bad Request**: Semilla vacía o inválida
   ```json
   {
     "error": "La semilla del usuario es requerida y debe ser un texto válido"
   }
   ```

2. **500 Internal Server Error**: Error en la API de Gemini o del servidor
   ```json
   {
     "error": "Error interno del servidor",
     "detalles": "Descripción del error"
   }
   ```

### Validaciones del Frontend

```javascript
function validarSemilla(semilla) {
  if (!semilla || typeof semilla !== 'string') {
    return 'La semilla es requerida';
  }
  
  if (semilla.trim().length === 0) {
    return 'La semilla no puede estar vacía';
  }
  
  if (semilla.length > 1000) {
    return 'La semilla es demasiado larga (máximo 1000 caracteres)';
  }
  
  return null; // Sin errores
}
```

## 🧪 Testing

Puedes probar la API usando el script incluido:

```bash
cd backend
node test-api.js
```

O usando curl:

```bash
curl -X POST http://localhost:3001/crear-clon0 \
  -H "Content-Type: application/json" \
  -d '{"user_seed": "Soy una persona introspectiva que siempre busca la perfección."}'
```

## 📊 Respuestas de Ejemplo

### Semilla de Usuario Perfeccionista
```json
{
  "id": "uuid-generado",
  "respuesta_clon": "It's exhausting, isn't it? This constant… striving. Like chasing a shadow. I get so close, I can almost feel the perfection, the smooth surface of it, and then…poof. Gone. Another mess, another failure. Maybe I'm just setting the bar too high? Or maybe… maybe the bar isn't the problem. Maybe *I'm* the problem."
}
```

### Semilla de Usuario Introspectivo
```json
{
  "id": "uuid-generado",
  "respuesta_clon": "Ugh, this feeling of… needing external validation. It's exhausting, isn't it? Always second-guessing myself, checking the mirror of other people's faces for approval. Is this what it means to *live*? To constantly be seeking a confirmation code from the outside?"
}
```

## 🔄 Próximas Funcionalidades

- Soporte para múltiples clones
- Historial de conversaciones
- Autenticación de usuarios
- Rate limiting
- Compresión de respuestas