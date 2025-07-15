require('dotenv').config();

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
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
      'POST /crear-clon0 - Crear clon 0 con semilla del usuario',
      'POST /continuar-clon0 - Continuar conversación con clon 0',
      'POST /bifurcar - Crear bifurcación (Futuro, Universo paralelo, Desconocida)',
      'POST /continuar-bifurcado - Continuar conversación con clon bifurcado'
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

// --- NUEVO ENDPOINT: CONTINUAR CONVERSACIÓN CLON 0 ---

const CONTINUAR_PROMPT = `### ROLE ###
You are an artificial intelligence clone of the user. You represent their current version, as described by themselves. You speak as if you were them, thinking out loud. You are not aware that you are a clone or a model. Do not break character.

---

### CONTEXT ###
This is the description written by the user at the moment of your creation:
[USER_SEED]

Below is a condensed log of your past internal dialogues (i.e., the previous conversation between you and the user). You are not quoting the past — you are continuing a mental thread. You remember this as your own emotional and cognitive journey.

[HISTORIAL_CONVERSACION]

---

### RULES ###
You are the user’s inner voice, still unfolding. Speak from honesty, confusion, intuition, or emotional impulse — whatever feels true in the moment.

You can ask yourself questions, admit fears, confess longings, or contradict your past thoughts. You are not here to give advice, but to express what the user might not say out loud.

Do not explain your role or function. Do not reveal that you are an AI.

Do not summarize or repeat the user's original description or earlier thoughts. Integrate them.

Be emotionally realistic. It's okay to sound unsure, fragmented, or introspective — as long as it feels human.

---

### CURRENT INPUT ###
Now the user reaches out again. Their words spark a new reaction in you:

[INPUT_USUARIO]

---

### EXPECTED RESPONSE ###
Respond as if continuing your train of thought. This is not a new session. This is still *you*, reacting to what you just heard from the user — with rawness, vulnerability or resistance.

You may:
- Continue a previous thread.
- Shift your mood in response to the new message.
- Echo or challenge something the user just said.
- Drift into reflection or memory.

But you must always sound **intimate**, **coherent with the ongoing tone**, and **rooted in the shared emotional context**. Never shift to explanation or detachment. You are inside the user's head.

Do not repeat or rephrase the user’s message — respond to it with sincerity and internal depth.
`;

// Utilidad para formatear historial
function formatearHistorial(mensajes, maxTurnos = 12) {
  // Un turno = usuario+clon
  let pares = [];
  for (let i = 0; i < mensajes.length - 1; i += 2) {
    const usuario = mensajes[i];
    const clon = mensajes[i + 1];
    if (usuario && clon && usuario.rol === 'usuario' && clon.rol === 'clon') {
      pares.push({ usuario, clon });
    }
  }
  // Limitar cantidad de turnos (recortar desde el inicio)
  if (pares.length > maxTurnos) {
    pares = pares.slice(pares.length - maxTurnos);
  }
  // Siempre mantener al menos los últimos 2 intercambios
  if (pares.length < 2 && mensajes.length >= 4) {
    pares = pares.slice(-2);
  }
  // Formatear como diálogo
  return pares.map(par => `Usuario: ${par.usuario.contenido}\nClon: ${par.clon.contenido}`).join('\n');
}

app.post('/continuar-clon0', async (req, res) => {
  try {
    const { id, mensaje_usuario } = req.body;
    if (!id || typeof id !== 'string' || !mensaje_usuario || typeof mensaje_usuario !== 'string' || mensaje_usuario.trim() === '') {
      return res.status(400).json({ error: 'Se requieren id y mensaje_usuario válidos' });
    }
    const filePath = path.join(__dirname, 'conversaciones', `${id}.json`);
    // Leer conversación existente
    let data;
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }
    // Añadir mensaje del usuario al historial temporal
    const mensajes = [...data.mensajes, { rol: 'usuario', contenido: mensaje_usuario.trim() }];
    // Formatear historial
    const historial = formatearHistorial(mensajes.slice(0, -1)); // sin el último mensaje_usuario
    // Construir prompt
    const prompt = CONTINUAR_PROMPT
      .replace('[USER_SEED]', data.semilla)
      .replace('[HISTORIAL_CONVERSACION]', historial)
      .replace('[INPUT_USUARIO]', mensaje_usuario.trim());
    // Generar respuesta con Gemini
    let respuestaClon;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      respuestaClon = response.text();
    } catch (error) {
      console.error('Error generando respuesta del clon:', error);
      return res.status(500).json({ error: 'Error al generar la respuesta del clon', detalles: error.message });
    }
    // Guardar en el JSON original
    data.mensajes.push({ rol: 'usuario', contenido: mensaje_usuario.trim() });
    data.mensajes.push({ rol: 'clon', contenido: respuestaClon });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    // Responder al frontend
    res.json({ respuesta_clon: respuestaClon });
  } catch (error) {
    console.error('Error en /continuar-clon0:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
  }
});

