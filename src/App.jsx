import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import LockScreen from './components/LockScreen'
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
        </div>
      </JournalProvider>
    </ThemeProvider>
  )
}

export default App
