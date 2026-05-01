# 🚀 DayPilot One — Agentic AI Daily Planning Assistant

> **Built for the Build With AI Bootcamp**

DayPilot One is an **agentic AI-powered daily planning assistant** that proactively analyzes your schedule, evaluates real-world conditions (weather, traffic), detects conflicts, and generates intelligent recommendations — all powered by **Google Gemini**.

Unlike simple chatbots, DayPilot One follows a true **agentic pipeline**: it autonomously _observes_, _analyzes_, _reasons_, and _acts_ to produce a complete daily briefing with zero manual prompting.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📅 **Smart Schedule Analysis** | Fetches and analyzes your daily events, meetings, and personal commitments |
| 🌦 **Live Weather Integration** | Real-time weather data via OpenWeatherMap API with severity assessment |
| 🚦 **Traffic Intelligence** | Weather-aware traffic analysis with delay estimates and transit alerts |
| ⚠️ **Conflict Detection** | Automatically detects overlapping events, tight gaps, and scheduling conflicts |
| 🧠 **AI Reasoning (Gemini)** | Multi-step transparent reasoning using Google Gemini 2.0 Flash |
| 📩 **Email Briefing** | One-click daily briefing email with formatted HTML and plain-text versions |
| ⚡ **Pipeline Metrics** | Real-time performance tracking for every agent step |

---

## 🏗 Architecture — The Agentic Pipeline

DayPilot One uses a **multi-agent architecture** where each agent is a specialized module that handles one responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│                     DayPilot One Pipeline                    │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Schedule  │  │ Weather  │  │ Traffic  │  │  Conflict  │  │
│  │  Agent    │  │  Agent   │  │  Agent   │  │   Agent    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │             │               │         │
│       ▼              ▼             ▼               ▼         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Gemini Agent (AI Reasoning)              │   │
│  │         Multi-step analysis & suggestion gen          │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Email Service (ACT phase)                │   │
│  │         Generate & send daily briefing email          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Stages

1. **OBSERVE** — Fetch schedule, weather, and traffic data in parallel
2. **ANALYZE** — Detect scheduling conflicts, assess weather severity
3. **REASON** — Gemini AI performs multi-step reasoning across all data
4. **ACT** — Generate actionable suggestions, alerts, and email briefing

---

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite 8 (fast HMR, modern build tooling)
- **Vanilla CSS** with CSS Variables, glassmorphism, gradients, and micro-animations
- **Lucide React** for vector iconography
- **Inter & JetBrains Mono** fonts for premium typography

### Backend
- **Python / Flask** REST API server
- **Flask-CORS** for cross-origin support
- **Google Gemini 2.0 Flash** (`google-genai` SDK) for AI reasoning
- **OpenWeatherMap API** for live weather data
- **SMTP (Gmail)** for email delivery

---

## 📂 Project Structure

