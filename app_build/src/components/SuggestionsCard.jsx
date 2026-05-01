export default function SuggestionsCard({ suggestions, dailyTip }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="glass-card suggestions-card">
      <div className="card-header">
        <span className="card-icon">🤖</span>
        <span className="card-title">AI Suggestions</span>
        <span
          className="card-badge"
          style={{
            background: 'rgba(34, 211, 153, 0.15)',
            color: 'var(--accent-green)'
          }}
        >
          {suggestions.length} tips
        </span>
      </div>

      <div className="suggestions-list">
        {suggestions.map((suggestion, i) => (
          <div className="suggestion-item" key={i}>
            <div className="suggestion-number">{i + 1}</div>
            <div className="suggestion-text">{suggestion}</div>
          </div>
        ))}
      </div>

      {dailyTip && (
        <div className="daily-tip">
          <span className="daily-tip-label">💡 Tip of the Day:</span>
          {dailyTip}
        </div>
      )}
    </div>
  )
}
