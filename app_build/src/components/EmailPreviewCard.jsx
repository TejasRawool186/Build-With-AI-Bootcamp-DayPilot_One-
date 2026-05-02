import { useState } from 'react'
import { Mail, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function EmailPreviewCard({ preview, planData, userName }) {
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const handleSendEmail = async () => {
    const email = planData?.email || prompt('Enter your email address:')
    if (!email) return
    setSending(true)
    setStatus(null)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_name: userName, plan_data: planData })
      })
      const data = await response.json()
      setStatus({ type: data.success ? 'success' : 'error', message: data.message })
    } catch (err) {
      setStatus({ type: 'error', message: `Failed to send: ${err.message}` })
    } finally { setSending(false) }
  }

  if (!preview) return null
  return (
    <div className="glass-card email-card">
      <div className="card-header">
        <Mail size={18} className="card-icon-svg" />
        <span className="card-title">Email Briefing Preview</span>
      </div>
      <div className="email-preview-box">{preview}</div>
      <div className="email-actions">
        <button id="send-email-btn" className="generate-btn" style={{ width: 'auto', padding: '12px 24px', background: 'var(--pastel-mint)', color: 'var(--accent-mint)' }} onClick={handleSendEmail} disabled={sending}>
          {sending ? (<><Loader2 size={18} className="spin-icon" /> Sending...</>) : (<><Send size={18} /> Send Email Briefing</>)}
        </button>
        {status && (
          <span className={`email-status ${status.type}`}>
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {status.message}
          </span>
        )}
      </div>
    </div>
  )
}
