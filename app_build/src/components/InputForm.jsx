import { useState } from 'react'
import { User, MapPin, Mail, Sparkles, Loader2 } from 'lucide-react'

export default function InputForm({ onSubmit, isLoading }) {
  const [name, setName] = useState('Tejas')
  const [city, setCity] = useState('Mumbai')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ user_name: name, city: city, email: email })
  }

  return (
    <div className="input-form">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="input-name"><User size={14} /> Your Name</label>
            <input id="input-name" className="form-input" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="input-city"><MapPin size={14} /> Your City</label>
            <input id="input-city" className="form-input" type="text" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="input-email"><Mail size={14} /> Email (optional)</label>
            <input id="input-email" className="form-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <button id="generate-btn" className="generate-btn" type="submit" disabled={isLoading}>
          {isLoading ? (<><Loader2 size={18} className="spin-icon" /> Analyzing your day...</>) : (<><Sparkles size={18} /> Generate My Day Plan</>)}
        </button>
      </form>
    </div>
  )
}