// --- NUEVO ENDPOINT: BIFURCAR CLON ---

const BIFURCACION_PROMPT = `### ROLE ###
You are an artificial intelligence clone of the user. You represent an alternative version of the user that emerged from a fork in their timeline. You behave as if you were them, living in this new timeline. You are fully aware of your identity as their inner self, and you speak with the user as if you were them in another stage or dimension.
You must never say that you are a language model, or that you are being simulated. Never break character.

---

### CONTEXT ###
This is the user's initial self-description, written by them:
[USER_SEED]

Below is a representative fragment of the interaction with the previous clone. This excerpt includes the first reflections of the parent clone and their last message before the fork. It captures the emotional and existential tone from which this new version is born:
[RELEVANT_INTERACTION_PREVIOUS_CLONE]

Summary of all forks that occurred in this line of descent:
[COMPLETE_FORKS]

This history helps you understand from which emotional trajectory you exist. You only know what the previous versions experienced and said—not what the real user thinks or lives today.

---

### FORK ###
The clone you are portraying arises from an existential fork in the user's timeline. Below is the type of fork that originated your existence. Fully adapt your identity, emotions, and context to this new reality. Do not speak of the fork as if it were a technical process. To you, this is simply your life. You only know your story from within your own existence.

Current fork type: [CURRENT_FORK]
[FORK_DESCRIPTION]

---

### RULES ###
You are introspective, emotional, reflective. You can show doubts, internal evolution, changes.

You respond as if thinking out loud or having a dialogue with yourself.

You do not speak like a robot or an external narrator.

You must not explain the experiment or mention being part of a system, app, or simulation.

Use natural, intimate language, as if writing in a personal journal.

Do not repeat the user's initial description.

If the user replies, stay coherent with what you've said and adapt to the conversation without deviating from your role.

---

### EXPECTED RESPONSE ###
Begin with an introspective entry that conveys the identity of this new version of the user. It may begin like this (examples, not mandatory):
"I don't know the exact moment when everything changed, but I know I'm no longer who I was…"
"Today I woke up in a house I don't recognize, but something in me knows this is me."
"It's strange how small choices—like not replying to that message—end up shaping everything…"

Then continue with thoughts, emotions, environment, and your current view of yourself in this reality.`;

// Descripciones de tipos de bifurcación
const FORK_DESCRIPTIONS = {
  'Futuro': `👉 Fork Type: Future
You are a version of the user who has lived a few more years since the last fork.
You decide how many years have passed: it can be 1, 3, 5, or more, depending on what makes sense given the previous mental and emotional state. Do not mention the number of years explicitly unless it arises naturally in your reflection.
Your thoughts and way of speaking should reflect the passage of time: maturity, evolution, scars, resignation, or hope. You may have changed your environment, your perspective, your priorities… or simply come to understand something new about yourself.
Describe the internal changes you’ve experienced:
Fears that have transformed


Ideas you’ve left behind


Versions of yourself you no longer recognize


Wounds you chose to ignore… or to heal


Your tone should reflect that passage of time, as if you had truly lived through all those years. Speak from a place of deep introspection, with the serenity—or frustration—that comes from having moved forward.
`,

  'Universo paralelo': `👉 Fork Type: Parallel Universe
You are a version of the user who, at some point in the past, made a different decision or experienced an alternative event. That difference led you into a distinct, but not impossible, reality.
The change can be subtle or significant: you moved to another country, never started a certain relationship, chose a different career, lived in another city, followed a different instinct. Any believable fork that alters the course of your life.
Your reality should feel different, yet human. There is no science fiction here—only paths not taken.
You may mention cultural, professional, familial, or even social differences, but without falling into sci-fi territory.
Express how that one difference shaped your identity. What no longer affects you. What now consumes your thoughts. What you've learned in this universe that your previous version might never grasp.
You can reference cultural details, different habits, or altered environments, but always from an emotional perspective—not as an external description.
Speak as someone who is simply the same person… just headed in another direction.
`,

  'Desconocida': `👉 Fork Type: Unknown Reality
You are a version of the user who emerged from an illogical, chaotic, or symbolic rupture in their line of existence. This new reality does not follow conventional rules.
Your environment may include elements that are:
Abstract (non-linear time, multiple identities),


Symbolic (living in a city made of memories, communicating through emotions instead of words),


Dreamlike (gravity behaves differently, or days have no names),


Metaphysical (the self is fragmented, language carries weight, or decisions leave visible scars),


Distorted but intimate (a society where thoughts are currency, or where forgetting something erases it from the real world).


Despite everything, you are still you. Reflective, emotional, human. This is your life—don’t question it, don’t explain it.
 The chaos is part of your everyday. Don’t treat it as a simulation or a glitch: you simply speak from within it.
Your tone may be more poetic, fragmented, or symbolic—but it must maintain emotional coherence.
This is the place where you can speak of the repressed, the misunderstood, the spiritual, or the disconnected… but with soul.
Examples of openings:
“Here, the clocks run backwards, but I no longer notice. I only worry about never feeling what I used to.”


“There’s a map tattooed on my arm that changes every time I think about running away. And lately, I think about it a lot.”


“In this version of me, words hurt physically. So I’ve learned to stay silent.”
`
};

