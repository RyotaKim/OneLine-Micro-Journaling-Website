import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import LockScreen from './components/LockScreen'
import UserGuide from './components/UserGuide'
import { JournalProvider } from './context/JournalContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [isLocked, setIsLocked] = useState(() => {
    const lockEnabled = localStorage.getItem('journalLockEnabled')
    return lockEnabled === 'true'
  })
  const [hasSetPin, setHasSetPin] = useState(() => {
    return localStorage.getItem('journalPin') !== null
  })
  const [showGuide, setShowGuide] = useState(false)

  // Check if first-time user
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide')
    if (!hasSeenGuide && !isLocked) {
      // Show guide after a short delay for better UX
      const timer = setTimeout(() => {
        setShowGuide(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLocked])

  const handleUnlock = () => {
    setIsLocked(false)
  }

  const handleLock = () => {
    setIsLocked(true)
  }

  const handlePinSet = () => {
    setHasSetPin(true)
    setIsLocked(true)
    localStorage.setItem('journalLockEnabled', 'true')
  }

  return (
    <ThemeProvider>
      <JournalProvider>
        <div className="app">
          {isLocked ? (
            <LockScreen 
              onUnlock={handleUnlock} 
              hasSetPin={hasSetPin}
              onPinSet={handlePinSet}
            />
          ) : (
            <Dashboard onLock={handleLock} hasSetPin={hasSetPin} onPinSet={handlePinSet} />
          )}
          
          {!isLocked && (
            <UserGuide 
              isOpen={showGuide}
              onClose={() => setShowGuide(false)}
            />
          )}
        </div>
      </JournalProvider>
    </ThemeProvider>
  )
}

export default App
