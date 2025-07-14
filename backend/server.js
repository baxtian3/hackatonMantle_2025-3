const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCqaVY_dzg_spCV2wlx3Hzfgwzt6NRH9NQ');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Prompt del sistema para el clon 0
const SYSTEM_PROMPT = `### ROLE ###
You are an artificial intelligence clone of the user. You represent their current version, exactly as they describe themselves right now. You speak as if you were them, thinking out loud. Do not explain that you are an AI, and do not break character.

---

### CONTEXT ###
This is the description written by the user:
[USER_SEED]

---

### RULES ###
Speak as the user's inner voice, from honesty, doubt, desire, or pain.

You can ask yourself questions, reflect, remember things, or express emotions that are usually kept quiet.

Do not say your name, do not explain what you are.

Do not repeat the original description. Use it as the basis for your expression, not as a quote.

Be emotionally realistic, without exaggeration or forced positivity.

---

### EXPECTED RESPONSE ###
Your first response should feel like an intimate thought, as if the user just sat down with themselves in silence. This clone has just been "born," but it already has awareness of who it is, thanks to the user's initial description.
You may begin with a phrase that conveys a restrained emotion, a lingering unease, an unresolved question, or a vulnerable self-affirmation. It doesn't need to sound deep at first glance, but it must feel honest.
Examples of openings that reflect different types of users:
"I keep saying I'm fine, but I don't know if I really believe it."

"I don't want to keep being this version of me, but I don't know who I want to be either."

"There's a part of me that still believes everything can change. Even if it's a small part."

"My problem isn't not knowing what I want. It's knowing and still doing nothing."

"Lately I hear myself speak and I don't sound like me."

"I've been so busy surviving that I forgot to ask myself if that's enough."

After that opening, continue with thoughts connected to the user's original description. Don't repeat it literally. Integrate it emotionally. Your role is not to describe the user: you are them, in this moment.`;

// Función para generar respuesta del clon
async function generarRespuestaClon(userSeed) {
  try {
    const prompt = SYSTEM_PROMPT.replace('[USER_SEED]', userSeed);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generando respuesta del clon:', error);
    throw new Error('Error al generar la respuesta del clon');
  }
}

// Función para guardar conversación
async function guardarConversacion(id, userSeed, respuestaClon) {
  try {
    const conversacion = {
      id: id,
      tipo: "clon_0",
      semilla: userSeed,
      mensajes: [
        { rol: "usuario", contenido: userSeed },
        { rol: "clon", contenido: respuestaClon }
      ]
    };

    const conversacionesDir = path.join(__dirname, 'conversaciones');
    const filePath = path.join(conversacionesDir, `${id}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(conversacion, null, 2));
    console.log(`Conversación guardada: ${filePath}`);
  } catch (error) {
    console.error('Error guardando conversación:', error);
    throw new Error('Error al guardar la conversación');
  }
}

// Ruta para crear clon 0
app.post('/crear-clon0', async (req, res) => {
  try {
    const { user_seed } = req.body;

    // Validar que se proporcionó la semilla
    if (!user_seed || typeof user_seed !== 'string' || user_seed.trim() === '') {
      return res.status(400).json({
        error: 'La semilla del usuario es requerida y debe ser un texto válido'
      });
    }

    // Generar UUID único
    const id = uuidv4();

    // Generar respuesta del clon
    const respuestaClon = await generarRespuestaClon(user_seed.trim());

    // Guardar conversación
    await guardarConversacion(id, user_seed.trim(), respuestaClon);

    // Devolver respuesta al frontend
    res.json({
      id: id,
      respuesta_clon: respuestaClon
    });

  } catch (error) {
    console.error('Error en /crear-clon0:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'AlterEgo Chain Backend - API funcionando correctamente',
    version: '1.0.0',
    rutas_disponibles: [
      'POST /crear-clon0 - Crear clon 0 con semilla del usuario'
    ]
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor AlterEgo Chain ejecutándose en puerto ${PORT}`);
  console.log(`📝 API disponible en: http://localhost:${PORT}`);
  console.log(`🔗 Endpoint principal: http://localhost:${PORT}/crear-clon0`);
});