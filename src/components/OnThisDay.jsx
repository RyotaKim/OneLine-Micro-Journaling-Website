import { useState, useEffect } from 'react'
import { useJournal } from '../context/JournalContext'
import './OnThisDay.css'

// Motivational messages for empty states
const motivationalMessages = [
  { emoji: '🌱', title: 'Seeds of memories', text: 'Every entry you write today becomes a treasure for tomorrow.' },
  { emoji: '📝', title: 'Start your story', text: 'The best time to plant a tree was 20 years ago. The second best time is now.' },
  { emoji: '✨', title: 'Future you will thank you', text: 'Imagine reading this moment a year from now.' },
  { emoji: '🌟', title: 'You\'re building something beautiful', text: 'Each journal entry is a gift to your future self.' },
  { emoji: '🎯', title: 'One line at a time', text: 'Small consistent actions create powerful memories.' },
  { emoji: '💭', title: 'Capture the moment', text: 'Today\'s ordinary becomes tomorrow\'s precious memory.' },
  { emoji: '🌈', title: 'Your journey matters', text: 'Every day has a story worth remembering.' },
  { emoji: '📖', title: 'Write your chapter', text: 'This day is waiting to be documented.' }
]

export default function OnThisDay({ expanded = false }) {
  const { getOnThisDayEntries, entries } = useJournal()
  const onThisDayEntries = getOnThisDayEntries()
  const [motivationalMessage, setMotivationalMessage] = useState(null)
  
  // Pick a random motivational message on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMotivationalMessage(motivationalMessages[randomIndex])
  }, [])
  
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
          <div className="empty-state-illustration">
            <span className="no-memories-icon">{motivationalMessage?.emoji || '🌱'}</span>
            <div className="floating-elements">
              <span className="float-element">✨</span>
              <span className="float-element">📝</span>
              <span className="float-element">💫</span>
            </div>
          </div>
          <h4 className="empty-title">{motivationalMessage?.title || 'No memories yet'}</h4>
          <p className="empty-message">{motivationalMessage?.text || 'Keep journaling to build your memory collection!'}</p>
          <div className="empty-hint">
            <span className="hint-icon">💡</span>
            <p>Memories from this date will appear here next year!</p>
          </div>
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
