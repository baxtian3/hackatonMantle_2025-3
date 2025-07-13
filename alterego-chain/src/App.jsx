import { useState } from 'react'
import './App.css'
import IdentitySeed from './components/IdentitySeed'
import ChatWindow from './components/ChatWindow'
import BranchingButtons from './components/BranchingButtons'

function App() {
  const [clones, setClones] = useState([])
  const [currentCloneId, setCurrentCloneId] = useState(null)
  const [seedText, setSeedText] = useState('')

  const createClone = (seed) => {
    const newClone = {
      id: Date.now(),
      seed: seed,
      messages: [
        {
          id: 1,
          sender: 'clone',
          text: generateInitialMessage(seed),
          timestamp: new Date()
        }
      ],
      timeline: 'present'
    }
    
    setClones(prev => [...prev, newClone])
    setCurrentCloneId(newClone.id)
    setSeedText('')
  }

  const generateInitialMessage = (seed) => {
    const responses = [
      `I see myself through your words: "${seed}". It's fascinating to meet this version of me. What would you like to explore together?`,
      `Reading your description of who you are... I feel a deep connection to this moment. "${seed}". What's on your mind?`,
      `Your words paint a picture of someone I recognize deeply. "${seed}". Shall we dive into what lies beneath the surface?`,
      `I resonate with every word you've written. "${seed}". What aspect of yourself would you like to explore further?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const addMessage = (cloneId, message, sender) => {
    setClones(prev => prev.map(clone => {
      if (clone.id === cloneId) {
        return {
          ...clone,
          messages: [...clone.messages, {
            id: clone.messages.length + 1,
            sender: sender,
            text: message,
            timestamp: new Date()
          }]
        }
      }
      return clone
    }))
  }

  const createTimelineClone = (timeline, baseCloneId) => {
    const baseClone = clones.find(c => c.id === baseCloneId)
    if (!baseClone) return

    const timelineMessages = {
      'future': [
        "I am you, but from a future where your dreams have unfolded. I've seen the paths you could take, the choices that shape destinies. What future do you want to create?",
        "Looking back from where I stand, I can see the moments that changed everything. Your present decisions ripple through time. What would you like to know about your future self?",
        "I've lived through the consequences of your choices. Some paths led to joy, others to lessons learned. What aspect of your future would you like to explore?"
      ],
      'parallel': [
        "I am you, but from a universe where different choices were made. Here, I've walked paths you didn't take. What if we explored what could have been?",
        "In my reality, things unfolded differently. I've experienced the outcomes of alternative decisions. What parallel version of yourself interests you most?",
        "I represent a you that exists in another dimension of possibility. Our lives diverged at key moments. What would you like to know about this other version of you?"
      ],
      'past': [
        "I am your younger self, looking back at who you were becoming. I remember the hopes and fears that shaped you. What would you tell your past self?",
        "From this vantage point, I can see the innocence and uncertainty of youth. I remember the dreams that seemed impossible then. What wisdom would you share?",
        "I am the you that existed before life's lessons took their toll. I remember the raw emotions and pure intentions. What would you like to ask your past self?"
      ]
    }

    const newClone = {
      id: Date.now(),
      seed: baseClone.seed,
      messages: [
        {
          id: 1,
          sender: 'clone',
          text: timelineMessages[timeline][Math.floor(Math.random() * timelineMessages[timeline].length)],
          timestamp: new Date()
        }
      ],
      timeline: timeline
    }
    
    setClones(prev => [...prev, newClone])
    setCurrentCloneId(newClone.id)
  }

  const currentClone = clones.find(c => c.id === currentCloneId)

  return (
    <div className="app">
      <header className="app-header">
        <h1>AlterEgo Chain</h1>
        <p>Explore the depths of your identity through AI-generated reflections</p>
      </header>

      <main className="app-main">
        {clones.length === 0 ? (
          <IdentitySeed onCreateClone={createClone} seedText={seedText} setSeedText={setSeedText} />
        ) : (
          <div className="conversation-container">
            <ChatWindow 
              clone={currentClone}
              onSendMessage={(message) => addMessage(currentCloneId, message, 'user')}
            />
            <BranchingButtons 
              onCreateTimelineClone={createTimelineClone}
              currentCloneId={currentCloneId}
              clones={clones}
              setCurrentCloneId={setCurrentCloneId}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
