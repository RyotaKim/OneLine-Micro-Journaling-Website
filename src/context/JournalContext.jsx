import { createContext, useContext, useState, useEffect } from 'react'

const JournalContext = createContext()

// Simple encryption/decryption (in production, use proper encryption)
const encryptData = (data) => {
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

const decryptData = (encryptedData) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encryptedData)))
  } catch {
    return []
  }
}

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journalEntries')
    return saved ? decryptData(saved) : []
  })

  const [streak, setStreak] = useState(0)

  // Calculate streak
  useEffect(() => {
    calculateStreak()
  }, [entries])

  const calculateStreak = () => {
    if (entries.length === 0) {
      setStreak(0)
      return
    }

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )

    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if there's an entry today or yesterday
    const lastEntryDate = new Date(sortedEntries[0].date)
    lastEntryDate.setHours(0, 0, 0, 0)

    if (lastEntryDate.getTime() !== today.getTime() && 
        lastEntryDate.getTime() !== yesterday.getTime()) {
      setStreak(0)
      return
    }

    // Count consecutive days
    let checkDate = lastEntryDate
    const entryDates = new Set(
      sortedEntries.map(e => {
        const d = new Date(e.date)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    while (entryDates.has(checkDate.getTime())) {
      currentStreak++
      checkDate = new Date(checkDate)
      checkDate.setDate(checkDate.getDate() - 1)
    }

    setStreak(currentStreak)
  }

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journalEntries', encryptData(entries))
  }, [entries])

  const addEntry = (text, mood, photo = null) => {
    const newEntry = {
      id: Date.now(),
      text,
      mood,
      photo,
      date: new Date().toISOString(),
      timestamp: Date.now()
    }
    setEntries(prev => [newEntry, ...prev])
  }

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const getOnThisDayEntries = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    return entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getMonth() === currentMonth && 
             entryDate.getDate() === currentDay &&
             entryDate.getFullYear() !== today.getFullYear()
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getEntriesByMonth = (year, month) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate.getFullYear() === year && entryDate.getMonth() === month
    })
  }

  const getMoodStats = (year, month) => {
    const monthEntries = getEntriesByMonth(year, month)
    const moodCounts = { 'Happy': 0, 'Neutral': 0, 'Sad': 0, 'Frustrated': 0, 'Tired': 0 }
    
    monthEntries.forEach(entry => {
      if (entry.mood && moodCounts.hasOwnProperty(entry.mood)) {
        moodCounts[entry.mood]++
      }
    })

    return moodCounts
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Entry', 'Mood']
    const rows = entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      `"${entry.text.replace(/"/g, '""')}"`,
      entry.mood || ''
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Create a printable HTML version
    const content = entries.map(entry => `
      <div style="margin-bottom: 20px; padding: 15px; border-bottom: 1px solid #eee;">
        <div style="color: #666; font-size: 12px;">${new Date(entry.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} ${entry.mood || ''}</div>
        <div style="margin-top: 8px; font-size: 14px;">${entry.text}</div>
      </div>
    `).join('')

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>My Journal</title>
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 20px; }
            h1 { text-align: center; color: #333; }
          </style>
        </head>
        <body>
          <h1>📔 My Journal</h1>
          ${content}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <JournalContext.Provider value={{
      entries,
      streak,
      addEntry,
      deleteEntry,
      getOnThisDayEntries,
      getEntriesByMonth,
      getMoodStats,
      exportToCSV,
      exportToPDF
    }}>
      {children}
    </JournalContext.Provider>
  )
}

export function useJournal() {
  const context = useContext(JournalContext)
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider')
  }
  return context
}
