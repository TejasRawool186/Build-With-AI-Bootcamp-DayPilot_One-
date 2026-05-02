import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import RightPanel from './components/RightPanel'
import InputForm from './components/InputForm'
import ScheduleCard from './components/ScheduleCard'
import ConditionsCard from './components/ConditionsCard'
import AlertsCard from './components/AlertsCard'
import SuggestionsCard from './components/SuggestionsCard'
import ReasoningCard from './components/ReasoningCard'
import EmailPreviewCard from './components/EmailPreviewCard'
import TodoSection from './components/TodoSection'
import CalendarView from './components/CalendarView'
import { CalendarDays, Cloud, AlertTriangle, BrainCircuit, Mail, Loader2 } from 'lucide-react'

function loadTodos() {
  try { return JSON.parse(localStorage.getItem('daypilot_todos') || '[]') }
  catch { return [] }
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => { localStorage.setItem('daypilot_todos', JSON.stringify(todos)) }, [todos])

  const handleGenerate = async (formData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error(`Server error: ${response.status}`)
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to generate plan')
      setPlan(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="main-area">
        <Header />

        <main className="app-content">
          {activeView === 'dashboard' && (
            <>
              <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

              {error && (
                <div style={{ padding: '16px', background: 'var(--pastel-coral)', color: 'var(--text-dark)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <strong>Error:</strong> {error}
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
                </div>
              )}
            </>
          )}

          {activeView === 'tasks' && <TodoSection />}
          {activeView === 'calendar' && <CalendarView schedule={plan?.schedule} todos={todos} />}
        </main>
      </div>

      <RightPanel plan={plan} todos={todos} />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <Loader2 size={48} className="spin-icon" style={{ color: 'var(--accent-blue)', marginBottom: '16px' }} />
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>Crafting Your Day</h2>
            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Analyzing schedule, weather, and traffic...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
