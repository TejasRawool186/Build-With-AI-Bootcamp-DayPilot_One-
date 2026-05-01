import { useState } from 'react'

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
        body: JSON.stringify({
          email,
          user_name: userName,
          plan_data: planData
        })
      })

      const data = await response.json()
      setStatus({
        type: data.success ? 'success' : 'error',
        message: data.message
      })
    } catch (err) {
      setStatus({
        type: 'error',
        message: `Failed to send: ${err.message}`
      })
    } finally {
      setSending(false)
    }
  }

  if (!preview) return null

  return (
    <div className="glass-card email-card">
      <div className="card-header">
        <span className="card-icon">📩</span>
        <span className="card-title">Email Briefing Preview</span>
      </div>

      <div className="email-preview-box">{preview}</div>

      <div className="email-actions">
        <button
          id="send-email-btn"
          className="send-email-btn"
          onClick={handleSendEmail}
          disabled={sending}
        >
          {sending ? (
            <>
              <div className="btn-spinner" style={{ width: 16, height: 16 }} />
              Sending...
            </>
          ) : (
            <>📤 Send Email Briefing</>
          )}
        </button>

        {status && (
          <span className={`email-status ${status.type}`}>
            {status.type === 'success' ? '✅' : '❌'} {status.message}
          </span>
        )}
      </div>
    </div>
  )
}
