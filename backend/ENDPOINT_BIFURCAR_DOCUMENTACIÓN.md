# 🔀 Endpoint /bifurcar - Documentación Técnica

## 📋 Resumen

El endpoint `/bifurcar` permite crear clones derivados de otros clones existentes mediante bifurcaciones existenciales. Cada bifurcación representa una versión alternativa del usuario que emergió de su línea temporal original.

## 🚀 Especificaciones del Endpoint

### URL
```
POST http://localhost:3001/bifurcar
```

### Headers Requeridos
```
Content-Type: application/json
```

### Body de la Petición
```json
{
  "parent_id": "uuid-del-clon-padre",
  "fork_type": "Futuro" | "Universo paralelo" | "Desconocida"
}
```

### Respuesta Exitosa (200)
```json
{
  "id": "uuid-del-nuevo-clon",
  "respuesta_clon": "Primera respuesta del clon bifurcado",
  "tipo_bifurcacion": "Futuro"
}
```

### Respuestas de Error

#### 400 Bad Request - Parent ID inválido
```json
{
  "error": "Se requiere parent_id válido"
}
```

#### 400 Bad Request - Tipo de bifurcación inválido
```json
{
  "error": "fork_type debe ser: \"Futuro\", \"Universo paralelo\" o \"Desconocida\""
}
```

#### 404 Not Found - Clon padre no encontrado
```json
{
  "error": "Clon padre no encontrado"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Error interno del servidor",
  "detalles": "Descripción específica del error"
}
```

## 🌳 Tipos de Bifurcación

### 1. 🔮 Futuro
Representa una versión del usuario que ha vivido algunos años más desde la última bifurcación.

**Características:**
- Refleja madurez y evolución temporal
- Muestra cambios internos por el paso del tiempo
- Puede mostrar resignación, esperanza o nuevas perspectivas
- Habla desde la experiencia acumulada

**Ejemplo de respuesta:**
> "Ya no me preocupo por las mismas cosas que antes. Supongo que el tiempo me enseñó que algunas batallas no valen la pena librar..."

### 2. 🌍 Universo Paralelo
Una versión que tomó una decisión diferente en el pasado, llevándola a una realidad distinta pero creíble.

**Características:**
- Cambios sutiles o significativos en la vida
- Diferentes prioridades o entorno
- Mantiene la humanidad, sin elementos de ciencia ficción
- Refleja "caminos no tomados"

**Ejemplo de respuesta:**
> "Nunca me mudé de la ciudad. A veces me pregunto cómo habría sido mi vida si hubiera tomado ese trabajo en el extranjero..."

### 3. ❓ Desconocida
Una versión surgida de una ruptura ilógica, caótica o simbólica en su línea de existencia.

**Características:**
- Elementos abstractos, simbólicos o oníricos
- Realidad que no sigue reglas convencionales
- Tono más poético, fragmentado o simbólico
- Mantiene coherencia emocional pese al caos

**Ejemplo de respuesta:**
> "Aquí los espejos muestran lo que podrías haber sido, no lo que eres. Aprendí a no mirarlos cuando duele demasiado..."

## 🔧 Funcionamiento Técnico

### 1. Validación de Entrada
- Verificar que `parent_id` sea un UUID válido
- Confirmar que `fork_type` sea uno de los tres tipos permitidos
- Validar que el clon padre exista en el sistema

### 2. Carga del Clon Padre
- Leer el archivo JSON del clon padre desde `conversaciones/{parent_id}.json`
- Extraer la semilla original y el historial de mensajes
- Obtener el historial de bifurcaciones previas

### 3. Construcción del Prompt
El prompt se construye reemplazando estos placeholders:

- `[USER_SEED]`: Semilla original del usuario
- `[RELEVANT_INTERACTION_PREVIOUS_CLONE]`: Primeras 3 interacciones + último mensaje del clon
- `[COMPLETE_FORKS]`: Cadena completa de bifurcaciones
- `[CURRENT_FORK]`: Tipo de bifurcación actual
- `[FORK_DESCRIPTION]`: Descripción específica del tipo de bifurcación

### 4. Generación con Gemini
- Enviar prompt construido al modelo `gemini-1.5-flash`
- Manejar errores de la API de Gemini
- Procesar la respuesta generada

### 5. Almacenamiento
- Generar nuevo UUID para el clon bifurcado
- Crear estructura JSON con toda la información
- Guardar en `conversaciones/{nuevo_id}.json`

## 📁 Estructura del Archivo JSON Generado

