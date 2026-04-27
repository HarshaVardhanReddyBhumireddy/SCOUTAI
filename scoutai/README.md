# ScoutAI — AI-Powered Talent Scouting & Engagement Agent

![ScoutAI Banner](https://img.shields.io/badge/Catalyst-Hackathon%202025-00d4aa?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square)

> An intelligent AI agent that automates talent scouting by parsing job descriptions, discovering matching candidates, simulating conversational outreach, and generating ranked shortlists with explainable scoring.

**🎯 Submission for Catalyst Hackathon 2025**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Scoring Logic](#scoring-logic)
- [Sample Inputs & Outputs](#sample-inputs--outputs)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [License](#license)

---

## 🎯 Overview

ScoutAI solves the recruiter's biggest pain point: **hours spent manually sifting through profiles and chasing candidate interest.** 

Our AI agent:
1. **Parses** job descriptions into structured requirements
2. **Discovers** matching candidates from a database with explainable scoring
3. **Engages** candidates through simulated multi-turn conversations
4. **Ranks** candidates on two dimensions: Match Score + Interest Score

**Result:** A ready-to-act shortlist in minutes, not days.

---

## ✨ Features

### 🧠 Intelligent JD Parser
- Extracts role title, seniority, experience requirements
- Identifies must-have vs. nice-to-have skills
- Domain/industry classification
- Editable UI chips for manual refinement

### 🔍 Smart Candidate Discovery
- 22-profile mock database with diverse backgrounds
- Semantic + keyword-based matching
- Explainable match reasons (top 3 factors per candidate)
- Match scores based on skills, experience, and domain fit

### 💬 AI-Powered Outreach Simulation
- Multi-turn conversations (6 messages per candidate)
- Personality-based responses (enthusiastic / neutral / hesitant)
- Uses Claude Sonnet 4 for realistic dialogue generation
- Interest extraction with signal labels

### 🏆 Ranked Shortlist Dashboard
- Combined scoring: `0.6 × Match + 0.4 × Interest` (configurable weights)
- Gold/silver/bronze highlighting for top 3
- Visual score bars and signal tags
- CSV export functionality

### 🎨 Production-Grade UI
- Dark theme with teal/navy color palette
- Smooth Framer Motion animations
- Responsive design (mobile → desktop)
- Progress tracking across 4 stages

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │  JD Input  │→ │ Discovery  │→ │  Outreach  │→ │Shortlist││
│  └────────────┘  └────────────┘  └────────────┘  └────────┘│
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │ JD Parser  │  │  Matcher   │  │  Outreach  │  │ Scorer ││
│  └────────────┘  └────────────┘  └────────────┘  └────────┘│
│         │              │                │              │     │
│         ▼              ▼                ▼              ▼     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Candidate Database (22 profiles)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Claude Sonnet 4 API  │
              │  (Outreach Simulation)│
              └───────────────────────┘
```

### Data Flow
1. **User** pastes JD → **JD Parser** extracts structured fields
2. **Matcher** scores all candidates → returns top 10
3. **Outreach Simulator** generates conversations for top 5 using Claude
4. **Scorer** combines Match + Interest → final ranked shortlist

---

## 🛠 Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Lucide React** — Icons

### Backend
- **FastAPI** — Python web framework
- **Anthropic Claude API** — LLM for conversation generation
- **Uvicorn** — ASGI server
- **Pydantic** — Data validation

### Infrastructure
- **Frontend Deploy:** Vercel
- **Backend Deploy:** Render / Railway
- **Alternative:** Hugging Face Spaces (all-in-one)

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/scoutai.git
cd scoutai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the server
python main.py
```

Backend will start on `http://localhost:8000`

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed (default points to localhost:8000)

# Run development server
npm run dev
```

Frontend will start on `http://localhost:5173`

### 4. Open in Browser
Navigate to `http://localhost:5173` and start scouting!

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### 1. Parse Job Description
```http
POST /api/parse-jd
Content-Type: application/json

{
  "jd_text": "We are looking for a Senior ML Engineer..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "Senior ML Engineer",
    "min_experience": 5,
    "seniority": "Senior",
    "domain": "AI/ML",
    "must_skills": ["Python", "PyTorch", "NLP"],
    "nice_skills": ["MLOps", "Kubernetes"]
  }
}
```

#### 2. Match Candidates
```http
POST /api/match-candidates
Content-Type: application/json

{
  "jd_text": "We are looking for a Senior ML Engineer..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Priya Sharma",
      "match_score": 92.5,
      "match_reasons": ["Matches required: Python, PyTorch, NLP", "6 years experience"]
    }
  ],
  "total": 10
}
```

#### 3. Simulate Outreach
```http
POST /api/simulate-outreach
Content-Type: application/json

{
  "candidate_id": 1,
  "jd_text": "Senior ML Engineer...",
  "match_score": 92.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "candidate_id": 1,
    "personality": "enthusiastic",
    "messages": [
      {"role": "agent", "content": "Hi Priya! I came across..."},
      {"role": "candidate", "content": "Absolutely! This sounds..."}
    ],
    "interest_score": 88,
    "interest_signals": ["Actively job searching", "Available immediately"]
  }
}
```

#### 4. Build Shortlist
```http
POST /api/build-shortlist
Content-Type: application/json

{
  "candidates": [...],
  "match_weight": 0.6,
  "interest_weight": 0.4
}
```

---

## 🧮 Scoring Logic

### Match Score (0-100)
```
Match Score = (Must-Have Match × 60%) + (Nice-to-Have Match × 25%) + (Experience × 15%)

Where:
- Must-Have Match = (# matched must-have skills) / (# total must-have skills)
- Nice-to-Have Match = (# matched nice-to-have skills) / (# total nice-to-have skills)
- Experience Bonus:
    - 15 points if years >= min_required + 2
    - 12 points if years >= min_required
    - 7 points if years >= min_required - 1
    - 3 points otherwise
```

**Example:**
- JD requires: `Python, PyTorch, NLP` (must-have), `MLOps, Kubernetes` (nice-to-have), 5+ years
- Candidate has: `Python, PyTorch, NLP, MLOps` with 6 years experience
- Calculation:
  - Must-have: 3/3 = 100% → 60 points
  - Nice-to-have: 1/2 = 50% → 12.5 points
  - Experience: 6 >= 5 → 12 points
  - **Total: 84.5%**

### Interest Score (0-100)
Derived from conversation analysis based on candidate personality:
- **Enthusiastic** (match ≥75%): 85-92 points
  - Signals: "Actively job searching", "Available immediately", "High self-reported interest"
- **Neutral** (50-74%): 50-60 points
  - Signals: "Passively open", "Asked about compensation", "Delayed availability"
- **Hesitant** (<50%): 20-30 points
  - Signals: "Recently promoted", "Not actively searching", "Low intent signals"

### Combined Score
```
Combined Score = (Match Weight × Match Score) + (Interest Weight × Interest Score)

Default: 0.6 × Match + 0.4 × Interest
```

**Ranking:** Candidates sorted by Combined Score (descending)

---

## 📊 Sample Inputs & Outputs

### Sample Job Description
```
We are looking for a Senior Machine Learning Engineer with 5+ years of experience. 
Must have: Python, PyTorch, NLP, model deployment. 
Nice to have: MLOps, Kubernetes, LLM fine-tuning, Hugging Face. 
The role involves building production NLP pipelines and working closely with the 
product team in a fast-growing AI startup.
```

### Sample Output (Top 3)
```json
[
  {
    "rank": 1,
    "name": "Priya Sharma",
    "title": "Senior ML Engineer",
    "match_score": 92.5,
    "interest_score": 88,
    "combined_score": 90.7,
    "match_reasons": [
      "Matches required skills: Python, PyTorch, NLP",
      "Has preferred skills: MLOps, Hugging Face",
      "6 years experience (min 5 required)"
    ],
    "interest_signals": [
      "Actively job searching",
      "Available immediately",
      "Asked about growth opportunities",
      "Self-reported high interest (9/10)"
    ]
  },
  {
    "rank": 2,
    "name": "Mohammed Al-Rashid",
    "title": "AI Research Engineer",
    "match_score": 89.0,
    "interest_score": 88,
    "combined_score": 88.6,
    "match_reasons": [
      "Matches required: Python, PyTorch, NLP, LLM fine-tuning",
      "7 years experience",
      "Domain expertise: AI Research"
    ],
    "interest_signals": [
      "Actively job searching",
      "Mentioned immediate availability",
      "Asked about technical challenges"
    ]
  },
  {
    "rank": 3,
    "name": "Rahul Verma",
    "title": "NLP Engineer",
    "match_score": 85.0,
    "interest_score": 88,
    "combined_score": 86.2,
    "match_reasons": [
      "Matches required: Python, PyTorch, NLP",
      "4 years experience (below 5 min)",
      "Available immediately"
    ],
    "interest_signals": [
      "Actively job searching",
      "Available immediately",
      "High self-reported interest"
    ]
  }
]
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `ANTHROPIC_API_KEY`

### All-in-One (Hugging Face Spaces)
```bash
# Create a Streamlit/Gradio wrapper
# Push to HF Spaces with both frontend and backend
```

---

## 📁 Project Structure

```
scoutai/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── jd_parser.py         # JD parsing logic
│   ├── candidate_db.py      # 22 candidate profiles
│   ├── matcher.py           # Candidate scoring
│   ├── outreach.py          # Conversation simulation (Claude API)
│   ├── scorer.py            # Shortlist ranking
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Topbar.jsx
│   │   │   └── UI.jsx       # Reusable UI components
│   │   ├── pages/
│   │   │   ├── JDPage.jsx
│   │   │   ├── CandidatesPage.jsx
│   │   │   ├── OutreachPage.jsx
│   │   │   └── ShortlistPage.jsx
│   │   ├── utils/
│   │   │   └── api.js       # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

---

## 🎥 Demo

📹 **Demo Video:** [YouTube Link] *(Record 3-5 min walkthrough)*

🌐 **Live Deployment:** [https://scoutai.vercel.app](https://scoutai.vercel.app)

📂 **GitHub Repo:** [https://github.com/YOUR_USERNAME/scoutai](https://github.com/YOUR_USERNAME/scoutai)

---

## 📄 License

MIT License — Built for Catalyst Hackathon 2025

---

## 🙏 Acknowledgments

- **Anthropic Claude API** for LLM-powered conversation simulation
- **Catalyst Hackathon 2025** for the challenge
- **Deccan AI Experts** for organizing

---

**Built with ❤️ by [Your Name]**  
Catalyst Hackathon 2025 Submission
