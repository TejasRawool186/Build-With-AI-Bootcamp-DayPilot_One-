"""
Traffic Agent — Analyzes traffic conditions for the user's routes.
Uses intelligent mock data influenced by time-of-day and weather conditions.
"""

from datetime import datetime
import random


# Traffic patterns by hour (Mumbai-specific realism)
TRAFFIC_PATTERNS = {
    # hour: (base_level, base_delay_mins)
    7: ("Moderate", 15),
    8: ("Heavy", 25),
    9: ("Heavy", 30),
    10: ("Moderate", 20),
    11: ("Light", 10),
    12: ("Light", 10),
    13: ("Moderate", 15),
    14: ("Light", 10),
    15: ("Moderate", 15),
    16: ("Moderate", 20),
    17: ("Heavy", 30),
    18: ("Heavy", 35),
    19: ("Heavy", 25),
    20: ("Moderate", 15),
    21: ("Light", 10),
}

# Common Mumbai routes for realistic data
ROUTES = [
    {"from": "Dadar", "to": "Andheri", "via": "Western Express Highway", "normal_time": 35},
    {"from": "Bandra", "to": "BKC", "via": "Bandra Worli Sea Link", "normal_time": 15},
    {"from": "Powai", "to": "Lower Parel", "via": "JVLR + Sion-Panvel Highway", "normal_time": 45},
    {"from": "Andheri", "to": "Colaba", "via": "Western Express + Marine Drive", "normal_time": 55},
    {"from": "Thane", "to": "Andheri", "via": "Eastern Express Highway", "normal_time": 40},
]


def analyze_traffic(weather_data=None):
    """
    Generate traffic analysis based on current time and weather conditions.
    Weather impacts traffic (rain = more congestion).
    """
    current_hour = datetime.now().hour
    base_level, base_delay = TRAFFIC_PATTERNS.get(current_hour, ("Light", 10))

    # Weather impact multiplier
    weather_multiplier = 1.0
    weather_impact = "None"

    if weather_data:
        condition = weather_data.get("condition", "").lower()
        if "heavy rain" in condition or "thunderstorm" in condition:
            weather_multiplier = 1.8
            weather_impact = "Severe — heavy rain causing waterlogging and slowdowns"
        elif "rain" in condition or "drizzle" in condition:
            weather_multiplier = 1.4
            weather_impact = "Moderate — rain reducing visibility and speed"
        elif "fog" in condition or "mist" in condition or "haze" in condition:
            weather_multiplier = 1.3
            weather_impact = "Moderate — low visibility affecting traffic flow"

    adjusted_delay = int(base_delay * weather_multiplier)

    # Adjust level based on multiplier
    if weather_multiplier > 1.5:
        adjusted_level = "Very Heavy"
    elif weather_multiplier > 1.2 and base_level != "Heavy":
        adjusted_level = "Heavy" if base_level == "Moderate" else "Moderate"
    else:
        adjusted_level = base_level

    # Generate route-specific traffic
    route_traffic = []
    for route in random.sample(ROUTES, min(3, len(ROUTES))):
        route_delay = int(route["normal_time"] * (weather_multiplier - 1) + random.randint(-5, 10))
        route_delay = max(0, route_delay)
        estimated_time = route["normal_time"] + route_delay

        route_traffic.append({
            "from": route["from"],
            "to": route["to"],
            "via": route["via"],
            "normal_time": f"{route['normal_time']} mins",
            "current_estimate": f"{estimated_time} mins",
            "delay": f"+{route_delay} mins" if route_delay > 0 else "On time",
            "congestion": adjusted_level
        })

    # Determine if transit delays exist
    transit_delays = []
    if weather_multiplier > 1.3:
        transit_delays.append({
            "mode": "Local Train",
            "line": "Western Line",
            "delay": f"{random.randint(5, 15)} mins late",
            "reason": "Waterlogging on tracks" if "rain" in weather_data.get("condition", "").lower() else "Signal failure"
        })

    if random.random() > 0.6:
        transit_delays.append({
            "mode": "Metro",
            "line": "Line 1 (Versova-Ghatkopar)",
            "delay": f"{random.randint(3, 8)} mins late",
            "reason": "Technical maintenance"
        })

    return {
        "overall_level": adjusted_level,
        "delay_minutes": adjusted_delay,
        "weather_impact": weather_impact,
        "peak_hours": "8:00–10:00 AM, 5:00–8:00 PM",
        "routes": route_traffic,
        "transit_delays": transit_delays,
        "suggestion": _generate_traffic_suggestion(adjusted_level, adjusted_delay),
        "icon": _get_traffic_icon(adjusted_level)
    }


def _generate_traffic_suggestion(level, delay):
    """Generate actionable traffic suggestion."""
    if level in ["Very Heavy", "Heavy"]:
        return f"Heavy congestion expected. Leave {delay} minutes earlier than planned."
    elif level == "Moderate":
        return f"Moderate traffic. Consider leaving {delay} minutes early."
    else:
        return "Traffic is light. No adjustments needed."


def _get_traffic_icon(level):
    """Return appropriate icon for traffic level."""
    icons = {
        "Very Heavy": "🔴",
        "Heavy": "🟠",
        "Moderate": "🟡",
        "Light": "🟢"
    }
    return icons.get(level, "🟡")
