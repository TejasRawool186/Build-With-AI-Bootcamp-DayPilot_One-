import { CalendarDays, MapPin } from 'lucide-react'

export default function ScheduleCard({ schedule }) {
  if (!schedule) return null
  const { date, total_events, events } = schedule

  return (
    <div className="glass-card schedule-card">
      <div className="card-header">
        <CalendarDays size={18} className="card-icon-svg" />
        <span className="card-title">Today's Schedule</span>
        <span className="card-badge badge-indigo">{total_events} events</span>
      </div>
      <div className="schedule-date">{date}</div>
      {events && events.map((event, i) => (
        <div className="schedule-event" key={i}>
          <div className={`priority-dot priority-${event.priority || 'medium'}`} />
          <div className="event-time">{event.time}</div>
          <div className="event-details">
            <div className="event-name">{event.event}</div>
            <div className="event-location"><MapPin size={12} /> {event.location}</div>
            <div className="event-meta">
              <span className={`event-tag tag-${event.type || 'meeting'}`}>{event.type || 'event'}</span>
              {event.duration && <span className="event-tag tag-duration">{event.duration}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
