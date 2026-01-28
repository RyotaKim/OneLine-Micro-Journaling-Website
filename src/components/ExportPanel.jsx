import { useJournal } from '../context/JournalContext'
import './ExportPanel.css'

export default function ExportPanel() {
  const { exportToCSV, exportToPDF, entries } = useJournal()

  return (
    <div className="export-panel card">
      <h3 className="card-title">📤 Export Your Data</h3>
      <p className="export-description">
        Your data belongs to you. Download your journal entries anytime.
      </p>
      <div className="export-buttons">
        <button 
          className="export-btn csv"
          onClick={exportToCSV}
          disabled={entries.length === 0}
        >
          <span className="export-icon">📊</span>
          <span className="export-label">Export CSV</span>
          <span className="export-hint">For spreadsheets</span>
        </button>
        <button 
          className="export-btn pdf"
          onClick={exportToPDF}
          disabled={entries.length === 0}
        >
          <span className="export-icon">📄</span>
          <span className="export-label">Export PDF</span>
          <span className="export-hint">For printing</span>
        </button>
      </div>
      {entries.length === 0 && (
        <p className="export-empty">Start journaling to enable exports!</p>
      )}
    </div>
  )
}
