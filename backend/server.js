require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://alterego-pi.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Function to load prompts from files
async function loadPrompts() {
  try {
    const scriptsDir = path.join(__dirname, 'prompts');
    
    const [
      systemPrompt,
      continuePrompt,
      forkPrompt,
      continueForkPrompt
    ] = await Promise.all([
      fs.readFile(path.join(scriptsDir, 'SYSTEM_PROMPT.TXT'), 'utf-8'),
      fs.readFile(path.join(scriptsDir, 'CONTINUE_PROMPT.TXT'), 'utf-8'),
      fs.readFile(path.join(scriptsDir, 'FORK_PROMPT.TXT'), 'utf-8'),
      fs.readFile(path.join(scriptsDir, 'CONTINUE_FORK_PROMPT.TXT'), 'utf-8')
    ]);

    const forkDescriptions = require(path.join(__dirname, 'prompts', 'FORK_DESCRIPTIONS.js'));

    return {
      SYSTEM_PROMPT: systemPrompt,
      CONTINUE_PROMPT: continuePrompt,
      FORK_PROMPT: forkPrompt,
      CONTINUE_FORK_PROMPT: continueForkPrompt,
      FORK_DESCRIPTIONS: forkDescriptions
    };
  } catch (error) {
    console.error('Error loading prompts:', error);
    throw new Error('Could not load prompt files');
  }
}

// Global variable to store prompts
let PROMPTS = null;

// Initialize prompts when server starts
async function initializePrompts() {
  try {
    PROMPTS = await loadPrompts();
    console.log('✅ Prompts loaded successfully');
  } catch (error) {
    console.error('❌ Error loading prompts:', error);
    process.exit(1);
  }
}

// Function to generate clone response
async function generateCloneResponse(userSeed) {
  try {
    const prompt = PROMPTS.SYSTEM_PROMPT.replace('[USER_SEED]', userSeed);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating clone response:', error);
    throw new Error('Error generating clone response');
  }
}

// Function to save conversation
async function saveConversation(id, userSeed, cloneResponse) {
  try {
    const conversation = {
      id: id,
      type: "clone_0",
      seed: userSeed,
      messages: [
        { role: "user", content: userSeed },
        { role: "clone", content: cloneResponse }
      ]
    };

    const conversationsDir = path.join(__dirname, 'conversations');
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(conversationsDir, { recursive: true });
    } catch (e) {
      // Directory already exists, continue
    }
    
    const filePath = path.join(conversationsDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(conversation, null, 2));
    console.log(`Conversation saved: ${filePath}`);
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw new Error('Error saving conversation');
  }
}