```
DayPilot_One/
├── README.md                          # This file
├── production_artifacts/
│   └── Technical_Specification.md     # Project technical spec
│
└── app_build/                         # Main application
    ├── index.html                     # Entry HTML (Vite)
    ├── package.json                   # Node dependencies
    ├── vite.config.js                 # Vite config (dev proxy → Flask)
    │
    ├── src/                           # React frontend
    │   ├── main.jsx                   # App entry point
    │   ├── App.jsx                    # Root component + pipeline orchestration
    │   ├── App.css                    # Main application styles
    │   ├── index.css                  # Global design system & CSS variables
    │   └── components/
    │       ├── Header.jsx             # App header with branding
    │       ├── InputForm.jsx          # User input (name, city, email)
    │       ├── ScheduleCard.jsx       # Today's schedule display
    │       ├── ConditionsCard.jsx      # Weather + traffic conditions
    │       ├── AlertsCard.jsx         # Warnings and alerts
    │       ├── SuggestionsCard.jsx    # AI-generated suggestions
    │       ├── ReasoningCard.jsx      # Transparent AI reasoning steps
    │       ├── EmailPreviewCard.jsx   # Email preview + send action
    │       └── Footer.jsx            # App footer
    │
    └── backend/                       # Python Flask backend
        ├── app.py                     # Flask server + route definitions
        ├── requirements.txt           # Python dependencies
        ├── .env.example               # Environment variable template
        │
        ├── agents/                    # Autonomous agent modules
        │   ├── schedule_agent.py      # Fetches daily schedule (mock / API)
        │   ├── weather_agent.py       # Fetches weather (OpenWeatherMap)
        │   ├── traffic_agent.py       # Weather-aware traffic analysis
        │   ├── conflict_agent.py      # Schedule conflict detection
        │   └── gemini_agent.py        # Gemini AI reasoning engine
        │
        └── services/
            └── email_service.py       # HTML/plain-text email generation + SMTP
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Python** ≥ 3.10
- A **Google Gemini API Key** — [Get one free](https://aistudio.google.com/apikey)
- _(Optional)_ An **OpenWeatherMap API Key** — [Free tier](https://openweathermap.org/api)
- _(Optional)_ A **Gmail App Password** for email — [Generate here](https://myaccount.google.com/apppasswords)

### 1. Clone the Repository

```bash
git clone https://github.com/TejasRawool186/Build-With-AI-Bootcamp-DayPilot_One-.git
cd Build-With-AI-Bootcamp-DayPilot_One-
```

### 2. Backend Setup

```bash
cd app_build/backend

# Create a virtual environment (recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Frontend Setup

```bash
cd app_build

# Install Node dependencies
npm install
```

### 4. Run the Application

**Terminal 1 — Start the Backend:**
```bash
cd app_build/backend
python app.py
# → Server runs on http://localhost:5000
```

**Terminal 2 — Start the Frontend:**
```bash
cd app_build
npm run dev
# → App runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser. The Vite dev server proxies `/api/*` requests to the Flask backend automatically.

---

## 🔑 Environment Variables

Create `app_build/backend/.env` from the provided `.env.example`:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI reasoning |
| `OPENWEATHER_API_KEY` | ❌ Optional | OpenWeatherMap key for live weather (falls back to mock data) |
| `SMTP_EMAIL` | ❌ Optional | Gmail address for sending briefing emails |
| `SMTP_PASSWORD` | ❌ Optional | Gmail App Password (not regular password) |
| `SMTP_SERVER` | ❌ Optional | SMTP server (default: `smtp.gmail.com`) |
| `SMTP_PORT` | ❌ Optional | SMTP port (default: `587`) |
| `FLASK_DEBUG` | ❌ Optional | Enable debug mode (default: `true`) |
| `PORT` | ❌ Optional | Backend port (default: `5000`) |

> **Note:** The app works without any optional keys — it uses intelligent mock/fallback data for weather and rule-based analysis when Gemini is unavailable.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns service status |
| `GET` | `/api/schedule` | Fetch today's schedule |
| `GET` | `/api/weather?city=Mumbai` | Get weather for a city |
| `POST` | `/api/generate-plan` | **Main pipeline** — generates complete day plan |
| `POST` | `/api/send-email` | Send daily briefing email |

### Example: Generate a Day Plan

```bash
curl -X POST http://localhost:5000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"user_name": "Tejas", "city": "Mumbai", "email": "tejas@example.com"}'
```

---

## 🧠 How the AI Reasoning Works

The Gemini Agent receives aggregated data from all other agents and performs **5-step reasoning**:

1. **Schedule Analysis** — Counts events, identifies priorities, notes locations
2. **Weather Assessment** — Evaluates weather impact on outdoor plans
3. **Traffic Evaluation** — Assesses commute delays based on weather + traffic
4. **Conflict Check** — Reviews detected scheduling overlaps and warnings
5. **Final Decision** — Synthesizes all findings into actionable recommendations

The reasoning is **transparent** — every step is displayed in the UI so the user can see _why_ the AI made its suggestions.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Tejas Rawool**
- GitHub: [@TejasRawool186](https://github.com/TejasRawool186)

---

<p align="center">
  Built with ❤️ for the <strong>Build With AI Bootcamp</strong>
</p>