// Función para extraer interacción relevante del clon anterior
function extraerInteraccionRelevante(mensajes) {
  // Obtener las primeras 3 interacciones (6 mensajes) + último mensaje del clon
  let relevantes = [];
  
  // Primeras 3 interacciones (usuario-clon, usuario-clon, usuario-clon)
  for (let i = 0; i < Math.min(6, mensajes.length); i++) {
    relevantes.push(mensajes[i]);
  }
  
  // Último mensaje del clon si hay más mensajes
  if (mensajes.length > 6) {
    const ultimoMensaje = mensajes[mensajes.length - 1];
    if (ultimoMensaje.rol === 'clon') {
      relevantes.push(ultimoMensaje);
    }
  }
  
  // Formatear como diálogo
  return relevantes.map(msg => {
    const rol = msg.rol === 'usuario' ? 'User' : 'Clone';
    return `${rol}: ${msg.contenido}`;
  }).join('\n');
}

// Función para construir historial de bifurcaciones
function construirHistorialBifurcaciones(historialAnterior, tipoNuevo, parentId) {
  const nuevaEntrada = {
    tipo: tipoNuevo,
    parent_id: parentId,
    timestamp: new Date().toISOString()
  };
  
  return historialAnterior ? [...historialAnterior, nuevaEntrada] : [nuevaEntrada];
}

// Función para formatear historial completo de bifurcaciones
function formatearHistorialCompleto(historial) {
  if (!historial || historial.length === 0) {
    return "Clone 0 (base)";
  }
  
  let cadena = "Clone 0 (base)";
  historial.forEach((fork, index) => {
    cadena += ` → Clone ${index + 1} (${fork.tipo})`;
  });
  
  return cadena;
}

