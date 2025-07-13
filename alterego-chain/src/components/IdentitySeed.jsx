import { useState } from 'react'

const IdentitySeed = ({ onCreateClone, seedText, setSeedText }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (seedText.trim().length < 10) {
      alert('Please write at least 10 characters to create your clone.')
      return
    }
    
    setIsSubmitting(true)
    // Simulate processing time
    setTimeout(() => {
      onCreateClone(seedText.trim())
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="identity-seed">
      <div className="seed-container">
        <h2>Create Your AlterEgo</h2>
        <p className="seed-description">
          Describe who you are at this moment. You can include your goals, emotions, or doubts...
        </p>
        
        <form onSubmit={handleSubmit} className="seed-form">
          <textarea
            value={seedText}
            onChange={(e) => setSeedText(e.target.value)}
            placeholder="I am someone who... (2-4 sentences about yourself)"
            className="seed-input"
            rows={4}
            maxLength={500}
          />
          
          <div className="seed-footer">
            <span className="character-count">
              {seedText.length}/500
            </span>
            <button 
              type="submit" 
              className="create-clone-btn"
              disabled={isSubmitting || seedText.trim().length < 10}
            >
              {isSubmitting ? 'Creating Clone...' : 'Create Clone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IdentitySeed