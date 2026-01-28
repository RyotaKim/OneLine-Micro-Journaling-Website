import { useTheme } from '../context/ThemeContext'
import './ThemeSwitcher.css'

export default function ThemeSwitcher() {
  const { timeOfDay, setTheme } = useTheme()

  const themes = [
    { id: 'auto', label: 'Auto' },
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'night', label: 'Night' }
  ]

  const getThemeLabel = () => {
    if (timeOfDay === 'morning') return 'Morning'
    if (timeOfDay === 'afternoon') return 'Afternoon'
    if (timeOfDay === 'night') return 'Night'
    return 'Theme'
  }

  return (
    <div className="theme-switcher">
      <button className="theme-trigger" title="Change theme">
        {getThemeLabel()}
      </button>
      <div className="theme-dropdown">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`theme-option ${timeOfDay === theme.id || (theme.id === 'auto' && !['morning', 'afternoon', 'night'].includes(timeOfDay)) ? 'active' : ''}`}
            onClick={() => setTheme(theme.id)}
          >
            <span className="theme-label">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