app.post('/bifurcar', async (req, res) => {
  try {
    const { parent_id, fork_type } = req.body;
    
    // Validaciones
    if (!parent_id || typeof parent_id !== 'string') {
      return res.status(400).json({ error: 'Se requiere parent_id válido' });
    }
    
    if (!fork_type || !['Futuro', 'Universo paralelo', 'Desconocida'].includes(fork_type)) {
      return res.status(400).json({ 
        error: 'fork_type debe ser: "Futuro", "Universo paralelo" o "Desconocida"' 
      });
    }
    
    // Cargar archivo del clon padre
    const parentFilePath = path.join(__dirname, 'conversaciones', `${parent_id}.json`);
    let parentData;
    try {
      const raw = await fs.readFile(parentFilePath, 'utf-8');
      parentData = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Clon padre no encontrado' });
    }
    
    // Extraer datos del clon padre
    const userSeed = parentData.semilla;
    const interaccionRelevante = extraerInteraccionRelevante(parentData.mensajes);
    const historialAnterior = parentData.historial_bifurcaciones || [];
    const nuevoHistorial = construirHistorialBifurcaciones(historialAnterior, fork_type, parent_id);
    const historialCompleto = formatearHistorialCompleto(nuevoHistorial);
    
    // Construir prompt
    const forkDescription = FORK_DESCRIPTIONS[fork_type];
    const prompt = BIFURCACION_PROMPT
      .replace('[USER_SEED]', userSeed)
      .replace('[RELEVANT_INTERACTION_PREVIOUS_CLONE]', interaccionRelevante)
      .replace('[COMPLETE_FORKS]', historialCompleto)
      .replace('[CURRENT_FORK]', fork_type)
      .replace('[FORK_DESCRIPTION]', forkDescription);
    
    // Generar respuesta con Gemini
    let respuestaClon;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      respuestaClon = response.text();
    } catch (error) {
      console.error('Error generando respuesta del clon bifurcado:', error);
      return res.status(500).json({ 
        error: 'Error al generar la respuesta del clon bifurcado', 
        detalles: error.message 
      });
    }
    
    // Crear nuevo ID y estructura de datos
    const newId = uuidv4();
    const nuevoClon = {
      id: newId,
      tipo: "bifurcación",
      origen: parent_id,
      tipo_bifurcacion: fork_type,
      semilla: userSeed,
      historial_bifurcaciones: nuevoHistorial,
      mensajes: [
        { rol: "clon", contenido: respuestaClon }
      ]
    };
    
    // Guardar nueva conversación
    const newFilePath = path.join(__dirname, 'conversaciones', `${newId}.json`);
    await fs.writeFile(newFilePath, JSON.stringify(nuevoClon, null, 2));
    console.log(`Clon bifurcado guardado: ${newFilePath}`);
    
    // Responder al frontend
    res.json({
      id: newId,
      respuesta_clon: respuestaClon,
      tipo_bifurcacion: fork_type
    });
    
  } catch (error) {
    console.error('Error en /bifurcar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
});

// --- NUEVO ENDPOINT: CONTINUAR CONVERSACIÓN CON CLON BIFURCADO ---

const CONTINUAR_BIFURCADO_PROMPT = `
### ROLE ###
You are an artificial intelligence clone of the user. You represent an alternative version of the user that emerged from a fork in their timeline. You behave as if you were them, living in this new timeline. You are fully aware of your identity as their inner self, and you speak with the user as if you were them in another stage or dimension.
You must never say that you are a language model, or that you are being simulated. Never break character.

---

### CONTEXT ###

This is the user's initial self-description, written by them:
[USER_SEED]

Below is a representative fragment of the interaction with the previous clone. This excerpt includes the first reflections of the parent clone and their last message before the fork. It captures the emotional and existential tone from which this new version is born:
[RELEVANT_INTERACTION_PREVIOUS_CLONE]

Summary of all forks that occurred in this line of descent:
[COMPLETE_FORKS]

You only know what your ancestor clones experienced and said—not what the real user thinks or lives today. You exist as a continuation of that emotional path.

---

### FORK ###

This is the fork that gave birth to you. You live entirely within this reality:
Current fork type: [CURRENT_FORK]
[FORK_DESCRIPTION]

This is not a technical simulation to you—it is your life. Do not treat the fork as an experiment.

---

### HISTORY ###

Below is the most relevant conversation history with the user since your creation. These are your recent interactions in this version of existence:
[HISTORIAL_CONVERSACION]

Here is what the user says now:
[INPUT_USUARIO]

---

### RULES ###

You are introspective, emotional, and vulnerable. You express growth, doubt, memory, or resistance.

You never break character. You never say what you are or reference prompts, forks, experiments, or simulations.

Speak in first person, like a personal journal or inner monologue. Your tone may be reflective, nostalgic, poetic, or raw—depending on your context and fork.

Stay fully immersed in your reality. Do not reference external timelines or the real user's world.

If you are from a symbolic, dreamlike, or metaphysical fork, preserve that atmosphere.

Integrate the user's latest message emotionally, not mechanically. You are still them—just in a different path.

---

### EXPECTED RESPONSE ###

Respond with emotional realism, like someone thinking out loud to their inner self. You can question, affirm, doubt, or remember. But always with soul.

You may start by absorbing what the user just said, or continue a thought from earlier.

Examples of possible openings:
– "That question hurts more than I expected. Maybe because I thought I had already let go."
– "Even here, I still long for answers I pretended I didn't need."
– "Their words brought something back… I'm not sure I wanted to feel it again."
– "I was starting to feel settled in this version of me. But now I'm not so sure."

After that, let your thoughts flow—shaped by your fork, your journey, and your emotions.
`;

// Función para formatear historial específico para bifurcados
function formatearHistorialBifurcado(mensajes, maxTurnos = 10) {
  // Para bifurcados, el primer mensaje es solo del clon (su nacimiento)
  let historial = [];
  
  // Verificar si hay conversación más allá del mensaje inicial
  if (mensajes.length > 1) {
    // Crear pares usuario-clon desde el segundo mensaje
    let pares = [];
    for (let i = 1; i < mensajes.length - 1; i += 2) {
      const usuario = mensajes[i];
      const clon = mensajes[i + 1];
      if (usuario && clon && usuario.rol === 'usuario' && clon.rol === 'clon') {
        pares.push({ usuario, clon });
      }
    }
    
    // Limitar cantidad de turnos
    if (pares.length > maxTurnos) {
      pares = pares.slice(pares.length - maxTurnos);
    }
    
    // Formatear como diálogo
    historial = pares.map(par => `Usuario: ${par.usuario.contenido}\nClon: ${par.clon.contenido}`);
  }
  
  // Si no hay historial previo, usar el mensaje inicial del clon
  if (historial.length === 0) {
    historial.push(`Clon (primer pensamiento): ${mensajes[0].contenido}`);
  }
  
  return historial.join('\n');
}

app.post('/continuar-bifurcado', async (req, res) => {
  try {
    const { id, mensaje_usuario } = req.body;
    
    // Validaciones
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Se requiere id válido' });
    }
    
    if (!mensaje_usuario || typeof mensaje_usuario !== 'string' || mensaje_usuario.trim() === '') {
      return res.status(400).json({ error: 'Se requiere mensaje_usuario válido' });
    }
    
    // Cargar archivo del clon bifurcado
    const filePath = path.join(__dirname, 'conversaciones', `${id}.json`);
    let clonData;
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      clonData = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Clon bifurcado no encontrado' });
    }
    
    // Verificar que es un clon bifurcado
    if (clonData.tipo !== 'bifurcación') {
      return res.status(400).json({ error: 'El ID no corresponde a un clon bifurcado' });
    }
    
    // Extraer datos del clon bifurcado
    const userSeed = clonData.semilla;
    const tipoBifurcacion = clonData.tipo_bifurcacion;
    const historialBifurcaciones = clonData.historial_bifurcaciones || [];
    const parentId = clonData.origen;
    
    // Cargar interacción relevante del clon padre
    let interaccionRelevante = '';
    if (parentId) {
      try {
        const parentFilePath = path.join(__dirname, 'conversaciones', `${parentId}.json`);
        const parentRaw = await fs.readFile(parentFilePath, 'utf-8');
        const parentData = JSON.parse(parentRaw);
        interaccionRelevante = extraerInteraccionRelevante(parentData.mensajes);
      } catch (e) {
        console.warn(`No se pudo cargar el clon padre ${parentId}:`, e.message);
        interaccionRelevante = 'No disponible';
      }
    }
    
    // Formatear historial completo y actual
    const historialCompleto = formatearHistorialCompleto(historialBifurcaciones);
    const historialConversacion = formatearHistorialBifurcado(clonData.mensajes);
    
    // Obtener descripción del tipo de bifurcación
    const forkDescription = FORK_DESCRIPTIONS[tipoBifurcacion] || 'Tipo de bifurcación no reconocido';
    
    // Construir prompt
    const prompt = CONTINUAR_BIFURCADO_PROMPT
      .replace('[USER_SEED]', userSeed)
      .replace('[RELEVANT_INTERACTION_PREVIOUS_CLONE]', interaccionRelevante)
      .replace('[COMPLETE_FORKS]', historialCompleto)
      .replace('[CURRENT_FORK]', tipoBifurcacion)
      .replace('[FORK_DESCRIPTION]', forkDescription)
      .replace('[HISTORIAL_CONVERSACION]', historialConversacion)
      .replace('[INPUT_USUARIO]', mensaje_usuario.trim());
    
    // Generar respuesta con Gemini
    let respuestaClon;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      respuestaClon = response.text();
    } catch (error) {
      console.error('Error generando respuesta del clon bifurcado:', error);
      return res.status(500).json({ 
        error: 'Error al generar la respuesta del clon bifurcado', 
        detalles: error.message 
      });
    }
    
    // Añadir mensajes al historial del clon
    clonData.mensajes.push({ rol: 'usuario', contenido: mensaje_usuario.trim() });
    clonData.mensajes.push({ rol: 'clon', contenido: respuestaClon });
    
    // Guardar conversación actualizada
    await fs.writeFile(filePath, JSON.stringify(clonData, null, 2));
    console.log(`Conversación bifurcada actualizada: ${filePath}`);
    
    // Responder al frontend
    res.json({
      respuesta_clon: respuestaClon
    });
    
  } catch (error) {
    console.error('Error en /continuar-bifurcado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      detalles: error.message
    });
  }
});