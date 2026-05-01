export default function ScheduleCard({ schedule }) {
  if (!schedule) return null

  const { date, total_events, events } = schedule

  return (
    <div className="glass-card schedule-card">
      <div className="card-header">
        <span className="card-icon">📅</span>
        <span className="card-title">Today's Schedule</span>
        <span
          className="card-badge"
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-indigo)'
          }}
        >
          {total_events} events
        </span>
      </div>

      <div className="schedule-date">{date}</div>

      {events && events.map((event, i) => (
        <div className="schedule-event" key={i}>
          <div className={`priority-dot priority-${event.priority || 'medium'}`} />
          <div className="event-time">{event.time}</div>
          <div className="event-details">
            <div className="event-name">{event.event}</div>
            <div className="event-location">📍 {event.location}</div>
            <div className="event-meta">
              <span className={`event-tag tag-${event.type || 'meeting'}`}>
                {event.type || 'event'}
              </span>
              {event.duration && (
                <span className="event-tag" style={{
                  background: 'rgba(148, 163, 184, 0.1)',
                  color: 'var(--text-muted)'
                }}>
                  {event.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
