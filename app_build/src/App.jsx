import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import InputForm from './components/InputForm'
import ScheduleCard from './components/ScheduleCard'
import ConditionsCard from './components/ConditionsCard'
import AlertsCard from './components/AlertsCard'
import SuggestionsCard from './components/SuggestionsCard'
import ReasoningCard from './components/ReasoningCard'
import EmailPreviewCard from './components/EmailPreviewCard'
import Footer from './components/Footer'

function App() {
  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const handleGenerate = async (formData) => {
    setIsLoading(true)
    setError(null)
    setPlan(null)
    setLoadingStep(0)

    // Simulate step progression for loading UI
    const stepTimer = setInterval(() => {
      setLoadingStep(prev => (prev < 5 ? prev + 1 : prev))
    }, 800)

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate plan')
      }

      clearInterval(stepTimer)
      setLoadingStep(6)
      
      // Small delay for final loading step animation
      setTimeout(() => {
        setPlan(data)
        setIsLoading(false)
      }, 400)

    } catch (err) {
      clearInterval(stepTimer)
      setError(err.message)
      setIsLoading(false)
    }
  }

  const loadingSteps = [
    { label: 'Fetching schedule...', icon: '📅' },
    { label: 'Checking weather...', icon: '🌦' },
    { label: 'Analyzing traffic...', icon: '🚦' },
    { label: 'Detecting conflicts...', icon: '⚠️' },
    { label: 'AI reasoning...', icon: '🧠' },
    { label: 'Building briefing...', icon: '📩' },
  ]

  return (
    <div className="app">
      <Header />
      
      <main className="app-content">
        <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner-large" />
            <div className="loading-text">Generating your day plan...</div>
            <div className="loading-subtext">DayPilot One is analyzing your day</div>
            <div className="loading-steps">
              {loadingSteps.map((step, i) => (
                <div
                  key={i}
                  className={`loading-step ${i < loadingStep ? 'done' : ''} ${i === loadingStep ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <span>{i < loadingStep ? '✅' : i === loadingStep ? '⏳' : '○'}</span>
                  <span>{step.icon} {step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-box">
            <div className="error-title">⚠️ Something went wrong</div>
            <div className="error-message">{error}</div>
          </div>
        )}

        {/* Results Dashboard */}
        {plan && !isLoading && (
          <div className="results-dashboard">
            <div className="dashboard-grid">
              <ScheduleCard schedule={plan.schedule} />
              <ConditionsCard weather={plan.weather} traffic={plan.traffic} />
              <AlertsCard alerts={plan.alerts} conflicts={plan.conflicts} />
              <SuggestionsCard
                suggestions={plan.ai_suggestions}
                dailyTip={plan.daily_tip}
              />
              <ReasoningCard reasoning={plan.ai_reasoning} />
              <EmailPreviewCard
                preview={plan.email_preview}
                planData={plan}
                userName={plan.user_name}
              />
            </div>

            {/* Pipeline Metrics */}
            {plan.pipeline_metrics && (
              <div className="pipeline-metrics">
                <div className="metrics-bar">
                  <div className="metric">
                    <span className="metric-label">⚡ Total:</span>
                    <span className="metric-value">{plan.pipeline_metrics.total_time}</span>
                  </div>
                  <div className="metric-divider" />
                  {Object.entries(plan.pipeline_metrics.steps).map(([key, val]) => (
                    <div className="metric" key={key}>
                      <span className="metric-label">{key.replace(/_/g, ' ')}:</span>
                      <span className="metric-value">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
