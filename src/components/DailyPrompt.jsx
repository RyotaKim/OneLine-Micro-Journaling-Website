import { useState, useEffect } from 'react'
import './DailyPrompt.css'

const prompts = [
  "What's one thing you're looking forward to tomorrow?",
  "What made you smile today?",
  "What's something you learned recently?",
  "What are you grateful for right now?",
  "What's one small win you had today?",
  "What's been on your mind lately?",
  "What would make today a great day?",
  "What's something you want to remember about today?",
  "How are you really feeling right now?",
  "What's one thing you're proud of?",
  "What's a challenge you're working through?",
  "What inspired you today?",
  "What's one thing you'd like to do differently tomorrow?",
  "What made today unique?",
  "What's something that brought you peace today?",
  "Who made a positive impact on your day?",
  "What's something you're excited about?",
  "What's a thought you want to capture?",
  "What's one word that describes your day?",
  "What would you tell your future self about today?",
  "What's something unexpected that happened?",
  "What's a moment you want to remember?",
  "What are you hopeful about?",
  "What's something that challenged you today?",
  "What's a simple pleasure you enjoyed today?",
  "What's on your mind as the day ends?",
  "What's something you accomplished today?",
  "What made you feel alive today?",
  "What's a question you're pondering?",
  "What's one thing you're letting go of?"
]

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Get daily prompt based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const promptIndex = dayOfYear % prompts.length
    setPrompt(prompts[promptIndex])
  }, [])

  const refreshPrompt = () => {
    setIsRefreshing(true)
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setTimeout(() => {
      setPrompt(prompts[randomIndex])
      setIsRefreshing(false)
    }, 300)
  }

  return (
    <div className="daily-prompt card">
      <div className="prompt-header">
        <span className="prompt-label">💭 Today's Prompt</span>
        <button 
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={refreshPrompt}
          title="Get a different prompt"
        >
          🔄
        </button>
      </div>
      <p className={`prompt-text ${isRefreshing ? 'fading' : ''}`}>
        "{prompt}"
      </p>
    </div>
  )
}
