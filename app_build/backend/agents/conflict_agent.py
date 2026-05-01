"""
Conflict Agent — Detects scheduling conflicts (overlapping meetings).
Also checks for holiday/event awareness.
"""

from datetime import datetime, timedelta


# Known holidays (Indian calendar)
HOLIDAYS = {
    "01-26": "Republic Day",
    "03-14": "Holi",
    "08-15": "Independence Day",
    "10-02": "Gandhi Jayanti",
    "10-24": "Dussehra",
    "11-12": "Diwali",
    "12-25": "Christmas",
}


def detect_conflicts(schedule_data):
    """
    Analyze schedule for overlapping events and potential issues.
    Returns list of conflicts and warnings.
    """
    events = schedule_data.get("events", [])
    conflicts = []
    warnings = []

    # Check for time overlaps
    for i in range(len(events)):
        for j in range(i + 1, len(events)):
            overlap = _check_overlap(events[i], events[j])
            if overlap:
                conflicts.append(overlap)

    # Check for back-to-back meetings with no travel time
    for i in range(len(events) - 1):
        gap_issue = _check_travel_gap(events[i], events[i + 1])
        if gap_issue:
            warnings.append(gap_issue)

    # Check for holiday
    holiday = _check_holiday()
    if holiday:
        warnings.append(holiday)

    # Check for too many meetings
    meeting_count = sum(1 for e in events if e.get("type") == "meeting")
    if meeting_count >= 4:
        warnings.append({
            "type": "overload",
            "icon": "😰",
            "message": f"You have {meeting_count} meetings today. Consider blocking focus time.",
            "severity": "info"
        })

    return {
        "conflicts": conflicts,
        "warnings": warnings,
        "total_conflicts": len(conflicts),
        "total_warnings": len(warnings)
    }


def _check_overlap(event1, event2):
    """Check if two events overlap in time."""
    try:
        time1 = datetime.strptime(event1["time"], "%I:%M %p")
        time2 = datetime.strptime(event2["time"], "%I:%M %p")

        # Parse duration
        dur1 = _parse_duration(event1.get("duration", "30 mins"))
        dur2 = _parse_duration(event2.get("duration", "30 mins"))

        end1 = time1 + timedelta(minutes=dur1)
        end2 = time2 + timedelta(minutes=dur2)

        # Check overlap
        if time1 < end2 and time2 < end1:
            overlap_start = max(time1, time2)
            overlap_end = min(end1, end2)
            overlap_mins = int((overlap_end - overlap_start).total_seconds() / 60)

            if overlap_mins > 0:
                return {
                    "event1": event1["event"],
                    "event1_time": event1["time"],
                    "event2": event2["event"],
                    "event2_time": event2["time"],
                    "overlap_minutes": overlap_mins,
                    "icon": "⚠️",
                    "message": f"'{event1['event']}' ({event1['time']}) overlaps with '{event2['event']}' ({event2['time']}) by {overlap_mins} minutes",
                    "suggestion": f"Consider rescheduling '{event2['event']}' to after {end1.strftime('%I:%M %p')}"
                }
    except (ValueError, KeyError):
        pass

    return None


def _check_travel_gap(event1, event2):
    """Check if there's enough time to travel between consecutive events."""
    try:
        time1 = datetime.strptime(event1["time"], "%I:%M %p")
        time2 = datetime.strptime(event2["time"], "%I:%M %p")
        dur1 = _parse_duration(event1.get("duration", "30 mins"))
        end1 = time1 + timedelta(minutes=dur1)

        gap_minutes = int((time2 - end1).total_seconds() / 60)

        # Check if locations are different and gap is too short
        loc1 = event1.get("location", "").lower()
        loc2 = event2.get("location", "").lower()
        virtual_keywords = ["virtual", "zoom", "google meet", "teams", "home"]

        both_physical = (
            not any(kw in loc1 for kw in virtual_keywords) and
            not any(kw in loc2 for kw in virtual_keywords)
        )

        if both_physical and loc1 != loc2 and 0 < gap_minutes < 30:
            return {
                "type": "travel_gap",
                "icon": "🏃",
                "message": f"Only {gap_minutes} mins between '{event1['event']}' and '{event2['event']}' at different locations",
                "severity": "warning",
                "suggestion": "You may not have enough travel time"
            }
    except (ValueError, KeyError):
        pass

    return None


def _check_holiday():
    """Check if today is a known holiday."""
    today = datetime.now().strftime("%m-%d")
    if today in HOLIDAYS:
        return {
            "type": "holiday",
            "icon": "🎉",
            "message": f"Today is {HOLIDAYS[today]}! Consider adjusting your schedule.",
            "severity": "info"
        }
    return None


def _parse_duration(duration_str):
    """Parse duration string like '1 hour', '30 mins', '1.5 hours' into minutes."""
    duration_str = duration_str.lower().strip()
    if "hour" in duration_str:
        try:
            hours = float(duration_str.split()[0])
            return int(hours * 60)
        except (ValueError, IndexError):
            return 60
    elif "min" in duration_str:
        try:
            return int(duration_str.split()[0])
        except (ValueError, IndexError):
            return 30
    return 30
