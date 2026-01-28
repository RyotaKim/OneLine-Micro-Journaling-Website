import { useJournal } from '../context/JournalContext'
import './StreakTracker.css'

export default function StreakTracker() {
  const { streak, entries } = useJournal()
  
  const hasEntryToday = () => {
    if (entries.length === 0) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastEntryDate = new Date(entries[0].date)
    lastEntryDate.setHours(0, 0, 0, 0)
    return lastEntryDate.getTime() === today.getTime()
  }

  const todayDone = hasEntryToday()

  const getMessage = () => {
    if (streak === 0) return "Start your streak today!"
    if (streak === 1) return "Great start! Keep it going!"
    if (streak < 7) return "Building momentum!"
    if (streak < 30) return "You're on fire! 🔥"
    if (streak < 100) return "Incredible dedication!"
    return "Legendary journaler! 🏆"
  }

  const getStreakEmoji = () => {
    if (streak === 0) return '🌱'
    if (streak < 7) return '🌿'
    if (streak < 30) return '🔥'
    if (streak < 100) return '⭐'
    return '🏆'
  }

  return (
    <div className="streak-tracker card">
      <div className="streak-content">
        <div className="streak-icon">{getStreakEmoji()}</div>
        <div className="streak-info">
          <div className="streak-count">
            <span className="number">{streak}</span>
            <span className="label">day streak</span>
          </div>
          <p className="streak-message">{getMessage()}</p>
        </div>
        <div className={`today-status ${todayDone ? 'done' : 'pending'}`}>
          {todayDone ? (
            <>
              <span className="status-icon">✓</span>
              <span className="status-text">Done today!</span>
            </>
          ) : (
            <>
              <span className="status-icon">○</span>
              <span className="status-text">Not yet today</span>
            </>
          )}
        </div>
      </div>
      
      <div className="week-dots">
        {[...Array(7)].map((_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          date.setHours(0, 0, 0, 0)
          
          const hasEntry = entries.some(entry => {
            const entryDate = new Date(entry.date)
            entryDate.setHours(0, 0, 0, 0)
            return entryDate.getTime() === date.getTime()
          })
          
          const isToday = i === 6
          
          return (
            <div 
              key={i} 
              className={`day-dot ${hasEntry ? 'filled' : ''} ${isToday ? 'today' : ''}`}
              title={date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            >
              <span className="dot-day">
                {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
