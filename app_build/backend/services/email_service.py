"""
Email Service — Sends the daily briefing email via SMTP.
Supports Gmail and other SMTP providers.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def generate_email_content(user_name, schedule, weather, traffic, suggestions, alerts):
    """
    Generate a beautifully formatted email briefing.
    Returns both plain text and HTML versions.
    """
    # Build plain text version
    text_lines = [
        f"Good Morning {user_name} ☀️",
        "",
        "═══════════════════════════════════",
        "📅 YOUR DAY AT A GLANCE",
        "═══════════════════════════════════",
        ""
    ]

    # Schedule
    for event in schedule.get("events", [])[:5]:
        text_lines.append(f"  {event['time']} — {event['event']}")
        text_lines.append(f"  📍 {event['location']}")
        text_lines.append("")

    # Weather
    text_lines.extend([
        "───────────────────────────────────",
        "🌍 CONDITIONS",
        "───────────────────────────────────",
        f"  {weather.get('icon', '🌡')} {weather.get('condition', 'N/A')} | {weather.get('temperature', 'N/A')}",
        f"  💧 Humidity: {weather.get('humidity', 'N/A')}",
        f"  🚦 Traffic: {traffic.get('overall_level', 'N/A')} ({traffic.get('delay_minutes', 0)} min delay)",
        ""
    ])

    # Suggestions
    if suggestions:
        text_lines.extend([
            "───────────────────────────────────",
            "👉 AI SUGGESTIONS",
            "───────────────────────────────────"
        ])
        for suggestion in suggestions[:4]:
            text_lines.append(f"  • {suggestion}")
        text_lines.append("")

    # Alerts
    if alerts:
        text_lines.extend([
            "───────────────────────────────────",
            "⚠️ ALERTS",
            "───────────────────────────────────"
        ])
        for alert in alerts[:4]:
            text_lines.append(f"  {alert.get('icon', '⚠️')} {alert.get('message', '')}")
        text_lines.append("")

    text_lines.extend([
        "═══════════════════════════════════",
        "Have a great day!",
        "— DayPilot One 🤖",
        "",
        '"One AI. Your Entire Day — Planned Smarter."'
    ])

    plain_text = "\n".join(text_lines)

    # Build HTML version
    html = _build_html_email(user_name, schedule, weather, traffic, suggestions, alerts)

    return {
        "plain_text": plain_text,
        "html": html,
        "subject": f"☀️ DayPilot One — Your Day Plan for {schedule.get('date', 'Today')}"
    }


def send_email(to_email, email_content):
    """
    Send the daily briefing email via SMTP.
    Returns success status and message.
    """
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not smtp_email or not smtp_password:
        return {
            "success": False,
            "message": "Email not configured. Set SMTP_EMAIL and SMTP_PASSWORD in .env file.",
            "preview": email_content["plain_text"]
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = email_content["subject"]
        msg["From"] = f"DayPilot One <{smtp_email}>"
        msg["To"] = to_email

        # Attach both plain text and HTML
        msg.attach(MIMEText(email_content["plain_text"], "plain"))
        msg.attach(MIMEText(email_content["html"], "html"))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.send_message(msg)

        return {
            "success": True,
            "message": f"📩 Daily briefing sent to {to_email}!",
            "preview": email_content["plain_text"]
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send email: {str(e)}",
            "preview": email_content["plain_text"]
        }


def _build_html_email(user_name, schedule, weather, traffic, suggestions, alerts):
    """Generate a styled HTML email."""
    events_html = ""
    for event in schedule.get("events", [])[:5]:
        priority_color = {"high": "#ef4444", "medium": "#f59e0b", "low": "#22c55e"}.get(event.get("priority", "medium"), "#f59e0b")
        events_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #2d2d3f;">
                <span style="color: {priority_color}; font-weight: bold;">{event['time']}</span>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #2d2d3f;">
                <strong style="color: #e2e8f0;">{event['event']}</strong><br>
                <span style="color: #94a3b8; font-size: 13px;">📍 {event['location']}</span>
            </td>
        </tr>"""

    suggestions_html = ""
    for s in (suggestions or [])[:4]:
        suggestions_html += f'<li style="padding: 6px 0; color: #e2e8f0;">{s}</li>'

    alerts_html = ""
    for a in (alerts or [])[:4]:
        alerts_html += f'<div style="padding: 8px 12px; background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; margin: 6px 0; border-radius: 4px; color: #fca5a5;">{a.get("icon", "⚠️")} {a.get("message", "")}</div>'

    return f"""
    <html>
    <body style="margin: 0; padding: 0; background: #0f0f23; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 24px;">🧭 DayPilot One</h1>
                <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Good Morning, {user_name}! ☀️</p>
            </div>

            <div style="padding: 24px;">
                <h2 style="color: #818cf8; font-size: 16px; margin-top: 0;">📅 Today's Schedule</h2>
                <table style="width: 100%; border-collapse: collapse;">{events_html}</table>

                <h2 style="color: #818cf8; font-size: 16px; margin-top: 24px;">🌍 Conditions</h2>
                <div style="background: #16162a; border-radius: 8px; padding: 16px;">
                    <p style="margin: 4px 0; color: #e2e8f0;">{weather.get('icon', '🌡')} {weather.get('condition', 'N/A')} — {weather.get('temperature', 'N/A')}</p>
                    <p style="margin: 4px 0; color: #94a3b8;">💧 Humidity: {weather.get('humidity', 'N/A')} | 💨 Wind: {weather.get('wind_speed', 'N/A')}</p>
                    <p style="margin: 4px 0; color: #e2e8f0;">🚦 Traffic: {traffic.get('overall_level', 'N/A')} (est. +{traffic.get('delay_minutes', 0)} min)</p>
                </div>

                <h2 style="color: #818cf8; font-size: 16px; margin-top: 24px;">👉 AI Suggestions</h2>
                <ul style="padding-left: 20px;">{suggestions_html}</ul>

                {"<h2 style='color: #818cf8; font-size: 16px; margin-top: 24px;'>⚠️ Alerts</h2>" + alerts_html if alerts else ""}
            </div>

            <div style="padding: 20px; text-align: center; background: #16162a; border-top: 1px solid #2d2d3f;">
                <p style="margin: 0; color: #64748b; font-size: 13px;">Have a great day! — DayPilot One 🤖</p>
                <p style="margin: 4px 0 0; color: #475569; font-size: 11px; font-style: italic;">"One AI. Your Entire Day — Planned Smarter."</p>
            </div>
        </div>
    </body>
    </html>"""
