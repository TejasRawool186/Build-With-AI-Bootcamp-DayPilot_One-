import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import InputForm from './components/InputForm'
import ScheduleCard from './components/ScheduleCard'
import ConditionsCard from './components/ConditionsCard'
import AlertsCard from './components/AlertsCard'
import SuggestionsCard from './components/SuggestionsCard'
import ReasoningCard from './components/ReasoningCard'
import EmailPreviewCard from './components/EmailPreviewCard'
import TodoSection from './components/TodoSection'
import CalendarView from './components/CalendarView'
import Footer from './components/Footer'
import { CalendarDays, Cloud, AlertTriangle, BrainCircuit, Zap, Mail, CheckCircle2, Loader2 } from 'lucide-react'

function loadTodos() {
  try { return JSON.parse(localStorage.getItem('daypilot_todos') || '[]') }
  catch { return [] }
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => { localStorage.setItem('daypilot_todos', JSON.stringify(todos)) }, [todos])

  const handleGenerate = async (formData) => {
    setIsLoading(true)
    setError(null)
    setPlan(null)
    setLoadingStep(0)
    const stepTimer = setInterval(() => { setLoadingStep(prev => (prev < 5 ? prev + 1 : prev)) }, 800)
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to generate plan')
      clearInterval(stepTimer)
      setLoadingStep(6)
      setTimeout(() => { setPlan(data); setIsLoading(false) }, 400)
    } catch (err) {
      clearInterval(stepTimer)
      setError(err.message)
      setIsLoading(false)
    }
  }

  const loadingSteps = [
    { label: 'Fetching schedule...', Icon: CalendarDays },
    { label: 'Checking weather...', Icon: Cloud },
    { label: 'Analyzing traffic...', Icon: AlertTriangle },
    { label: 'Detecting conflicts...', Icon: AlertTriangle },
    { label: 'AI reasoning...', Icon: BrainCircuit },
    { label: 'Building briefing...', Icon: Mail },
  ]

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`main-area ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />

        <main className="app-content">
          {activeView === 'dashboard' && (
            <>
              <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

              {isLoading && (
                <div className="loading-overlay">
                  <Loader2 size={40} className="spin-icon loading-spinner" />
                  <div className="loading-text">Generating your day plan...</div>
                  <div className="loading-subtext">DayPilot One is analyzing your day</div>
                  <div className="loading-steps">
                    {loadingSteps.map((step, i) => (
                      <div key={i} className={`loading-step ${i < loadingStep ? 'done' : ''} ${i === loadingStep ? 'active' : ''}`}>
                        {i < loadingStep ? <CheckCircle2 size={16} /> : i === loadingStep ? <Loader2 size={16} className="spin-icon" /> : <span className="step-circle" />}
                        <step.Icon size={14} />
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="error-box">
                  <AlertTriangle size={20} />
                  <div><div className="error-title">Something went wrong</div><div className="error-message">{error}</div></div>
                </div>
              )}

              {plan && !isLoading && (
                <div className="results-dashboard">
                  <div className="dashboard-grid">
                    <ScheduleCard schedule={plan.schedule} />
                    <ConditionsCard weather={plan.weather} traffic={plan.traffic} />
                    <AlertsCard alerts={plan.alerts} conflicts={plan.conflicts} />
                    <SuggestionsCard suggestions={plan.ai_suggestions} dailyTip={plan.daily_tip} />
                    <ReasoningCard reasoning={plan.ai_reasoning} />
                    <EmailPreviewCard preview={plan.email_preview} planData={plan} userName={plan.user_name} />
                  </div>

                  {plan.pipeline_metrics && (
                    <div className="pipeline-metrics">
                      <div className="metrics-bar">
                        <div className="metric"><Zap size={14} /><span className="metric-label">Total:</span><span className="metric-value">{plan.pipeline_metrics.total_time}</span></div>
                        <div className="metric-divider" />
                        {Object.entries(plan.pipeline_metrics.steps).map(([key, val]) => (
                          <div className="metric" key={key}><span className="metric-label">{key.replace(/_/g, ' ')}:</span><span className="metric-value">{val}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeView === 'tasks' && <TodoSection />}
          {activeView === 'calendar' && <CalendarView schedule={plan?.schedule} todos={todos} />}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
