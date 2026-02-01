import { useState } from 'react'
import './UserGuide.css'

export default function UserGuide({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to OneLine",
      content: "Your micro-journaling companion for capturing life's moments, one line at a time."
    },
    {
      title: "Daily Journaling",
      content: "Write a brief entry every day. Keep it simple - just one or a few lines about your day, thoughts, or feelings. Select your mood to track emotional patterns over time."
    },
    {
      title: "Build Your Streak",
      content: "Stay consistent! Write daily to build your journaling streak. The streak tracker shows how many consecutive days you've journaled."
    },
    {
      title: "Track Your Moods",
      content: "Each entry includes a mood selector. Over time, you'll see patterns in your emotional journey through the Mood Map visualization."
    },
    {
      title: "Memories & Insights",
      content: "Explore your past entries with 'On This Day' to see what you wrote on this date in previous years. View AI-generated insights to understand patterns in your journaling."
    },
    {
      title: "Privacy & Security",
      content: "Your entries are stored locally on your device. Set up a PIN lock in Settings for extra privacy. Export your entries anytime to keep backups."
    },
    {
      title: "Customize Your Experience",
      content: "Toggle between light and dark themes, enable daily prompts for inspiration, and adjust settings to make OneLine your own."
    },
    {
      title: "Ready to Start",
      content: "That's it! Start your journaling journey today. Remember, consistency is key. Even a single line can make a difference."
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    localStorage.setItem('hasSeenGuide', 'true')
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('hasSeenGuide', 'true')
    onClose()
  }

  if (!isOpen) return null

  const step = steps[currentStep]

  return (
    <div className="guide-overlay">
      <div className="guide-modal">
        <button className="guide-close" onClick={handleSkip} title="Close">
          ✕
        </button>
        
        <div className="guide-content">
          <h2 className="guide-title">{step.title}</h2>
          <p className="guide-description">{step.content}</p>
        </div>

        <div className="guide-footer">
          <div className="guide-progress">
            {steps.map((_, index) => (
              <span 
                key={index} 
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="guide-actions">
            {currentStep > 0 && (
              <button className="guide-btn guide-btn-secondary" onClick={handlePrev}>
                Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <>
                <button className="guide-btn guide-btn-link" onClick={handleSkip}>
                  Skip
                </button>
                <button className="guide-btn guide-btn-primary" onClick={handleNext}>
                  Next
                </button>
              </>
            ) : (
              <button className="guide-btn guide-btn-primary" onClick={handleFinish}>
                Get Started! 🎉
              </button>
            )}
          </div>

          <div className="guide-step-counter">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  )
}
