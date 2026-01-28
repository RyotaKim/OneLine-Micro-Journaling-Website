import { useJournal } from '../context/JournalContext'
import './OnThisDay.css'

export default function OnThisDay({ expanded = false }) {
  const { getOnThisDayEntries, entries } = useJournal()
  const onThisDayEntries = getOnThisDayEntries()
  
  // Also get entries from one month ago
  const getOneMonthAgoEntries = () => {
    const today = new Date()
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getDate() === oneMonthAgo.getDate() &&
             entryDate.getMonth() === oneMonthAgo.getMonth() &&
             entryDate.getFullYear() === oneMonthAgo.getFullYear()
    })
  }
  
  const oneMonthAgoEntries = getOneMonthAgoEntries()
  const hasMemories = onThisDayEntries.length > 0 || oneMonthAgoEntries.length > 0

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getYearsAgo = (dateString) => {
    const entryDate = new Date(dateString)
    const today = new Date()
    return today.getFullYear() - entryDate.getFullYear()
  }

  return (
    <div className={`on-this-day card ${expanded ? 'expanded' : ''}`}>
      <h3 className="card-title">
        📅 On This Day
      </h3>
      
      {!hasMemories ? (
        <div className="no-memories">
          <span className="no-memories-icon">🌱</span>
          <p>No memories yet for this day.</p>
          <p className="hint">Keep journaling to build your memory collection!</p>
        </div>
      ) : (
        <div className="memories-list">
          {onThisDayEntries.map(entry => (
            <div key={entry.id} className="memory-item">
              <div className="memory-badge">
                {getYearsAgo(entry.date)} year{getYearsAgo(entry.date) > 1 ? 's' : ''} ago
              </div>
              <div className="memory-content">
                {entry.photo && (
                  <img src={entry.photo} alt="Memory" className="memory-photo" />
                )}
                <p className="memory-text">
                  {entry.mood && <span className="memory-mood">{entry.mood}</span>}
                  {entry.text}
                </p>
                <span className="memory-date">{formatDate(entry.date)}</span>
              </div>
            </div>
          ))}
          
          {oneMonthAgoEntries.length > 0 && (
            <>
              <div className="memory-divider">1 Month Ago</div>
              {oneMonthAgoEntries.map(entry => (
                <div key={entry.id} className="memory-item month-ago">
                  <div className="memory-content">
                    {entry.photo && (
                      <img src={entry.photo} alt="Memory" className="memory-photo" />
                    )}
                    <p className="memory-text">
                      {entry.mood && <span className="memory-mood">{entry.mood}</span>}
                      {entry.text}
                    </p>
                    <span className="memory-date">{formatDate(entry.date)}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
