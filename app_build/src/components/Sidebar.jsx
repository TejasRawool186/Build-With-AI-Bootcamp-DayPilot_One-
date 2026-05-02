import { Compass, CalendarDays, ListTodo, Settings } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Compass },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Compass className="brand-icon" size={28} strokeWidth={2} />
        <span className="brand-text">DayPilot</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" title="Settings">
          <Settings size={20} strokeWidth={2} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
