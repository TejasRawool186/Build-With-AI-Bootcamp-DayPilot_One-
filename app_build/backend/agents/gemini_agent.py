"""
Gemini Agent — The AI reasoning engine.
Uses Google Gemini API to analyze all collected data and generate
intelligent suggestions with transparent reasoning steps.
"""

import os
import json

# Use the new google.genai SDK
from google import genai
from google.genai import types


def analyze_and_suggest(schedule_data, weather_data, traffic_data, conflict_data, user_name="User"):
    """
    Send all agent data to Gemini for multi-step reasoning and suggestion generation.
    Returns structured AI analysis with reasoning steps.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return _get_fallback_analysis(schedule_data, weather_data, traffic_data, conflict_data, user_name)

    try:
        client = genai.Client(api_key=api_key)

        prompt = _build_prompt(schedule_data, weather_data, traffic_data, conflict_data, user_name)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        result_text = response.text

        # Try to parse JSON from Gemini response
        parsed = _parse_gemini_response(result_text)
        if parsed:
            return parsed

        # If parsing fails, return structured fallback with Gemini's text
        return _get_fallback_analysis(
            schedule_data, weather_data, traffic_data, conflict_data, user_name,
            gemini_text=result_text
        )

    except Exception as e:
        print(f"[!] Gemini API error: {e}. Using fallback analysis.")
        return _get_fallback_analysis(schedule_data, weather_data, traffic_data, conflict_data, user_name)


def _build_prompt(schedule, weather, traffic, conflicts, user_name):
    """Build a detailed prompt for Gemini with all agent data."""
    return f"""You are DayPilot One, an agentic AI daily planning assistant. Analyze the following data about {user_name}'s day and provide intelligent recommendations.

## Today's Schedule
{json.dumps(schedule, indent=2)}

## Weather Conditions
{json.dumps(weather, indent=2)}

## Traffic Conditions
{json.dumps(traffic, indent=2)}

## Schedule Conflicts
{json.dumps(conflicts, indent=2)}

## Your Task
Analyze all data using multi-step reasoning and respond with ONLY valid JSON in this exact format:

{{
  "reasoning_steps": [
    {{
      "step": 1,
      "title": "Schedule Analysis",
      "detail": "<analyze the schedule - count events, identify key ones, note locations>"
    }},
    {{
      "step": 2,
      "title": "Weather Assessment",
      "detail": "<analyze weather impact on the day's plans>"
    }},
    {{
      "step": 3,
      "title": "Traffic Evaluation",
      "detail": "<analyze traffic and its impact on commute>"
    }},
    {{
      "step": 4,
      "title": "Conflict Check",
      "detail": "<identify any scheduling conflicts or issues>"
    }},
    {{
      "step": 5,
      "title": "Final Decision",
      "detail": "<synthesize all findings into actionable recommendation>"
    }}
  ],
  "summary": "<one-line summary of key recommendation>",
  "suggestions": [
    "<specific actionable suggestion 1>",
    "<specific actionable suggestion 2>",
    "<specific actionable suggestion 3>",
    "<specific actionable suggestion 4>"
  ],
  "alerts": [
    {{
      "type": "<weather|traffic|conflict|general>",
      "icon": "<appropriate emoji>",
      "message": "<alert message>"
    }}
  ],
  "daily_tip": "<a motivational or practical tip for the day>"
}}

Be specific with times, locations, and actionable advice. Reference actual data from the inputs. Keep the tone friendly but professional."""


def _parse_gemini_response(text):
    """Try to extract and parse JSON from Gemini's response."""
    try:
        # Try direct JSON parse
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to find JSON block in markdown code fences
    import re
    json_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass

    # Try to find JSON object pattern
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            pass

    return None