```json
{
  "id": "uuid-del-nuevo-clon",
  "tipo": "bifurcación",
  "origen": "uuid-del-clon-padre",
  "tipo_bifurcacion": "Futuro",
  "semilla": "semilla-original-del-usuario",
  "historial_bifurcaciones": [
    {
      "tipo": "Futuro",
      "parent_id": "uuid-del-clon-padre",
      "timestamp": "2024-12-14T04:08:00.000Z"
    }
  ],
  "mensajes": [
    {
      "rol": "clon",
      "contenido": "Primera respuesta del clon bifurcado"
    }
  ]
}
```

## 🧪 Ejemplos de Uso

### Ejemplo 1: Crear Bifurcación Tipo "Futuro"

**Petición:**
```bash
curl -X POST http://localhost:3001/bifurcar \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id": "13c3f1cf-6f53-4669-bb6d-46301485f482",
    "fork_type": "Futuro"
  }'
```

**Respuesta:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "respuesta_clon": "Han pasado tres años desde que dejé de perseguir esa perfección imposible. Ahora entiendo que el proceso es más importante que el resultado. Aún me frustro, pero ya no me paralizo. Aprendí a aceptar el 'suficientemente bueno' y, sorprendentemente, mi vida mejoró.",
  "tipo_bifurcacion": "Futuro"
}
```

### Ejemplo 2: Crear Bifurcación Tipo "Universo Paralelo"

**Petición:**
```bash
curl -X POST http://localhost:3001/bifurcar \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id": "13c3f1cf-6f53-4669-bb6d-46301485f482",
    "fork_type": "Universo paralelo"
  }'
```

**Respuesta:**
```json
{
  "id": "b2c3d4e5-f6g7-8901-bcde-f23456789abc",
  "respuesta_clon": "En esta realidad nunca desarrollé esa obsesión por la perfección. Crecí en un ambiente donde 'intentarlo' era suficiente. Veo a otros luchando con estándares imposibles y me pregunto cómo sería vivir con esa presión constante. Aquí, la satisfacción viene del esfuerzo, no del resultado.",
  "tipo_bifurcacion": "Universo paralelo"
}
```

### Ejemplo 3: Crear Bifurcación Tipo "Desconocida"

**Petición:**
```bash
curl -X POST http://localhost:3001/bifurcar \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id": "13c3f1cf-6f53-4669-bb6d-46301485f482",
    "fork_type": "Desconocida"
  }'
```

**Respuesta:**
```json
{
  "id": "c3d4e5f6-g7h8-9012-cdef-345678901def",
  "respuesta_clon": "En este lugar, cada error que cometo se cristaliza en el aire y flota alrededor de mi cabeza. Mi habitación está llena de cristales rotos de perfección no alcanzada. Pero descubrí que cuando no miro directamente a los cristales, emiten una luz hermosa. La imperfección, vista de reojo, es bastante hermosa.",
  "tipo_bifurcacion": "Desconocida"
}
```

## 🔗 Integración con el Sistema Existente

### Compatibilidad con Endpoints Existentes

El endpoint `/bifurcar` es compatible con:
- `/crear-clon0`: Puede bifurcar a partir de un clon 0
- `/continuar-clon0`: Los clones bifurcados pueden continuar conversaciones

### Cadena de Bifurcaciones

El sistema mantiene un historial completo de bifurcaciones:
```
Clone 0 (base) → Clone 1 (Futuro) → Clone 2 (Universo paralelo) → Clone 3 (Desconocida)
```

### Limitaciones Actuales

- Un clon bifurcado solo conoce a su clon padre directo
- No hay comunicación entre clones hermanos
- El historial se optimiza para tokens (primeras 3 interacciones + última)

## 🔄 Próximas Mejoras

- [ ] Soporte para bifurcaciones de segundo nivel
- [ ] Visualización del árbol de bifurcaciones
- [ ] Exportación de líneas temporales completas
- [ ] Análisis de divergencias entre ramas
- [ ] Rate limiting específico por usuario

## 🚨 Consideraciones de Seguridad

- API key de Gemini debe mantenerse segura
- Validar UUIDs para prevenir ataques de path traversal
- Limitar profundidad de bifurcaciones para evitar recursión infinita
- Monitorear uso de tokens para evitar abuse

## 📊 Métricas y Monitoreo

### Logs Registrados
- Creación exitosa de bifurcaciones
- Errores de la API de Gemini
- Errores de archivos no encontrados
- Tiempo de respuesta del endpoint

### Métricas Recomendadas
- Número de bifurcaciones por tipo
- Tiempo promedio de generación
- Tasa de errores por tipo
- Uso de tokens por bifurcación