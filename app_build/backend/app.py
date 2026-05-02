"""
DayPilot One — Flask Backend Server
Agentic AI Daily Planning Assistant

Routes:
  GET  /api/health         — Health check
  GET  /api/schedule       — Get today's schedule
  GET  /api/weather        — Get weather for a city
  POST /api/generate-plan  — Generate full day plan (main agentic pipeline)
  POST /api/send-email     — Send daily briefing email
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

# Import agents
from agents.schedule_agent import get_todays_schedule, get_locations_from_schedule
from agents.weather_agent import get_weather
from agents.traffic_agent import analyze_traffic
from agents.conflict_agent import detect_conflicts
from agents.gemini_agent import analyze_and_suggest
from services.email_service import generate_email_content, send_email

# Initialize Flask app
app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "DayPilot One API",
        "version": "1.0.0"
    })


@app.route("/api/schedule", methods=["GET"])
def get_schedule():
    """Get today's schedule."""
    try:
        schedule = get_todays_schedule()
        return jsonify({"success": True, "data": schedule})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/weather", methods=["GET"])
def get_weather_data():
    """Get weather for a specific city."""
    city = request.args.get("city", "Mumbai")
    try:
        weather = get_weather(city)
        return jsonify({"success": True, "data": weather})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    """
    Main agentic pipeline — orchestrates all agents to generate a complete day plan.
    
    This is where the agentic behavior happens:
    1. OBSERVE  — Fetch schedule, weather, traffic data
    2. ANALYZE  — Detect conflicts, assess conditions
    3. REASON   — AI analyzes all data with multi-step reasoning
    4. ACT      — Generate suggestions, alerts, and email briefing
    """
    try:
        data = request.get_json() or {}
        user_name = data.get("user_name", "User")
        city = data.get("city", "Mumbai")
        email = data.get("email", "")

        pipeline_start = time.time()

        # ─── Step 1: OBSERVE — Fetch Schedule ───────────────────
        step1_start = time.time()
        schedule = get_todays_schedule()
        step1_time = round(time.time() - step1_start, 2)

        # ─── Step 2: OBSERVE — Fetch Weather ────────────────────
        step2_start = time.time()
        weather = get_weather(city)
        step2_time = round(time.time() - step2_start, 2)

        # ─── Step 3: OBSERVE — Analyze Traffic ──────────────────
        step3_start = time.time()
        traffic = analyze_traffic(weather)
        step3_time = round(time.time() - step3_start, 2)

        # ─── Step 4: ANALYZE — Detect Conflicts ────────────────
        step4_start = time.time()
        conflicts = detect_conflicts(schedule)
        step4_time = round(time.time() - step4_start, 2)

        # ─── Step 5: REASON — AI Analysis (Gemini) ─────────────
        step5_start = time.time()
        ai_analysis = analyze_and_suggest(schedule, weather, traffic, conflicts, user_name)
        step5_time = round(time.time() - step5_start, 2)

        # ─── Step 6: ACT — Generate Email Briefing ─────────────
        step6_start = time.time()
        email_content = generate_email_content(
            user_name, schedule, weather, traffic,
            ai_analysis.get("suggestions", []),
            ai_analysis.get("alerts", [])
        )
        step6_time = round(time.time() - step6_start, 2)

        total_time = round(time.time() - pipeline_start, 2)

        # ─── Compile Response ──────────────────────────────────
        response = {
            "success": True,
            "user_name": user_name,
            "email": email,
            "schedule": schedule,
            "weather": weather,
            "traffic": traffic,
            "conflicts": conflicts,
            "ai_reasoning": {
                "steps": ai_analysis.get("reasoning_steps", []),
                "summary": ai_analysis.get("summary", "")
            },
            "ai_suggestions": ai_analysis.get("suggestions", []),
            "alerts": ai_analysis.get("alerts", []),
            "daily_tip": ai_analysis.get("daily_tip", ""),
            "email_preview": email_content["plain_text"],
            "pipeline_metrics": {
                "total_time": f"{total_time}s",
                "steps": {
                    "schedule_fetch": f"{step1_time}s",
                    "weather_fetch": f"{step2_time}s",
                    "traffic_analysis": f"{step3_time}s",
                    "conflict_detection": f"{step4_time}s",
                    "ai_reasoning": f"{step5_time}s",
                    "email_generation": f"{step6_time}s"
                }
            }
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to generate day plan. Please try again."
        }), 500


@app.route("/api/send-email", methods=["POST"])
def send_email_briefing():
    """Send the daily briefing email to the user."""
    try:
        data = request.get_json() or {}
        to_email = data.get("email", "")
        user_name = data.get("user_name", "User")
        plan_data = data.get("plan_data", {})

        if not to_email:
            return jsonify({
                "success": False,
                "message": "Email address is required."
            }), 400

        # Generate email content from plan data
        email_content = generate_email_content(
            user_name,
            plan_data.get("schedule", {}),
            plan_data.get("weather", {}),
            plan_data.get("traffic", {}),
            plan_data.get("ai_suggestions", []),
            plan_data.get("alerts", [])
        )

        result = send_email(to_email, email_content)
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Email error: {str(e)}"
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    print("[DayPilot One] API Server")
    print(f"[*] Running on http://localhost:{port}")
    print(f"[*] Debug mode: {debug}")
    print("-" * 40)

    app.run(host="0.0.0.0", port=port, debug=debug)
