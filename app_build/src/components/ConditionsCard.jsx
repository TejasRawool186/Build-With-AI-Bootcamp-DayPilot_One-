export default function ConditionsCard({ weather, traffic }) {
  if (!weather && !traffic) return null

  return (
    <div className="glass-card conditions-card">
      <div className="card-header">
        <span className="card-icon">🌍</span>
        <span className="card-title">Conditions</span>
        {weather?.severity && (
          <span
            className="card-badge"
            style={{
              background: weather.severity === 'danger'
                ? 'rgba(239, 68, 68, 0.15)'
                : weather.severity === 'warning'
                  ? 'rgba(251, 191, 36, 0.15)'
                  : 'rgba(34, 197, 94, 0.15)',
              color: weather.severity === 'danger'
                ? 'var(--accent-rose)'
                : weather.severity === 'warning'
                  ? 'var(--accent-amber)'
                  : 'var(--accent-green)'
            }}
          >
            {weather.severity}
          </span>
        )}
      </div>

      {/* Weather Section */}
      {weather && (
        <>
          <div className="weather-display">
            <div className="weather-icon-large">{weather.icon || '🌡'}</div>
            <div className="weather-temp">{weather.temperature}</div>
            <div className="weather-condition">{weather.condition}</div>
          </div>

          <div className="weather-details">
            <div className="weather-stat">
              <div className="weather-stat-label">Feels Like</div>
              <div className="weather-stat-value">{weather.feels_like}</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">Humidity</div>
              <div className="weather-stat-value">{weather.humidity}</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">Wind</div>
              <div className="weather-stat-value">{weather.wind_speed}</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">City</div>
              <div className="weather-stat-value">{weather.city}</div>
            </div>
          </div>

          <div className="weather-source">{weather.source}</div>
        </>
      )}

      {/* Traffic Section */}
      {traffic && (
        <div className="traffic-section">
          <div className="traffic-header">
            <div className="traffic-level">
              <span>{traffic.icon || '🚦'}</span>
              <span>{traffic.overall_level} Traffic</span>
            </div>
            <div className="traffic-delay">+{traffic.delay_minutes} min</div>
          </div>

          {traffic.routes && traffic.routes.slice(0, 2).map((route, i) => (
            <div className="traffic-route" key={i}>
              <div className="route-name">
                {route.from} → {route.to}
              </div>
              <div className="route-time">
                via {route.via} · {route.current_estimate} ({route.delay})
              </div>
            </div>
          ))}

          {traffic.transit_delays && traffic.transit_delays.map((delay, i) => (
            <div className="transit-delay" key={i}>
              🚆 {delay.mode} ({delay.line}) — {delay.delay} · {delay.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
