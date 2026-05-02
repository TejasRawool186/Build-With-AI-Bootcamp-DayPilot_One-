import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CalendarView({ schedule, todos = [] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelectedDay(today.getDate()) }

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const getTodosForDay = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return todos.filter(t => t.dueDate === dateStr)
  }

  const getEventsForDay = (d) => {
    if (!schedule?.events) return []
    const todayDate = new Date()
    if (d === todayDate.getDate() && month === todayDate.getMonth() && year === todayDate.getFullYear()) {
      return schedule.events
    }
    return []
  }

  const selectedTodos = getTodosForDay(selectedDay)
  const selectedEvents = getEventsForDay(selectedDay)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar-section">
      <div className="calendar-header-bar">
        <h2 className="section-title"><CalendarDays size={22} strokeWidth={1.8} className="section-icon" /> Calendar</h2>
        <button className="today-btn" onClick={goToday}>Today</button>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prev}><ChevronLeft size={18} /></button>
            <h3 className="cal-month-title">{MONTH_NAMES[month]} {year}</h3>
            <button className="cal-nav-btn" onClick={next}><ChevronRight size={18} /></button>
          </div>

          <div className="calendar-grid">
            {DAY_NAMES.map(d => <div key={d} className="cal-day-name">{d}</div>)}
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} className="cal-cell empty" />
              const dayTodos = getTodosForDay(day)
              const dayEvents = getEventsForDay(day)
              const hasTodos = dayTodos.length > 0
              const hasEvents = dayEvents.length > 0
              return (
                <button
                  key={day}
                  className={`cal-cell ${isToday(day) ? 'today' : ''} ${day === selectedDay ? 'selected' : ''} ${hasTodos || hasEvents ? 'has-items' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="cal-day-num">{day}</span>
                  {(hasTodos || hasEvents) && (
                    <div className="cal-dots">
                      {hasEvents && <span className="cal-dot event-dot" />}
                      {hasTodos && <span className="cal-dot todo-dot" />}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="calendar-detail">
          <h4 className="detail-date">
            {MONTH_NAMES[month]} {selectedDay}, {year}
            {isToday(selectedDay) && <span className="today-badge">Today</span>}
          </h4>

          {selectedEvents.length > 0 && (
            <div className="detail-group">
              <h5 className="detail-label">Schedule</h5>
              {selectedEvents.map((ev, i) => (
                <div key={i} className="detail-event">
                  <span className="de-time">{ev.time}</span>
                  <div className="de-info">
                    <span className="de-name">{ev.event}</span>
                    <span className="de-loc">{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTodos.length > 0 && (
            <div className="detail-group">
              <h5 className="detail-label">Tasks Due</h5>
              {selectedTodos.map(t => (
                <div key={t.id} className={`detail-todo ${t.completed ? 'done' : ''}`}>
                  <span className="dt-priority" style={{ background: t.completed ? '#94A3B8' : undefined }} />
                  <span>{t.title}</span>
                </div>
              ))}
            </div>
          )}

          {selectedEvents.length === 0 && selectedTodos.length === 0 && (
            <div className="detail-empty">No events or tasks for this day</div>
          )}
        </div>
      </div>
    </div>
  )
}
