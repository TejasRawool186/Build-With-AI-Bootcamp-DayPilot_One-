import { Lightbulb, BrainCircuit } from 'lucide-react'

export default function SuggestionsCard({ suggestions, dailyTip }) {
  if (!suggestions || suggestions.length === 0) return null
  return (
    <div className="paper-card paper-green pin-top suggestions-card">
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
        <div className="daily-tip" style={{ marginTop: '20px', padding: '16px', background: 'var(--pastel-yellow)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-inset-sm)', display: 'flex', gap: '12px' }}>
          <Lightbulb size={20} color="var(--accent-peach)" style={{ flexShrink: 0 }} />
          <div><span style={{ fontWeight: 700, color: 'var(--accent-peach)', display: 'block', marginBottom: '4px' }}>Tip of the Day:</span> <span style={{ fontSize: '0.85rem' }}>{dailyTip}</span></div>
        </div>
      )}
    </div>
  )
}
