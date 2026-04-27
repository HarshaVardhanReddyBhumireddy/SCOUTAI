# 📋 Deployment & Submission Checklist

## Before You Submit ✅

### 1. Code Preparation
- [ ] All code is pushed to a **public GitHub repository**
- [ ] Repository name: `scoutai` or `ai-talent-scout`
- [ ] `.env` files are **NOT** committed (only `.env.example`)
- [ ] Repository is shared with `hackathon@deccan.ai`
- [ ] Add GitHub user `hackathon-deccan-ai` as collaborator

### 2. Documentation
- [ ] `README.md` has your name/details updated
- [ ] `QUICKSTART.md` is reviewed
- [ ] `sample_output.json` is included
- [ ] `ARCHITECTURE.md` diagrams are clear

### 3. API Configuration
- [ ] Get Anthropic API key from https://console.anthropic.com
- [ ] Add API key to backend `.env` file
- [ ] Test conversation simulation works
- [ ] **DO NOT** commit `.env` file to Git

### 4. Local Testing
- [ ] Run `./validate.sh` — should pass all checks
- [ ] Backend starts without errors: `cd backend && ./run.sh`
- [ ] Frontend starts without errors: `cd frontend && ./run.sh`
- [ ] Complete a full workflow: JD → Discovery → Outreach → Shortlist
- [ ] Test CSV export functionality
- [ ] Test with different job descriptions

### 5. Demo Video (3-5 minutes)
- [ ] Record screen using Loom/OBS/Zoom
- [ ] Show all 4 stages of the pipeline
- [ ] Demonstrate key features:
  - JD parsing with extracted skills
  - Candidate matching with scores
  - AI conversation simulation
  - Ranked shortlist with export
- [ ] Upload to YouTube (Unlisted is fine)
- [ ] Add video link to README.md

### 6. Deployment (Optional but Recommended)

#### Frontend (Vercel)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Deploy: `cd frontend && vercel --prod`
- [ ] Update `vercel.json` with backend URL
- [ ] Test deployed URL

#### Backend (Render/Railway)
- [ ] Create account on Render.com or Railway.app
- [ ] Connect GitHub repository
- [ ] Add environment variable: `ANTHROPIC_API_KEY`
- [ ] Deploy and test API endpoints
- [ ] Update frontend `.env` with production API URL

### 7. Submission Form
Fill out the Catalyst submission form with:
- [ ] **Git Repository URL**: `https://github.com/YOUR_USERNAME/scoutai`
- [ ] **Git Username**: `YOUR_USERNAME`
- [ ] **Project Documentation**: Link to README.md
- [ ] **Demo Video Link**: YouTube URL
- [ ] **Project Site URL**: Vercel deployment URL (or GitHub repo)

### 8. Final Review
- [ ] Click through the deployed app — everything works?
- [ ] Watch your demo video — is it clear?
- [ ] README has installation instructions?
- [ ] Sample output JSON is accurate?
- [ ] Architecture diagram makes sense?

---

## Submission Deadline ⏰

**Monday, April 27, 2025 at 1:00 AM IST**

Set a reminder for **Sunday evening** to do a final check!

---

## Quick Deploy Commands

### Deploy Frontend to Vercel
```bash
cd frontend
npm run build
vercel --prod
```

### Deploy Backend to Render
1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Connect repo → Select `scoutai`
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. Add Environment Variable: `ANTHROPIC_API_KEY=sk-ant-...`
6. Create Web Service

---

## Testing Endpoints

After deployment, test these:

```bash
# Health check
curl https://your-backend.onrender.com/

# Parse JD
curl -X POST https://your-backend.onrender.com/api/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"jd_text": "Senior ML Engineer..."}'

# Match candidates  
curl -X POST https://your-backend.onrender.com/api/match-candidates \
  -H "Content-Type: application/json" \
  -d '{"jd_text": "Senior ML Engineer..."}'
```

---

## Common Issues & Fixes

### "Module not found" on Render
**Fix**: Check `requirements.txt` has all dependencies

### CORS error on deployed frontend
**Fix**: Update backend CORS to allow your frontend domain
```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    ...
)
```

### API calls fail from deployed frontend
**Fix**: Update frontend `.env`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Conversation simulation returns fallback
**Fix**: Ensure `ANTHROPIC_API_KEY` is set in Render environment variables

---

## Support Channels

- **Discord**: https://discord.gg/aczDnqNR
- **Email**: support@deccanexperts.ai
- **Hackathon Issues**: hackathon@deccan.ai

---

## After Submission 🎉

1. **Share on LinkedIn/Twitter** with #CatalystHackathon
2. **Star the repo** so others can find it
3. **Add to your portfolio**
4. **Write a blog post** about what you learned

---

**Good luck! 🚀 You've got this!**