def _get_fallback_analysis(schedule, weather, traffic, conflicts, user_name, gemini_text=None):
    """
    Generate intelligent analysis without Gemini API.
    Uses rule-based logic for demonstration purposes.
    """
    events = schedule.get("events", [])
    event_count = len(events)
    weather_condition = weather.get("condition", "Clear").lower()
    traffic_level = traffic.get("overall_level", "Light")
    conflict_list = conflicts.get("conflicts", [])

    # Build reasoning steps
    steps = [
        {
            "step": 1,
            "title": "Schedule Analysis",
            "detail": f"Found {event_count} events today for {user_name}. "
                      f"{sum(1 for e in events if e.get('type') == 'meeting')} meetings and "
                      f"{sum(1 for e in events if e.get('type') == 'personal')} personal events. "
                      f"First event at {events[0]['time']} -- {events[0]['event']} at {events[0]['location']}."
                      if events else "No events scheduled for today."
        },
        {
            "step": 2,
            "title": "Weather Assessment",
            "detail": f"Weather: {weather.get('condition', 'Unknown')} at {weather.get('temperature', 'N/A')}. "
                      f"Humidity at {weather.get('humidity', 'N/A')}. "
                      f"{weather.get('description', '')}"
        },
        {
            "step": 3,
            "title": "Traffic Evaluation",
            "detail": f"Traffic level: {traffic_level}. "
                      f"Expected delay: {traffic.get('delay_minutes', 0)} minutes. "
                      f"Weather impact on traffic: {traffic.get('weather_impact', 'None')}. "
                      f"{traffic.get('suggestion', '')}"
        },
        {
            "step": 4,
            "title": "Conflict Check",
            "detail": f"Found {len(conflict_list)} scheduling conflict(s). " +
                      (conflict_list[0]["message"] if conflict_list else "No overlapping events detected.") +
                      f" {len(conflicts.get('warnings', []))} warning(s) noted."
        }
    ]

    # Build decision based on conditions
    decision_parts = []
    suggestions = []
    alerts = []

    if "rain" in weather_condition or "storm" in weather_condition:
        decision_parts.append("Rain/storms expected")
        suggestions.append("Carry an umbrella -- rain is expected today")
        alerts.append({"type": "weather", "icon": "🌧", "message": f"{weather.get('condition')} expected -- plan accordingly"})

    if traffic_level in ["Heavy", "Very Heavy"]:
        delay = traffic.get("delay_minutes", 20)
        decision_parts.append(f"heavy traffic (+{delay} min)")
        suggestions.append(f"Leave {delay + 10} minutes earlier than planned for your commute")
        alerts.append({"type": "traffic", "icon": "🚦", "message": f"Heavy traffic -- expect {delay} min delays"})

    if conflict_list:
        conflict = conflict_list[0]
        decision_parts.append("schedule conflict detected")
        suggestions.append(f"Reschedule '{conflict['event2']}' to avoid overlap with '{conflict['event1']}'")
        alerts.append({"type": "conflict", "icon": "⚠️", "message": conflict["message"]})

    # Transit delays
    transit_delays = traffic.get("transit_delays", [])
    for delay_info in transit_delays:
        alerts.append({
            "type": "transit",
            "icon": "🚆",
            "message": f"{delay_info['mode']} ({delay_info['line']}) running {delay_info['delay']} -- {delay_info['reason']}"
        })

    if events:
        suggestions.append(f"First event: {events[0]['event']} at {events[0]['time']} -- be ready!")

    # Default suggestions if none generated
    if not suggestions:
        suggestions = [
            "Your day looks clear -- great time for focused work!",
            "Stay hydrated throughout the day",
            "Keep your phone charged for back-to-back events"
        ]

    decision = " + ".join(decision_parts) if decision_parts else "Normal conditions"
    recommendation = f"-> {'Leave early, carry rain gear, and check for meeting conflicts' if len(decision_parts) > 1 else 'Minor adjustments recommended'}"

    steps.append({
        "step": 5,
        "title": "Final Decision",
        "detail": f"{decision} {recommendation}"
    })

    summary = f"{decision} -> {recommendation}" if decision_parts else "All clear -- have a productive day!"

    return {
        "reasoning_steps": steps,
        "summary": summary,
        "suggestions": suggestions,
        "alerts": alerts,
        "daily_tip": "Focus on your highest-priority task first thing in the morning for peak productivity!"
    }
