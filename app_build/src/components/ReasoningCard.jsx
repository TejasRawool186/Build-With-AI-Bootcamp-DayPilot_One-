import { BrainCircuit, Target } from 'lucide-react'

export default function ReasoningCard({ reasoning }) {
  if (!reasoning) return null
  const { steps, summary } = reasoning
  return (
    <div className="glass-card reasoning-card">
      <div className="card-header">
        <BrainCircuit size={18} className="card-icon-svg" />
        <span className="card-title">AI Reasoning</span>
        <span className="card-badge badge-violet">{steps?.length || 0} steps</span>
      </div>
      <div className="reasoning-steps">
        {steps && steps.map((step, i) => (
          <div className="reasoning-step" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="step-number">{step.step || i + 1}</div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              <div className="step-detail">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
      {summary && (
        <div className="reasoning-summary">
          <Target size={16} className="summary-icon" />
          <div><span className="reasoning-summary-label">Conclusion:</span> {summary}</div>
        </div>
      )}
    </div>
  )
}
