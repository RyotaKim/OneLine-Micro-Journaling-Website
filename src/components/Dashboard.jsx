import { useState } from 'react'
import JournalInput from './JournalInput'
import DailyPrompt from './DailyPrompt'
import StreakTracker from './StreakTracker'
import OnThisDay from './OnThisDay'
import RecentEntries from './RecentEntries'
import MoodMap from './MoodMap'
import ExportPanel from './ExportPanel'
import AIInsights from './AIInsights'
import ThemeSwitcher from './ThemeSwitcher'
import Settings from './Settings'
import './Dashboard.css'

export default function Dashboard({ onLock, hasSetPin, onPinSet }) {
  const [activeTab, setActiveTab] = useState('journal')
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <span className="logo-icon">✏️</span>
          <h1>OneLine</h1>
        </div>
        <div className="header-actions">
          <ThemeSwitcher />
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
          className={`nav-btn ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          ✏️ Journal
        </button>
        <button 
          className={`nav-btn ${activeTab === 'memories' ? 'active' : ''}`}
          onClick={() => setActiveTab('memories')}
        >
          📅 Memories
        </button>
        <button 
          className={`nav-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 Insights
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'journal' && (
          <div className="journal-view">
            <div className="main-column">
              <StreakTracker />
              <DailyPrompt />
              <JournalInput />
              <RecentEntries />
            </div>
            <aside className="side-column">
              <OnThisDay />
              <ExportPanel />
            </aside>
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
    </div>
  )
}
