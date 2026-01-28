import { useState } from 'react'
import './Settings.css'

export default function Settings({ onClose, hasSetPin, onPinSet }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [isChangingPin, setIsChangingPin] = useState(false)

  const handleResetData = () => {
    localStorage.removeItem('journalEntries')
    localStorage.removeItem('journalPin')
    localStorage.removeItem('journalLockEnabled')
    window.location.reload()
  }

  const handleToggleLock = () => {
    const currentState = localStorage.getItem('journalLockEnabled')
    if (currentState === 'true') {
      localStorage.setItem('journalLockEnabled', 'false')
    } else {
      if (!hasSetPin) {
        setIsChangingPin(true)
      } else {
        localStorage.setItem('journalLockEnabled', 'true')
      }
    }
    window.location.reload()
  }

  const handleSetNewPin = (e) => {
    e.preventDefault()
    if (newPin.length === 4) {
      localStorage.setItem('journalPin', newPin)
      onPinSet()
      setIsChangingPin(false)
      setNewPin('')
    }
  }

  const lockEnabled = localStorage.getItem('journalLockEnabled') === 'true'

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Privacy & Security</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">PIN Lock</span>
                <span className="setting-description">
                  Require PIN to access your journal
                </span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={lockEnabled}
                  onChange={handleToggleLock}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {isChangingPin && (
              <form onSubmit={handleSetNewPin} className="change-pin-form">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="pin-input-small"
                  autoFocus
                />
                <button type="submit" disabled={newPin.length !== 4}>
                  Set PIN
                </button>
              </form>
            )}

            {hasSetPin && (
              <button 
                className="setting-btn"
                onClick={() => setIsChangingPin(true)}
              >
                Change PIN
              </button>
            )}
          </div>

          <div className="settings-section">
            <h3>Data Management</h3>
            
            <div className="setting-item danger">
              <div className="setting-info">
                <span className="setting-label">Reset All Data</span>
                <span className="setting-description">
                  Permanently delete all journal entries
                </span>
              </div>
              <button 
                className="danger-btn"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset
              </button>
            </div>

            {showResetConfirm && (
              <div className="confirm-dialog">
                <p>Are you sure? This cannot be undone.</p>
                <div className="confirm-actions">
                  <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
                  <button className="danger-btn" onClick={handleResetData}>
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>About</h3>
            <p className="about-text">
              OneLine is designed for quick, low-friction journaling. 
              Your entries are encrypted and stored locally on your device.
            </p>
            <p className="version">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
