import { Compass, CalendarDays, ListTodo, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Compass },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar({ activeView, onViewChange, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <Compass className="brand-icon" size={28} strokeWidth={1.8} />
        {!collapsed && <span className="brand-text">DayPilot</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={1.8} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" title="Settings">
          <Settings size={20} strokeWidth={1.8} />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
