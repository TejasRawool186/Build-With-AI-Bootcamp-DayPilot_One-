import { Compass } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-greeting">
          <h1 className="header-title">Good Morning</h1>
          <p className="header-tagline">One AI. Your Entire Day  Planned Smarter.</p>
        </div>
        <div className="header-badge">
          <span className="dot" />
          <span>Agentic AI  Powered by Gemini</span>
        </div>
      </div>
    </header>
  )
}
