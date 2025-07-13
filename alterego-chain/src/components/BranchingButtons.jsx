const BranchingButtons = ({ onCreateTimelineClone, currentCloneId, clones, setCurrentCloneId }) => {
  const currentClone = clones.find(c => c.id === currentCloneId)
  
  const handleTimelineBranch = (timeline) => {
    onCreateTimelineClone(timeline, currentCloneId)
  }

  const switchToClone = (cloneId) => {
    setCurrentCloneId(cloneId)
  }

  return (
    <div className="branching-container">
      <div className="timeline-buttons">
        <button 
          onClick={() => handleTimelineBranch('future')}
          className="timeline-btn future-btn"
        >
          🔮 Explore My Future
        </button>
        
        <button 
          onClick={() => handleTimelineBranch('parallel')}
          className="timeline-btn parallel-btn"
        >
          🌌 Travel to a Parallel Universe
        </button>
        
        <button 
          onClick={() => handleTimelineBranch('past')}
          className="timeline-btn past-btn"
        >
          ⏳ Talk to My Past Self
        </button>
      </div>

      {clones.length > 1 && (
        <div className="clone-switcher">
          <h4>Your AlterEgos</h4>
          <div className="clone-tabs">
            {clones.map((clone) => (
              <button
                key={clone.id}
                onClick={() => switchToClone(clone.id)}
                className={`clone-tab ${clone.id === currentCloneId ? 'active' : ''}`}
              >
                {clone.timeline === 'present' ? 'Present' : 
                 clone.timeline === 'future' ? 'Future' :
                 clone.timeline === 'parallel' ? 'Parallel' : 'Past'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchingButtons