import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'night'
}

const themes = {
  morning: {
    name: 'morning',
    background: 'linear-gradient(135deg, #fff6e6 0%, #ffe4c4 50%, #ffd4a3 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#5a4a3a',
    textSecondary: '#8a7a6a',
    accent: '#ff9f43',
    accentLight: '#fff0e0',
    inputBg: '#fffaf5',
    border: '#ffe4c4',
    shadow: 'rgba(255, 159, 67, 0.15)'
  },
  afternoon: {
    name: 'afternoon',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #d4e8f7 50%, #b8d4ed 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#2c3e50',
    textSecondary: '#5a6c7d',
    accent: '#3498db',
    accentLight: '#e8f4fd',
    inputBg: '#ffffff',
    border: '#d4e8f7',
    shadow: 'rgba(52, 152, 219, 0.15)'
  },
  night: {
    name: 'night',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    cardBg: 'rgba(30, 39, 73, 0.95)',
    textPrimary: '#e8e8e8',
    textSecondary: '#a0a0b0',
    accent: '#6c5ce7',
    accentLight: '#2d2d5a',
    inputBg: '#1e2749',
    border: '#2d3a5a',
    shadow: 'rgba(108, 92, 231, 0.2)'
  }
}

export function ThemeProvider({ children }) {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay())
  const [manualTheme, setManualTheme] = useState(null)

  useEffect(() => {
    // Update theme based on time every minute
    const interval = setInterval(() => {
      if (!manualTheme) {
        setTimeOfDay(getTimeOfDay())
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [manualTheme])

  const theme = themes[manualTheme || timeOfDay]

  useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement
    root.style.setProperty('--background', theme.background)
    root.style.setProperty('--card-bg', theme.cardBg)
    root.style.setProperty('--text-primary', theme.textPrimary)
    root.style.setProperty('--text-secondary', theme.textSecondary)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--accent-light', theme.accentLight)
    root.style.setProperty('--input-bg', theme.inputBg)
    root.style.setProperty('--border', theme.border)
    root.style.setProperty('--shadow', theme.shadow)
  }, [theme])

  const setTheme = (themeName) => {
    if (themeName === 'auto') {
      setManualTheme(null)
      setTimeOfDay(getTimeOfDay())
    } else {
      setManualTheme(themeName)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, timeOfDay: manualTheme || timeOfDay }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