// Route to create clone 0
app.post('/create-clone0', async (req, res) => {
  try {
    const { user_seed } = req.body;

    // Validate that seed was provided
    if (!user_seed || typeof user_seed !== 'string' || user_seed.trim() === '') {
      return res.status(400).json({
        error: 'User seed is required and must be valid text'
      });
    }

    // Generate unique UUID
    const id = uuidv4();

    // Generate clone response
    const cloneResponse = await generateCloneResponse(user_seed.trim());

    // Save conversation
    await saveConversation(id, user_seed.trim(), cloneResponse);

    // Return response to frontend
    res.json({
      id: id,
      clone_response: cloneResponse
    });

  } catch (error) {
    console.error('Error in /create-clone0:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Utility to format history
function formatHistory(messages, maxTurns = 12) {
  // One turn = user+clone
  let pairs = [];
  for (let i = 0; i < messages.length - 1; i += 2) {
    const user = messages[i];
    const clone = messages[i + 1];
    if (user && clone && user.role === 'user' && clone.role === 'clone') {
      pairs.push({ user, clone });
    }
  }
  // Limit number of turns (trim from beginning)
  if (pairs.length > maxTurns) {
    pairs = pairs.slice(pairs.length - maxTurns);
  }
  // Always keep at least the last 2 exchanges
  if (pairs.length < 2 && messages.length >= 4) {
    pairs = pairs.slice(-2);
  }
  // Format as dialogue
  return pairs.map(pair => `User: ${pair.user.content}\nClone: ${pair.clone.content}`).join('\n');
}

// Endpoint to continue conversation with clone 0
app.post('/continue-clone0', async (req, res) => {
  try {
    const { id, user_message } = req.body;
    if (!id || typeof id !== 'string' || !user_message || typeof user_message !== 'string' || user_message.trim() === '') {
      return res.status(400).json({ error: 'Valid id and user_message are required' });
    }
    
    const filePath = path.join(__dirname, 'conversations', `${id}.json`);
    
    // Read existing conversation
    let data;
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Add user message to temporary history
    const messages = [...data.messages, { role: 'user', content: user_message.trim() }];
    
    // Format history
    const history = formatHistory(messages.slice(0, -1)); // without the last user_message
    
    // Build prompt
    const prompt = PROMPTS.CONTINUE_PROMPT
      .replace('[USER_SEED]', data.seed)
      .replace('[CONVERSATION_HISTORY]', history)
      .replace('[USER_INPUT]', user_message.trim());
    
    // Generate response with Gemini
    let cloneResponse;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      cloneResponse = response.text();
    } catch (error) {
      console.error('Error generating clone response:', error);
      return res.status(500).json({ error: 'Error generating clone response', details: error.message });
    }
    
    // Save to original JSON
    data.messages.push({ role: 'user', content: user_message.trim() });
    data.messages.push({ role: 'clone', content: cloneResponse });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    // Respond to frontend
    res.json({ clone_response: cloneResponse });
  } catch (error) {
    console.error('Error in /continue-clone0:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Function to extract relevant interaction from previous clone
function extractRelevantInteraction(messages) {
  // Get first 3 interactions (6 messages) + last clone message
  let relevant = [];
  
  // First 3 interactions (user-clone, user-clone, user-clone)
  for (let i = 0; i < Math.min(6, messages.length); i++) {
    relevant.push(messages[i]);
  }
  
  // Last clone message if there are more messages
  if (messages.length > 6) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'clone') {
      relevant.push(lastMessage);
    }
  }
  
  // Format as dialogue
  return relevant.map(msg => {
    const role = msg.role === 'user' ? 'User' : 'Clone';
    return `${role}: ${msg.content}`;
  }).join('\n');
}

// Function to build fork history
function buildForkHistory(previousHistory, newType, parentId) {
  const newEntry = {
    type: newType,
    parent_id: parentId,
    timestamp: new Date().toISOString()
  };
  
  return previousHistory ? [...previousHistory, newEntry] : [newEntry];
}

// Function to format complete fork history
function formatCompleteHistory(history) {
  if (!history || history.length === 0) {
    return "Clone 0 (base)";
  }
  
  let chain = "Clone 0 (base)";
  history.forEach((fork, index) => {
    chain += ` → Clone ${index + 1} (${fork.type})`;
  });
  
  return chain;
}

// Endpoint to fork clone
app.post('/fork', async (req, res) => {
  try {
    const { parent_id, fork_type } = req.body;
    
    // Validations
    if (!parent_id || typeof parent_id !== 'string') {
      return res.status(400).json({ error: 'Valid parent_id is required' });
    }
    
    if (!fork_type || !['Future', 'Parallel universe', 'Unknown'].includes(fork_type)) {
      return res.status(400).json({ 
        error: 'fork_type must be: "Future", "Parallel universe" or "Unknown"' 
      });
    }
    
    // Load parent clone file
    const parentFilePath = path.join(__dirname, 'conversations', `${parent_id}.json`);
    let parentData;
    try {
      const raw = await fs.readFile(parentFilePath, 'utf-8');
      parentData = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Parent clone not found' });
    }
    
    // Extract data from parent clone
    const userSeed = parentData.seed;
    const relevantInteraction = extractRelevantInteraction(parentData.messages);
    const previousHistory = parentData.fork_history || [];
    const newHistory = buildForkHistory(previousHistory, fork_type, parent_id);
    const completeHistory = formatCompleteHistory(newHistory);
    
    // Build prompt
    const forkDescription = PROMPTS.FORK_DESCRIPTIONS[fork_type];
    const prompt = PROMPTS.FORK_PROMPT
      .replace('[USER_SEED]', userSeed)
      .replace('[RELEVANT_INTERACTION_PREVIOUS_CLONE]', relevantInteraction)
      .replace('[COMPLETE_FORKS]', completeHistory)
      .replace('[CURRENT_FORK]', fork_type)
      .replace('[FORK_DESCRIPTION]', forkDescription);
    
    // Generate response with Gemini
    let cloneResponse;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      cloneResponse = response.text();
    } catch (error) {
      console.error('Error generating forked clone response:', error);
      return res.status(500).json({ 
        error: 'Error generating forked clone response', 
        details: error.message 
      });
    }
    
    // Create new ID and data structure
    const newId = uuidv4();
    const newClone = {
      id: newId,
      type: "fork",
      origin: parent_id,
      fork_type: fork_type,
      seed: userSeed,
      fork_history: newHistory,
      messages: [
        { role: "clone", content: cloneResponse }
      ]
    };
    
    // Save new conversation
    const newFilePath = path.join(__dirname, 'conversations', `${newId}.json`);
    await fs.writeFile(newFilePath, JSON.stringify(newClone, null, 2));
    console.log(`Forked clone saved: ${newFilePath}`);
    
    // Respond to frontend
    res.json({
      id: newId,
      clone_response: cloneResponse,
      fork_type: fork_type
    });
    
  } catch (error) {
    console.error('Error in /fork:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Function to format history specific to forked clones
function formatForkHistory(messages, maxTurns = 10) {
  // For forked clones, the first message is only from the clone (its birth)
  let history = [];
  
  // Check if there's conversation beyond the initial message
  if (messages.length > 1) {
    // Create user-clone pairs from the second message
    let pairs = [];
    for (let i = 1; i < messages.length - 1; i += 2) {
      const user = messages[i];
      const clone = messages[i + 1];
      if (user && clone && user.role === 'user' && clone.role === 'clone') {
        pairs.push({ user, clone });
      }
    }
    
    // Limit number of turns
    if (pairs.length > maxTurns) {
      pairs = pairs.slice(pairs.length - maxTurns);
    }
    
    // Format as dialogue
    history = pairs.map(pair => `User: ${pair.user.content}\nClone: ${pair.clone.content}`);
  }
  
  // If no previous history, use the initial clone message
  if (history.length === 0) {
    history.push(`Clone (first thought): ${messages[0].content}`);
  }
  
  return history.join('\n');
}

// Endpoint to continue conversation with forked clone
app.post('/continue-fork', async (req, res) => {
  try {
    const { id, user_message } = req.body;
    
    // Validations
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Valid id is required' });
    }
    
    if (!user_message || typeof user_message !== 'string' || user_message.trim() === '') {
      return res.status(400).json({ error: 'Valid user_message is required' });
    }
    
    // Load forked clone file
    const filePath = path.join(__dirname, 'conversations', `${id}.json`);
    let cloneData;
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      cloneData = JSON.parse(raw);
    } catch (e) {
      return res.status(404).json({ error: 'Forked clone not found' });
    }
    
    // Verify it's a forked clone
    if (cloneData.type !== 'fork') {
      return res.status(400).json({ error: 'ID does not correspond to a forked clone' });
    }
    
    // Extract data from forked clone
    const userSeed = cloneData.seed;
    const forkType = cloneData.fork_type;
    const forkHistory = cloneData.fork_history || [];
    const parentId = cloneData.origin;
    
    // Load relevant interaction from parent clone
    let relevantInteraction = '';
    if (parentId) {
      try {
        const parentFilePath = path.join(__dirname, 'conversations', `${parentId}.json`);
        const parentRaw = await fs.readFile(parentFilePath, 'utf-8');
        const parentData = JSON.parse(parentRaw);
        relevantInteraction = extractRelevantInteraction(parentData.messages);
      } catch (e) {
        console.warn(`Could not load parent clone ${parentId}:`, e.message);
        relevantInteraction = 'Not available';
      }
    }
    
    // Format complete and current history
    const completeHistory = formatCompleteHistory(forkHistory);
    const conversationHistory = formatForkHistory(cloneData.messages);
    
    // Get fork type description
    const forkDescription = PROMPTS.FORK_DESCRIPTIONS[forkType] || 'Fork type not recognized';
    
    // Build prompt
    const prompt = PROMPTS.CONTINUE_FORK_PROMPT
      .replace('[USER_SEED]', userSeed)
      .replace('[RELEVANT_INTERACTION_PREVIOUS_CLONE]', relevantInteraction)
      .replace('[COMPLETE_FORKS]', completeHistory)
      .replace('[CURRENT_FORK]', forkType)
      .replace('[FORK_DESCRIPTION]', forkDescription)
      .replace('[CONVERSATION_HISTORY]', conversationHistory)
      .replace('[USER_INPUT]', user_message.trim());
    
    // Generate response with Gemini
    let cloneResponse;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      cloneResponse = response.text();
    } catch (error) {
      console.error('Error generating forked clone response:', error);
      return res.status(500).json({ 
        error: 'Error generating forked clone response', 
        details: error.message 
      });
    }
    
    // Add messages to clone history
    cloneData.messages.push({ role: 'user', content: user_message.trim() });
    cloneData.messages.push({ role: 'clone', content: cloneResponse });
    
    // Save updated conversation
    await fs.writeFile(filePath, JSON.stringify(cloneData, null, 2));
    console.log(`Forked conversation updated: ${filePath}`);
    
    // Respond to frontend
    res.json({
      clone_response: cloneResponse
    });
    
  } catch (error) {
    console.error('Error in /continue-fork:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'AlterEgo Chain Backend - API working correctly',
    version: '1.0.0',
    prompts_loaded: PROMPTS ? 'Yes' : 'No',
    available_routes: [
      'POST /create-clone0 - Create clone 0 with user seed',
      'POST /continue-clone0 - Continue conversation with clone 0',
      'POST /fork - Create fork (Future, Parallel universe, Unknown)',
      'POST /continue-fork - Continue conversation with forked clone'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

// Initialize server
async function startServer() {
  try {
    // Load prompts first
    await initializePrompts();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 AlterEgo Chain server running on port ${PORT}`);
      console.log(`📝 API available at: http://localhost:${PORT}`);
      console.log(`🔗 Main endpoint: http://localhost:${PORT}/create-clone0`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();