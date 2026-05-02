import { Bell, AlertTriangle, CheckCircle2, CloudRain, Car, Train, Info } from 'lucide-react'

const ALERT_ICONS = {
  weather: CloudRain, traffic: Car, conflict: AlertTriangle, transit: Train, general: Info,
}

export default function AlertsCard({ alerts, conflicts }) {
  const allAlerts = [
    ...(conflicts?.conflicts || []).map(c => ({ type: 'conflict', message: c.message })),
    ...(conflicts?.warnings || []).map(w => ({ type: w.type || 'general', message: w.message })),
    ...(alerts || [])
  ]
  const uniqueAlerts = allAlerts.filter((a, i, arr) => arr.findIndex(x => x.message === a.message) === i)

  return (
    <div className="glass-card alerts-card">
      <div className="card-header">
        <Bell size={18} className="card-icon-svg" />
        <span className="card-title">Alerts</span>
        {uniqueAlerts.length > 0 && <span className="card-badge badge-red">{uniqueAlerts.length}</span>}
      </div>
      {uniqueAlerts.length === 0 ? (
        <div className="no-alerts"><CheckCircle2 size={20} /> No alerts &mdash; your day looks great!</div>
      ) : (
        uniqueAlerts.map((alert, i) => {
          const Icon = ALERT_ICONS[alert.type] || Info
          return (
            <div className={`alert-item alert-${alert.type || 'general'}`} key={i}>
              <Icon size={16} className="alert-icon-svg" />
              <span className="alert-message">{alert.message}</span>
            </div>
          )
        })
      )}
    </div>
  )
}
