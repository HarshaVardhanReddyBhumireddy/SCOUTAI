# 🚀 Quick Start Guide

Get ScoutAI running in **under 5 minutes**!

## Prerequisites

- ✅ Python 3.10+ ([Download](https://www.python.org/downloads/))
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ Anthropic API Key ([Get one free](https://console.anthropic.com))

---

## Option 1: One-Command Setup (Recommended)

### On Linux/Mac:
```bash
# Backend
cd backend && ./run.sh

# In a new terminal - Frontend
cd frontend && ./run.sh
```

### On Windows:
```cmd
REM Backend
cd backend
run.bat

REM In a new terminal - Frontend
cd frontend
run.bat
```

**That's it!** 🎉 Open http://localhost:5173

---

## Option 2: Manual Setup

### Step 1: Backend Setup (5 commands)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

**Edit `.env`** and add your API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Start backend:**
```bash
python main.py
```

✅ Backend running on http://localhost:8000

### Step 2: Frontend Setup (3 commands)
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on http://localhost:5173

---

## 🧪 Testing the App

1. Open http://localhost:5173
2. Click **"Load sample JD"** 
3. Click **"Analyze JD"** → See parsed skills
4. Click **"Find Candidates"** → Browse 10 matched profiles
5. Click **"Proceed to Outreach"** → Select a candidate
6. Click **"▶ Simulate Outreach"** → Watch AI conversation
7. Click **"Generate Ranked Shortlist"** → See final rankings
8. Click **"Export CSV"** to download results

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Key Error
```bash
# Make sure .env file exists in backend/
cat backend/.env

# Should show:
# ANTHROPIC_API_KEY=sk-ant-...
```

### CORS Error
- Make sure backend is running on port 8000
- Frontend proxies `/api` calls automatically via Vite

---

## 📱 Without API Key (Demo Mode)

You can run the app WITHOUT an API key!
- Outreach simulation will use **pre-written conversation templates**
- Everything else works normally

Just leave `.env` as-is or set:
```env
ANTHROPIC_API_KEY=demo
```

---

## 🌐 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Deploy to Vercel
```bash
cd frontend
vercel --prod
```

### Deploy Backend to Render
1. Push code to GitHub
2. Create Web Service on Render.com
3. Set environment: `ANTHROPIC_API_KEY`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 🎥 Demo Video Recording Tips

Record a 3-5 minute walkthrough showing:

1. **Intro** (15s): "This is ScoutAI, an AI talent scouting agent"
2. **JD Parsing** (30s): Paste JD, show extracted skills/experience
3. **Discovery** (45s): Browse candidate cards, explain match scores
4. **Outreach** (90s): Simulate 2-3 conversations, show interest scores
5. **Shortlist** (60s): Show ranked table, adjust weights, export CSV
6. **Wrap-up** (15s): "Built in 48 hours for Catalyst Hackathon"

**Tools:** Loom, OBS Studio, or Zoom screen recording

---

## 📂 Project Structure Overview

```
scoutai/
├── backend/          # Python FastAPI server
│   ├── main.py       # API endpoints
│   ├── jd_parser.py  # JD parsing logic
│   ├── matcher.py    # Scoring algorithm
│   ├── outreach.py   # Claude API integration
│   └── run.sh        # Quick start script
│
├── frontend/         # React + Vite app
│   ├── src/
│   │   ├── pages/    # 4 main views
│   │   └── components/
│   └── run.sh        # Quick start script
│
└── README.md         # Full documentation
```

---

## ✅ Checklist Before Submission

- [ ] Code pushed to GitHub (public repo)
- [ ] README.md updated with your details
- [ ] `.env.example` files present (NO real API keys!)
- [ ] Demo video recorded (3-5 min)
- [ ] Repo shared with hackathon@deccan.ai
- [ ] Deployed URL works (optional but recommended)
- [ ] Sample output JSON included

---

## 🆘 Need Help?

- **Discord:** https://discord.gg/aczDnqNR
- **Email:** support@deccanexperts.ai
- **GitHub Issues:** Create an issue in your repo

---

**Good luck! 🚀** Build something real.
