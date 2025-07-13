import { useState, useRef, useEffect } from 'react'

const ChatWindow = ({ clone, onSendMessage }) => {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [clone?.messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const getTimelineLabel = (timeline) => {
    switch (timeline) {
      case 'future': return 'Future You'
      case 'parallel': return 'Parallel You'
      case 'unknown': return 'Unknown You'
      default: return 'AlterEgo'
    }
  }

  if (!clone) return null

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="clone-info">
          <span className="clone-label">{getTimelineLabel(clone.timeline)}</span>
          <span className="timeline-indicator">{clone.timeline}</span>
        </div>
      </div>

      <div className="messages-container">
        {clone.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'user' ? 'user-message' : 'clone-message'}`}
          >
            <div className="message-content">
              <div className="message-sender">
                {msg.sender === 'user' ? 'You' : getTimelineLabel(clone.timeline)}
              </div>
              <div className="message-text">{msg.text}</div>
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatWindow