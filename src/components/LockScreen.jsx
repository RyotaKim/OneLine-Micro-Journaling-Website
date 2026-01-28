import { useState } from 'react'
import './LockScreen.css'

export default function LockScreen({ onUnlock, hasSetPin, onPinSet }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isSettingPin, setIsSettingPin] = useState(!hasSetPin)
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState(1)

  const handlePinChange = (value) => {
    if (value.length <= 4) {
      setPin(value)
      setError('')
    }
  }

  const handleConfirmPinChange = (value) => {
    if (value.length <= 4) {
      setConfirmPin(value)
      setError('')
    }
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    const storedPin = localStorage.getItem('journalPin')
    
    if (pin === storedPin) {
      onUnlock()
    } else {
      setError('Incorrect PIN. Please try again.')
      setPin('')
    }
  }

  const handleSetPin = (e) => {
    e.preventDefault()
    
    if (step === 1) {
      if (pin.length !== 4) {
        setError('PIN must be 4 digits')
        return
      }
      setStep(2)
      setError('')
    } else {
      if (pin !== confirmPin) {
        setError('PINs do not match. Please try again.')
        setConfirmPin('')
        return
      }
      localStorage.setItem('journalPin', pin)
      onPinSet()
    }
  }

  const handleSkip = () => {
    onUnlock()
  }

  return (
    <div className="lock-screen">
      <div className="lock-container">
        <div className="lock-icon">🔐</div>
        <h1 className="lock-title">OneLine</h1>
        
        {isSettingPin ? (
          <>
            <p className="lock-subtitle">
              {step === 1 
                ? 'Set a 4-digit PIN to protect your journal' 
                : 'Confirm your PIN'}
            </p>
            <form onSubmit={handleSetPin}>
              {step === 1 ? (
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="pin-input"
                  autoFocus
                />
              ) : (
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => handleConfirmPinChange(e.target.value.replace(/\D/g, ''))}
                  placeholder="Confirm PIN"
                  className="pin-input"
                  autoFocus
                />
              )}
              
              {error && <p className="pin-error">{error}</p>}
              
              <div className="pin-dots">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`pin-dot ${(step === 1 ? pin : confirmPin).length > i ? 'filled' : ''}`} 
                  />
                ))}
              </div>
              
              <button type="submit" className="unlock-btn">
                {step === 1 ? 'Next' : 'Set PIN'}
              </button>
              
              <button type="button" className="skip-btn" onClick={handleSkip}>
                Skip for now
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="lock-subtitle">Enter your PIN to unlock</p>
            <form onSubmit={handleUnlock}>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN"
                className="pin-input"
                autoFocus
              />
              
              {error && <p className="pin-error">{error}</p>}
              
              <div className="pin-dots">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`pin-dot ${pin.length > i ? 'filled' : ''}`} 
                  />
                ))}
              </div>
              
              <button type="submit" className="unlock-btn" disabled={pin.length !== 4}>
                Unlock
              </button>
            </form>
          </>
        )}
        
        <p className="lock-hint">
          🔒 Your entries are encrypted and stored locally
        </p>
      </div>
    </div>
  )
}
