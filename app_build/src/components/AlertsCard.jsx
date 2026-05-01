export default function AlertsCard({ alerts, conflicts }) {
  const allAlerts = [
    ...(conflicts?.conflicts || []).map(c => ({
      type: 'conflict',
      icon: c.icon || '⚠️',
      message: c.message
    })),
    ...(conflicts?.warnings || []).map(w => ({
      type: w.type || 'general',
      icon: w.icon || '⚠️',
      message: w.message
    })),
    ...(alerts || [])
  ]

  // Deduplicate by message
  const uniqueAlerts = allAlerts.filter((alert, i, arr) =>
    arr.findIndex(a => a.message === alert.message) === i
  )

  return (
    <div className="glass-card alerts-card">
      <div className="card-header">
        <span className="card-icon">🔔</span>
        <span className="card-title">Alerts</span>
        {uniqueAlerts.length > 0 && (
          <span
            className="card-badge"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--accent-rose)'
            }}
          >
            {uniqueAlerts.length}
          </span>
        )}
      </div>

      {uniqueAlerts.length === 0 ? (
        <div className="no-alerts">
          ✅ No alerts — your day looks great!
        </div>
      ) : (
        uniqueAlerts.map((alert, i) => (
          <div
            className={`alert-item alert-${alert.type || 'general'}`}
            key={i}
          >
            <span className="alert-icon">{alert.icon || '⚠️'}</span>
            <span className="alert-message">{alert.message}</span>
          </div>
        ))
      )}
    </div>
  )
}
