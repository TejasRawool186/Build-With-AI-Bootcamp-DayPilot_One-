"""
Email Service - Sends the daily briefing email via SMTP.
Professional design without emojis.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def generate_email_content(user_name, schedule, weather, traffic, suggestions, alerts):
    """Generate a professionally formatted email briefing."""
    text_lines = [
        f"Good Morning, {user_name}",
        "",
        "=" * 40,
        "YOUR DAY AT A GLANCE",
        "=" * 40,
        ""
    ]
    for event in schedule.get("events", [])[:5]:
        text_lines.append(f"  {event['time']}  {event['event']}")
        text_lines.append(f"  Location: {event['location']}")
        text_lines.append("")
    text_lines.extend([
        "-" * 40,
        "CONDITIONS",
        "-" * 40,
        f"  Weather: {weather.get('condition', 'N/A')} | {weather.get('temperature', 'N/A')}",
        f"  Humidity: {weather.get('humidity', 'N/A')}",
        f"  Traffic: {traffic.get('overall_level', 'N/A')} ({traffic.get('delay_minutes', 0)} min delay)",
        ""
    ])
    if suggestions:
        text_lines.extend(["-" * 40, "AI SUGGESTIONS", "-" * 40])
        for s in suggestions[:4]:
            text_lines.append(f"  * {s}")
        text_lines.append("")
    if alerts:
        text_lines.extend(["-" * 40, "ALERTS", "-" * 40])
        for a in alerts[:4]:
            text_lines.append(f"  ! {a.get('message', '')}")
        text_lines.append("")
    text_lines.extend([
        "=" * 40,
        "Have a great day!",
        "-- DayPilot One",
        "",
        "One AI. Your Entire Day -- Planned Smarter."
    ])
    plain_text = "\n".join(text_lines)
    html = _build_html_email(user_name, schedule, weather, traffic, suggestions, alerts)
    return {
        "plain_text": plain_text,
        "html": html,
        "subject": f"DayPilot One -- Your Day Plan for {schedule.get('date', 'Today')}"
    }


def send_email(to_email, email_content):
    """Send the daily briefing email via SMTP."""
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
        msg.attach(MIMEText(email_content["plain_text"], "plain"))
        msg.attach(MIMEText(email_content["html"], "html"))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.send_message(msg)

        return {
            "success": True,
            "message": f"Daily briefing sent to {to_email}!",
            "preview": email_content["plain_text"]
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send email: {str(e)}",
            "preview": email_content["plain_text"]
        }


def _build_html_email(user_name, schedule, weather, traffic, suggestions, alerts):
    """Generate a professional, artistic HTML email without emojis."""
    events_html = ""
    for event in schedule.get("events", [])[:5]:
        pc = {"high": "#DC2626", "medium": "#D97706", "low": "#16A34A"}.get(event.get("priority", "medium"), "#D97706")
        events_html += f"""
        <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #F1F0EC;">
                <span style="color:{pc};font-weight:700;font-size:13px;font-family:'Courier New',monospace;">{event['time']}</span>
            </td>
            <td style="padding:12px 16px;border-bottom:1px solid #F1F0EC;">
                <strong style="color:#1E293B;font-size:14px;">{event['event']}</strong><br>
                <span style="color:#94A3B8;font-size:12px;">{event['location']}</span>
            </td>
        </tr>"""

    suggestions_html = ""
    for i, s in enumerate((suggestions or [])[:4], 1):
        suggestions_html += f"""
        <tr>
            <td style="padding:8px 16px;border-bottom:1px solid #F1F0EC;">
                <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:white;text-align:center;line-height:22px;font-size:11px;font-weight:700;">{i}</span>
            </td>
            <td style="padding:8px 16px;border-bottom:1px solid #F1F0EC;color:#1E293B;font-size:13px;">{s}</td>
        </tr>"""

    alerts_html = ""
    for a in (alerts or [])[:4]:
        alerts_html += f"""
        <div style="padding:10px 14px;background:#FFF5F5;border-left:3px solid #DC2626;margin:6px 0;border-radius:0 6px 6px 0;color:#991B1B;font-size:13px;">
            {a.get("message", "")}
        </div>"""

    return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 50%,#9333EA 100%);padding:36px 32px;text-align:center;">
        <h1 style="margin:0;color:white;font-size:22px;font-weight:800;letter-spacing:-0.02em;">DayPilot One</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Good Morning, {user_name}</p>
        <div style="margin-top:12px;display:inline-block;padding:4px 14px;background:rgba(255,255,255,0.15);border-radius:20px;color:rgba(255,255,255,0.9);font-size:11px;">Your Daily Briefing</div>
    </div>

    <div style="padding:28px 32px;">

        <!-- Schedule -->
        <h2 style="color:#6366F1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;border-bottom:2px solid #F1F0EC;padding-bottom:8px;">Today's Schedule</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">{events_html}</table>

        <!-- Conditions -->
        <h2 style="color:#6366F1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;border-bottom:2px solid #F1F0EC;padding-bottom:8px;">Conditions</h2>
        <div style="background:#F8F5F0;border-radius:10px;padding:16px;margin-bottom:24px;">
            <table style="width:100%;">
                <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:12px;width:100px;">Weather</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:13px;font-weight:600;">{weather.get('condition', 'N/A')} &mdash; {weather.get('temperature', 'N/A')}</td>
                </tr>
                <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:12px;">Humidity</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:13px;">{weather.get('humidity', 'N/A')}</td>
                </tr>
                <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:12px;">Wind</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:13px;">{weather.get('wind_speed', 'N/A')}</td>
                </tr>
                <tr>
                    <td style="padding:4px 0;color:#64748B;font-size:12px;">Traffic</td>
                    <td style="padding:4px 0;color:#1E293B;font-size:13px;font-weight:600;">{traffic.get('overall_level', 'N/A')} (est. +{traffic.get('delay_minutes', 0)} min)</td>
                </tr>
            </table>
        </div>

        <!-- Suggestions -->
        <h2 style="color:#6366F1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;border-bottom:2px solid #F1F0EC;padding-bottom:8px;">AI Suggestions</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">{suggestions_html}</table>

        <!-- Alerts -->
        {"<h2 style='color:#6366F1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;border-bottom:2px solid #F1F0EC;padding-bottom:8px;'>Alerts</h2>" + alerts_html if alerts else ""}

    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#F8F5F0;border-top:1px solid #F1F0EC;text-align:center;">
        <p style="margin:0;color:#94A3B8;font-size:12px;">Have a great day! &mdash; DayPilot One</p>
        <p style="margin:4px 0 0;color:#CBD5E1;font-size:10px;font-style:italic;">One AI. Your Entire Day &mdash; Planned Smarter.</p>
    </div>

</div>
</body>
</html>"""
