"""
Weather Agent — Fetches real weather data using OpenWeatherMap API.
Falls back to intelligent mock data if API is unavailable.
"""

import os
import requests


# Weather condition to emoji mapping
WEATHER_ICONS = {
    "clear sky": "☀️",
    "few clouds": "🌤",
    "scattered clouds": "⛅",
    "broken clouds": "☁️",
    "overcast clouds": "☁️",
    "shower rain": "🌦",
    "rain": "🌧",
    "light rain": "🌦",
    "moderate rain": "🌧",
    "heavy intensity rain": "🌧",
    "thunderstorm": "⛈",
    "snow": "❄️",
    "mist": "🌫",
    "haze": "🌫",
    "fog": "🌫",
    "drizzle": "🌦",
    "light intensity drizzle": "🌦",
}


def get_weather(city="Mumbai"):
    """
    Fetches current weather data for the given city.
    Uses OpenWeatherMap API if key is available, otherwise returns mock data.
    """
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if api_key:
        return _fetch_real_weather(city, api_key)
    else:
        return _get_mock_weather(city)


def _fetch_real_weather(city, api_key):
    """Fetch real weather data from OpenWeatherMap API."""
    try:
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": api_key,
            "units": "metric"
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        weather_desc = data["weather"][0]["description"]
        icon = WEATHER_ICONS.get(weather_desc, "🌡")
        temp = round(data["main"]["temp"])
        humidity = data["main"]["humidity"]
        wind = round(data["wind"]["speed"] * 3.6, 1)  # Convert m/s to km/h
        feels_like = round(data["main"]["feels_like"])

        # Determine severity
        severity = "normal"
        if "rain" in weather_desc or "storm" in weather_desc:
            severity = "warning"
        if "heavy" in weather_desc or "thunderstorm" in weather_desc:
            severity = "danger"

        return {
            "city": city,
            "condition": weather_desc.title(),
            "temperature": f"{temp}°C",
            "feels_like": f"{feels_like}°C",
            "humidity": f"{humidity}%",
            "wind_speed": f"{wind} km/h",
            "icon": icon,
            "severity": severity,
            "description": _generate_weather_description(weather_desc, temp, humidity),
            "source": "OpenWeatherMap (Live)",
            "raw_temp": temp,
            "raw_humidity": humidity
        }

    except Exception as e:
        print(f"[!] Weather API error: {e}. Using mock data.")
        return _get_mock_weather(city)


def _get_mock_weather(city):
    """Returns realistic mock weather data."""
    return {
        "city": city,
        "condition": "Heavy Rain",
        "temperature": "28°C",
        "feels_like": "32°C",
        "humidity": "85%",
        "wind_speed": "25 km/h",
        "icon": "🌧",
        "severity": "warning",
        "description": "Heavy rain expected throughout the afternoon. Carry an umbrella and plan for delays.",
        "source": "Mock Data (API key not configured)",
        "raw_temp": 28,
        "raw_humidity": 85
    }


def _generate_weather_description(condition, temp, humidity):
    """Generate a human-friendly weather description."""
    parts = []

    if "rain" in condition:
        parts.append("Rain expected — carry an umbrella")
    if "storm" in condition:
        parts.append("Thunderstorms possible — avoid outdoor activities")
    if "clear" in condition:
        parts.append("Clear skies — great day for outdoor activities")
    if "cloud" in condition:
        parts.append("Overcast conditions")
    if "haze" in condition or "mist" in condition or "fog" in condition:
        parts.append("Low visibility — drive carefully")

    if temp > 35:
        parts.append("Extreme heat — stay hydrated")
    elif temp > 30:
        parts.append("Warm weather — stay hydrated")

    if humidity > 80:
        parts.append("High humidity — may feel uncomfortable outdoors")

    return ". ".join(parts) if parts else f"Current conditions: {condition.title()}"
