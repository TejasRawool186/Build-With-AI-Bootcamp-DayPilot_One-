import { Lightbulb, BrainCircuit } from 'lucide-react'

export default function SuggestionsCard({ suggestions, dailyTip }) {
  if (!suggestions || suggestions.length === 0) return null
  return (
    <div className="glass-card suggestions-card">
      <div className="card-header">
        <BrainCircuit size={18} className="card-icon-svg" />
        <span className="card-title">AI Suggestions</span>
        <span className="card-badge badge-green">{suggestions.length} tips</span>
      </div>
      <div className="suggestions-list">
        {suggestions.map((s, i) => (
          <div className="suggestion-item" key={i}>
            <div className="suggestion-number">{i + 1}</div>
            <div className="suggestion-text">{s}</div>
          </div>
        ))}
      </div>
      {dailyTip && (
        <div className="daily-tip">
          <Lightbulb size={16} className="tip-icon" />
          <div><span className="daily-tip-label">Tip of the Day:</span> {dailyTip}</div>
        </div>
      )}
    </div>
  )
}
