import { useState } from 'react'
import { useJournal } from '../context/JournalContext'
import './RecentEntries.css'

export default function RecentEntries({ showAll = false }) {
  const { entries, deleteEntry } = useJournal()
  const [selectedEntry, setSelectedEntry] = useState(null)
  
  const displayEntries = showAll ? entries : entries.slice(0, 5)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id)
      setSelectedEntry(null)
    }
  }

  const closeDialog = () => {
    setSelectedEntry(null)
  }

  if (entries.length === 0) {
    return (
      <div className="recent-entries card">
        <h3 className="card-title">📝 Recent Entries</h3>
        <div className="empty-state">
          <span className="empty-icon">✨</span>
          <p>Your journal is waiting for its first entry!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="recent-entries card">
        <h3 className="card-title">
          📝 {showAll ? 'All Entries' : 'Recent Entries'}
          <span className="entry-count">{entries.length} total</span>
        </h3>
        
        <div className="entries-list">
          {displayEntries.map(entry => (
            <div 
              key={entry.id} 
              className="entry-item"
              data-mood={entry.mood || ''}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="entry-header">
                <span className="entry-date">{formatDate(entry.date)}</span>
                {entry.mood && <span className="entry-mood">{entry.mood}</span>}
              </div>
              
              <p className="entry-text">{entry.text}</p>
              
              {entry.photo && (
                <div className="entry-photo-indicator">📷 Photo attached</div>
              )}
            </div>
          ))}
        </div>
        
        {!showAll && entries.length > 5 && (
          <div className="view-all-hint">
            <p>View all entries in the Memories tab</p>
          </div>
        )}
      </div>

      {/* Entry Detail Dialog - Rendered outside the card */}
      {selectedEntry && (
        <div className="entry-dialog-overlay" onClick={closeDialog}>
          <div className="entry-dialog" onClick={e => e.stopPropagation()}>
            <button className="dialog-close" onClick={closeDialog}>✕</button>
            
            <div className="dialog-header">
              <span className="dialog-date">{formatFullDate(selectedEntry.date)}</span>
              {selectedEntry.mood && <span className="dialog-mood">{selectedEntry.mood}</span>}
            </div>
            
            {selectedEntry.photo && (
              <div className="dialog-photo-container">
                <img src={selectedEntry.photo} alt="Entry" className="dialog-photo" />
              </div>
            )}
            
            <p className="dialog-text">{selectedEntry.text}</p>
            
            <div className="dialog-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(selectedEntry.id)}
              >
                🗑️ Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
