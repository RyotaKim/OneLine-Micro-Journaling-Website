import { useJournal } from '../context/JournalContext'
import './AIInsights.css'

export default function AIInsights() {
  const { entries, getMoodStats } = useJournal()
  
  const generateInsights = () => {
    const insights = []
    
    if (entries.length < 3) {
      return [{
        type: 'tip',
        title: 'Keep Going!',
        text: 'Write a few more entries to unlock personalized insights about your journaling patterns.'
      }]
    }

    // Analyze mood patterns
    const now = new Date()
    const moodStats = getMoodStats(now.getFullYear(), now.getMonth())
    const totalMoods = Object.values(moodStats).reduce((a, b) => a + b, 0)
    
    if (totalMoods >= 5) {
      const dominantMood = Object.entries(moodStats)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])[0]
      
      if (dominantMood) {
        const moodMessages = {
          'Happy': 'You\'ve been feeling mostly happy this month! Keep doing what you\'re doing.',
          'Neutral': 'Your mood has been steady and neutral this month. Consistency is key!',
          'Sad': 'It seems like you\'ve had some challenging days. Remember, writing about it helps.',
          'Frustrated': 'You\'ve expressed some frustration lately. Journaling is a great outlet!',
          'Tired': 'Looks like you\'ve been tired. Consider reviewing your sleep habits.'
        }
        
        insights.push({
          type: 'mood',
          title: 'Mood Trend',
          text: moodMessages[dominantMood[0]] || 'Keep tracking your moods!'
        })
      }
    }

    // Analyze writing frequency
    const thisMonth = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getMonth() === now.getMonth() && 
             entryDate.getFullYear() === now.getFullYear()
    })

    const dayOfMonth = now.getDate()
    const averagePerWeek = (thisMonth.length / dayOfMonth) * 7

    if (averagePerWeek >= 5) {
      insights.push({
        type: 'consistency',
        title: 'Writing Machine!',
        text: `You're averaging ${averagePerWeek.toFixed(1)} entries per week. Amazing consistency!`
      })
    } else if (averagePerWeek >= 3) {
      insights.push({
        type: 'consistency',
        title: 'Solid Habit',
        text: `You're writing about ${averagePerWeek.toFixed(1)} times per week. Great job maintaining the habit!`
      })
    }

    // Analyze day of week patterns
    const dayCount = [0, 0, 0, 0, 0, 0, 0]
    entries.forEach(entry => {
      const day = new Date(entry.date).getDay()
      dayCount[day]++
    })
    
    const maxDay = dayCount.indexOf(Math.max(...dayCount))
    const dayNames = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
    
    if (entries.length >= 7) {
      insights.push({
        type: 'pattern',
        title: 'Pattern Detected',
        text: `You journal most often on ${dayNames[maxDay]}. Consider setting reminders for other days!`
      })
    }

    // Word count insight
    const totalWords = entries.reduce((sum, entry) => sum + entry.text.split(' ').length, 0)
    if (totalWords > 100) {
      insights.push({
        type: 'words',
        title: 'Word Tracker',
        text: `You've written approximately ${totalWords.toLocaleString()} words in your journal. That's impressive!`
      })
    }

    // Time of day analysis
    const hourCount = { morning: 0, afternoon: 0, evening: 0, night: 0 }
    entries.forEach(entry => {
      const hour = new Date(entry.date).getHours()
      if (hour >= 5 && hour < 12) hourCount.morning++
      else if (hour >= 12 && hour < 17) hourCount.afternoon++
      else if (hour >= 17 && hour < 21) hourCount.evening++
      else hourCount.night++
    })

    const preferredTime = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]
    if (entries.length >= 5) {
      const timeMessages = {
        morning: 'You\'re a morning journaler! Starting the day with reflection is powerful.',
        afternoon: 'Afternoon is your journaling time. A great way to pause and reflect.',
        evening: 'You prefer evening journaling. Perfect for processing the day.',
        night: 'Night owl writer! Late-night reflections can be the deepest.'
      }
      
      insights.push({
        type: 'time',
        title: 'Best Writing Time',
        text: timeMessages[preferredTime[0]]
      })
    }

    return insights.slice(0, 4) // Limit to 4 insights
  }

  const insights = generateInsights()

  return (
    <div className="ai-insights card">
      <h3 className="card-title">
        AI Insights
        <span className="beta-badge">Beta</span>
      </h3>
      <p className="insights-subtitle">
        Patterns and observations from your journal
      </p>
      
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card ${insight.type}`}>
            <h4 className="insight-title">{insight.title}</h4>
            <p className="insight-text">{insight.text}</p>
          </div>
        ))}
      </div>

      <div className="insights-disclaimer">
        <p>✨ These insights are generated locally from your entries. Your data never leaves your device.</p>
      </div>
    </div>
  )
}
