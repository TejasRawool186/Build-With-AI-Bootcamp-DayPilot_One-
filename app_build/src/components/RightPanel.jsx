import { Activity, Flame, Target, Trophy, Smile } from 'lucide-react'

export default function RightPanel({ plan, todos }) {
  const activeTodos = todos?.filter(t => !t.completed).length || 0
  const completedTodos = todos?.filter(t => t.completed).length || 0

  return (
    <aside className="right-panel">
      
      <div className="panel-section">
        <h3 className="panel-title"><Target size={18} className="card-icon-svg" /> Daily Progress</h3>
        
        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ color: 'var(--accent-blue)', background: 'var(--pastel-blue)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{plan?.schedule?.total_events || 0}</span>
            <span className="stat-label">Events Today</span>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ color: 'var(--accent-peach)', background: 'var(--pastel-peach)' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{activeTodos}</span>
            <span className="stat-label">Tasks Pending</span>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title"><Trophy size={18} className="card-icon-svg" /> Achievements</h3>
        
        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ color: 'var(--accent-mint)', background: 'var(--pastel-mint)' }}>
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedTodos}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
        </div>
      </div>

      <div className="panel-section" style={{ marginTop: 'auto' }}>
        <div className="stat-widget" style={{ flexDirection: 'column', textAlign: 'center', gap: '8px' }}>
          <Smile size={32} color="var(--accent-lavender)" />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>You're doing great today. Keep up the momentum!</p>
        </div>
      </div>

    </aside>
  )
}
