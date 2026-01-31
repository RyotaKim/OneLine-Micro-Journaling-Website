import { useState, useRef, useEffect } from 'react'
import { useJournal } from '../context/JournalContext'
import MoodSelector from './MoodSelector'
import './JournalInput.css'

export default function JournalInput() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const { addEntry } = useJournal()

  // Scroll to newest entry after saving
  const scrollToNewEntry = () => {
    setTimeout(() => {
      const entriesList = document.querySelector('.entries-list')
      if (entriesList && entriesList.firstChild) {
        entriesList.firstChild.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }, 100)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result)
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addEntry(text.trim(), mood, photo)
    
    setText('')
    setMood(null)
    removePhoto()
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Scroll to the new entry
    scrollToNewEntry()
    
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const characterCount = text.length
  const maxChars = 280

  return (
    <div className="journal-input card">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="What's on your mind today? Just a line or two..."
            className="journal-textarea"
            rows={3}
          />
          <div className="char-count">
            <span className={characterCount > maxChars * 0.9 ? 'warning' : ''}>
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>

        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="Preview" />
            <button type="button" className="remove-photo" onClick={removePhoto}>
              ✕
            </button>
          </div>
        )}

        <div className="input-actions">
          <div className="left-actions">
            <MoodSelector selected={mood} onSelect={setMood} />
            <button 
              type="button" 
              className="photo-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Add photo"
            >
              📷
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden-input"
            />
          </div>
          
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${showSuccess ? 'success' : ''}`}
            disabled={!text.trim() || isSubmitting}
          >
            {showSuccess ? '✓ Saved!' : isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}
