import { useState } from 'react'
import { useJournal } from '../context/JournalContext'
import './MoodMap.css'

export default function MoodMap() {
  const { getMoodStats, getEntriesByMonth } = useJournal()
  const [viewDate, setViewDate] = useState(new Date())
  
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  
  const moodStats = getMoodStats(year, month)
  const monthEntries = getEntriesByMonth(year, month)
  
  const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0)
  
  const moods = [
    { value: 'Happy', label: 'Happy', color: '#27ae60' },
    { value: 'Neutral', label: 'Neutral', color: '#95a5a6' },
    { value: 'Sad', label: 'Sad', color: '#3498db' },
    { value: 'Frustrated', label: 'Frustrated', color: '#e74c3c' },
    { value: 'Tired', label: 'Tired', color: '#9b59b6' }
  ]

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(year, month, 1).getDay()
  }

  const getEntriesForDay = (day) => {
    return monthEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getDate() === day
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getMoodColor = (mood) => {
    const found = moods.find(m => m.value === mood)
    return found ? found.color : 'transparent'
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setViewDate(newDate)
  }

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="mood-map card">
      <div className="mood-header">
        <h3 className="card-title">Mood Map</h3>
        <div className="month-nav">
          <button onClick={() => navigateMonth(-1)}>←</button>
          <span>{monthName}</span>
          <button onClick={() => navigateMonth(1)}>→</button>
        </div>
      </div>

      <div className="mood-legend">
        {moods.map(({ value, label, color }) => (
          <div key={value} className="legend-item">
            <span 
              className="legend-dot" 
              style={{ background: color }}
            />
            <span className="legend-label">{label}</span>
            <span className="legend-count">{moodStats[value] || 0}</span>
          </div>
        ))}
      </div>

      <div className="mood-calendar">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-label">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {[...Array(getFirstDayOfMonth())].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell empty" />
          ))}
          {[...Array(getDaysInMonth())].map((_, i) => {
            const day = i + 1
            const dayEntries = getEntriesForDay(day)
            const latestEntry = dayEntries[0]
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year
            
            return (
              <div 
                key={day} 
                className={`calendar-cell ${latestEntry ? 'has-entry' : ''} ${isToday ? 'today' : ''}`}
                style={latestEntry?.mood ? { 
                  background: getMoodColor(latestEntry.mood),
                  color: 'white'
                } : {}}
                title={latestEntry ? `${latestEntry.mood || ''} ${latestEntry.text.substring(0, 50)}...` : ''}
              >
                {latestEntry?.photo && (
                  <div 
                    className="cell-image-preview"
                    style={{ backgroundImage: `url(${latestEntry.photo})` }}
                  />
                )}
                <span className="cell-day">{day}</span>
                {latestEntry && !latestEntry.mood && !latestEntry.photo && <span className="cell-dot">•</span>}
              </div>
            )
          })}
        </div>
      </div>

      {totalMoods > 0 && (
        <div className="mood-summary">
          <p>
            You tracked your mood <strong>{totalMoods}</strong> time{totalMoods !== 1 ? 's' : ''} this month
          </p>
          {moodStats['Happy'] > 0 && moodStats['Happy'] >= Math.max(...Object.values(moodStats)) && (
            <p className="mood-insight">Most common mood: Happy!</p>
          )}
        </div>
      )}
    </div>
  )
}
