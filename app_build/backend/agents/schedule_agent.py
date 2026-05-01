"""
Schedule Agent — Fetches the user's daily schedule.
Uses mock data that simulates a realistic day with varied events.
Can be swapped for Google Calendar API integration.
"""

from datetime import datetime, timedelta
import random


def get_todays_schedule():
    """
    Returns a realistic mock schedule for today.
    Each event has time, title, location, duration, and type.
    """
    today = datetime.now().strftime("%A, %B %d, %Y")

    # Realistic schedule templates — rotates based on day of week
    schedules = [
        # Busy workday
        [
            {
                "time": "09:00 AM",
                "event": "Morning Standup",
                "location": "Office - Andheri East",
                "duration": "30 mins",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "10:00 AM",
                "event": "Client Presentation",
                "location": "WeWork BKC",
                "duration": "1 hour",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "10:45 AM",
                "event": "Team Sync Call",
                "location": "Virtual (Google Meet)",
                "duration": "45 mins",
                "type": "meeting",
                "priority": "medium"
            },
            {
                "time": "12:30 PM",
                "event": "Lunch with Mentor",
                "location": "Cafe Leopold, Colaba",
                "duration": "1 hour",
                "type": "personal",
                "priority": "medium"
            },
            {
                "time": "02:30 PM",
                "event": "Sprint Planning",
                "location": "Office - Andheri East",
                "duration": "1.5 hours",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "05:00 PM",
                "event": "Gym Session",
                "location": "Gold's Gym, Andheri West",
                "duration": "1 hour",
                "type": "personal",
                "priority": "low"
            }
        ],
        # Moderate day
        [
            {
                "time": "09:30 AM",
                "event": "Team Standup",
                "location": "Office - Powai",
                "duration": "30 mins",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "11:00 AM",
                "event": "Code Review Session",
                "location": "Virtual (Zoom)",
                "duration": "1 hour",
                "type": "meeting",
                "priority": "medium"
            },
            {
                "time": "01:00 PM",
                "event": "Doctor Appointment",
                "location": "Hiranandani Hospital, Powai",
                "duration": "45 mins",
                "type": "personal",
                "priority": "high"
            },
            {
                "time": "03:00 PM",
                "event": "Project Demo",
                "location": "Office - Powai",
                "duration": "1 hour",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "06:00 PM",
                "event": "Evening Walk",
                "location": "Powai Lake",
                "duration": "45 mins",
                "type": "personal",
                "priority": "low"
            }
        ],
        # Light day
        [
            {
                "time": "10:00 AM",
                "event": "Weekly All-Hands",
                "location": "Office - Lower Parel",
                "duration": "1 hour",
                "type": "meeting",
                "priority": "high"
            },
            {
                "time": "12:00 PM",
                "event": "Lunch Meeting with HR",
                "location": "Office Cafeteria",
                "duration": "45 mins",
                "type": "meeting",
                "priority": "medium"
            },
            {
                "time": "02:00 PM",
                "event": "Hackathon Prep",
                "location": "Home Office",
                "duration": "2 hours",
                "type": "work",
                "priority": "high"
            },
            {
                "time": "05:30 PM",
                "event": "Grocery Shopping",
                "location": "DMart, Lokhandwala",
                "duration": "1 hour",
                "type": "personal",
                "priority": "low"
            }
        ]
    ]

    # Pick schedule based on day-of-week for consistency in demos
    day_index = datetime.now().weekday() % len(schedules)
    schedule = schedules[day_index]

    return {
        "date": today,
        "total_events": len(schedule),
        "events": schedule
    }


def get_locations_from_schedule(schedule_data):
    """
    Extracts unique physical locations from the schedule
    (filters out virtual/home events).
    """
    locations = []
    virtual_keywords = ["virtual", "zoom", "google meet", "teams", "home"]

    for event in schedule_data["events"]:
        loc = event["location"].lower()
        if not any(kw in loc for kw in virtual_keywords):
            locations.append(event["location"])

    return list(set(locations))
