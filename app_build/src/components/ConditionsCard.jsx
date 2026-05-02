import { Cloud, Sun, CloudRain, CloudSnow, CloudFog, Wind, Droplets, Thermometer, MapPin, Car, Train, AlertTriangle } from 'lucide-react'

const WEATHER_ICONS = {
  'clear': Sun, 'cloud': Cloud, 'rain': CloudRain, 'drizzle': CloudRain,
  'snow': CloudSnow, 'mist': CloudFog, 'haze': CloudFog, 'fog': CloudFog,
  'thunder': CloudRain, 'storm': CloudRain,
}

function getWeatherIcon(condition) {
  if (!condition) return Cloud
  const lower = condition.toLowerCase()
  for (const [key, Icon] of Object.entries(WEATHER_ICONS)) {
    if (lower.includes(key)) return Icon
  }
  return Cloud
}

export default function ConditionsCard({ weather, traffic }) {
  if (!weather && !traffic) return null
  const WeatherIcon = getWeatherIcon(weather?.condition)

  return (
    <div className="paper-card paper-blue tape-top conditions-card">
      <div className="card-header">
        <Cloud size={18} className="card-icon-svg" />
        <span className="card-title">Conditions</span>
        {weather?.severity && (
          <span className={`card-badge badge-${weather.severity === 'danger' ? 'red' : weather.severity === 'warning' ? 'amber' : 'green'}`}>
            {weather.severity}
          </span>
        )}
      </div>

      {weather && (<>
        <div className="weather-display">
          <WeatherIcon size={48} strokeWidth={1.2} className="weather-icon-large" />
          <div className="weather-temp">{weather.temperature}</div>
          <div className="weather-condition">{weather.condition}</div>
        </div>
        <div className="weather-details">
          <div className="weather-stat"><Thermometer size={14} className="stat-icon" /><div><div className="weather-stat-label">Feels Like</div><div className="weather-stat-value">{weather.feels_like}</div></div></div>
          <div className="weather-stat"><Droplets size={14} className="stat-icon" /><div><div className="weather-stat-label">Humidity</div><div className="weather-stat-value">{weather.humidity}</div></div></div>
          <div className="weather-stat"><Wind size={14} className="stat-icon" /><div><div className="weather-stat-label">Wind</div><div className="weather-stat-value">{weather.wind_speed}</div></div></div>
          <div className="weather-stat"><MapPin size={14} className="stat-icon" /><div><div className="weather-stat-label">City</div><div className="weather-stat-value">{weather.city}</div></div></div>
        </div>
        <div className="weather-source">{weather.source}</div>
      </>)}

      {traffic && (
        <div className="traffic-section">
          <div className="traffic-header">
            <div className="traffic-level"><Car size={16} /> <span>{traffic.overall_level} Traffic</span></div>
            <div className="traffic-delay">+{traffic.delay_minutes} min</div>
          </div>
          {traffic.routes && traffic.routes.slice(0, 2).map((route, i) => (
            <div className="traffic-route" key={i}>
              <div className="route-name">{route.from} &rarr; {route.to}</div>
              <div className="route-time">via {route.via} &middot; {route.current_estimate} ({route.delay})</div>
            </div>
          ))}
          {traffic.transit_delays && traffic.transit_delays.map((delay, i) => (
            <div className="transit-delay" key={i}><Train size={14} /> {delay.mode} ({delay.line}) &mdash; {delay.delay} &middot; {delay.reason}</div>
          ))}
        </div>
      )}
    </div>
  )
}
