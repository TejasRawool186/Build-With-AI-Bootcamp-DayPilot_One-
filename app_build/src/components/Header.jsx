import { Search, Smile } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-greeting">
        <h1 className="header-title">Good Morning</h1>
        <p className="header-tagline">Let's make today productive and calm.</p>
      </div>
      
      <div className="top-nav-actions">
        <div className="search-bar">
          <Search size={16} color="var(--text-muted)" />
          <input type="text" placeholder="Search tasks, events..." />
        </div>
        <div className="profile-widget">
          <Smile size={20} className="avatar-icon" />
          <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>Tejas</span>
        </div>
      </div>
    </header>
  )
}
