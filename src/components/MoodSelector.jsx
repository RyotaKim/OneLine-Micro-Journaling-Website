import './MoodSelector.css'

const moods = [
  { value: 'Happy', label: 'Happy' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Sad', label: 'Sad' },
  { value: 'Frustrated', label: 'Frustrated' },
  { value: 'Tired', label: 'Tired' }
]

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="mood-selector">
      {moods.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`mood-btn ${selected === value ? 'selected' : ''}`}
          onClick={() => onSelect(selected === value ? null : value)}
          title={label}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
