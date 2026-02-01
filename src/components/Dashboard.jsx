import { useState } from 'react'
import JournalInput from './JournalInput'
import DailyPrompt from './DailyPrompt'
import StreakTracker from './StreakTracker'
import OnThisDay from './OnThisDay'
import RecentEntries from './RecentEntries'
import MoodMap from './MoodMap'
import AIInsights from './AIInsights'
import ThemeSwitcher from './ThemeSwitcher'
import Settings from './Settings'
import UserGuide from './UserGuide'
import './Dashboard.css'

export default function Dashboard({ onLock, hasSetPin, onPinSet }) {
  const [activeTab, setActiveTab] = useState('today')
  const [showSettings, setShowSettings] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/oneline_logo.png" alt="OneLine" className="logo-image" />
        </div>
        <div className="header-actions">
          <ThemeSwitcher />
          <button 
            className="icon-btn" 
            onClick={() => setShowGuide(true)}
            title="Help Guide"
          >
            ❓
          </button>
          <button 
            className="icon-btn" 
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            ⚙️
          </button>
          {hasSetPin && (
            <button className="icon-btn" onClick={onLock} title="Lock">
              🔒
            </button>
          )}
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          <span className="nav-label">Today</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'memories' ? 'active' : ''}`}
          onClick={() => setActiveTab('memories')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">Memories</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Insights</span>
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'today' && (
          <div className="today-view">
            <div className="today-main">
              <StreakTracker />
              <DailyPrompt />
              <JournalInput />
            </div>
            <div className="today-sidebar">
              <OnThisDay />
              <RecentEntries />
            </div>
          </div>
        )}

        {activeTab === 'memories' && (
          <div className="memories-view">
            <OnThisDay expanded />
            <RecentEntries showAll />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="insights-view">
            <MoodMap />
            <AIInsights />
          </div>
        )}
      </main>

      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)} 
          hasSetPin={hasSetPin}
          onPinSet={onPinSet}
        />
      )}

      <UserGuide 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </div>
  )
}
