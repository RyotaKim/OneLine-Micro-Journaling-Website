import { useState, useEffect, useRef } from 'react'
import { useJournal } from '../context/JournalContext'
import './StreakTracker.css'

// Milestone thresholds that trigger confetti
const MILESTONES = [7, 14, 21, 30, 50, 100, 365]

export default function StreakTracker() {
  const { streak, entries } = useJournal()
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiParticles, setConfettiParticles] = useState([])
  const prevStreakRef = useRef(streak)
  
  // Check for milestone achievement
  useEffect(() => {
    const prevStreak = prevStreakRef.current
    
    // Check if we just hit a milestone
    if (streak > prevStreak && MILESTONES.includes(streak)) {
      triggerConfetti()
    }
    
    prevStreakRef.current = streak
  }, [streak])
  
  const triggerConfetti = () => {
    setShowConfetti(true)
    
    // Generate confetti particles
    const particles = []
    const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e91e63', '#00bcd4']
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2
      })
    }
    
    setConfettiParticles(particles)
    
    // Clean up after animation
    setTimeout(() => {
      setShowConfetti(false)
      setConfettiParticles([])
    }, 4000)
  }
  
  const hasEntryToday = () => {
    if (entries.length === 0) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastEntryDate = new Date(entries[0].date)
    lastEntryDate.setHours(0, 0, 0, 0)
    return lastEntryDate.getTime() === today.getTime()
  }

  const todayDone = hasEntryToday()
  
  // Check if current streak is at a milestone
  const isAtMilestone = MILESTONES.includes(streak)

  const getMessage = () => {
    if (streak === 0) return "Start your streak today!"
    if (streak === 1) return "Great start! Keep it going!"
    if (streak === 7) return "🎉 One week strong!"
    if (streak === 14) return "🎉 Two weeks! Amazing!"
    if (streak === 21) return "🎉 Three weeks! Habit formed!"
    if (streak === 30) return "🎉 One month! Incredible!"
    if (streak === 50) return "🎉 50 days! You're unstoppable!"
    if (streak === 100) return "🎉 100 days! Legendary!"
    if (streak === 365) return "🎉 ONE YEAR! 🏆"
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
    <div className={`streak-tracker card ${isAtMilestone ? 'milestone' : ''}`}>
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="confetti-container">
          {confettiParticles.map(particle => (
            <div
              key={particle.id}
              className="confetti-particle"
              style={{
                left: `${particle.x}%`,
                animationDelay: `${particle.delay}s`,
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="streak-content">
        <div className={`streak-icon ${isAtMilestone ? 'celebrating' : ''}`}>{getStreakEmoji()}</div>
        <div className="streak-info">
          <div className="streak-count">
            <span className={`number ${isAtMilestone ? 'milestone-number' : ''}`}>{streak}</span>
            <span className="label">day streak</span>
          </div>
          <p className={`streak-message ${isAtMilestone ? 'milestone-message' : ''}`}>{getMessage()}</p>
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
