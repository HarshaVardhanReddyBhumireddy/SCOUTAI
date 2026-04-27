# 🚀 DETAILED RENDER DEPLOYMENT GUIDE - ScoutAI

Complete step-by-step instructions to deploy ScoutAI on Render (both frontend and backend).

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Part 1: Deploy Backend (FastAPI)](#part-1-deploy-backend-fastapi)
3. [Part 2: Deploy Frontend (React/Vite)](#part-2-deploy-frontend-reactvite)
4. [Part 3: Configure Environment Variables](#part-3-configure-environment-variables)
5. [Part 4: Connect Frontend to Backend](#part-4-connect-frontend-to-backend)
6. [Part 5: Verify Deployment](#part-5-verify-deployment)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] GitHub account (free at github.com)
- [ ] Render account (free at render.com)
- [ ] Anthropic API Key (from console.anthropic.com)
- [ ] Git installed locally
- [ ] Project pushed to GitHub
- [ ] All code committed (no uncommitted changes)

### Quick Setup Check
```bash
# Verify git is installed
git --version

# Verify Python version
python --version  # Should be 3.10+

# Verify Node version
node --version    # Should be 16+

# Verify git config
git config --list | grep user.name
git config --list | grep user.email
```

---

## PART 1: Deploy Backend (FastAPI)

### Step 1: Push Backend Code to GitHub

1. **Initialize Git Repository** (if not already done):
```bash
cd c:\Users\reddy\Downloads\scoutai\scoutai
git init
git add .
git commit -m "Initial ScoutAI commit with improvements"
```

2. **Push to GitHub**:
```bash
# Create a new repository on GitHub.com
# Then run these commands (replace USERNAME/REPO with your repo):

git remote add origin https://github.com/USERNAME/scoutai.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account & Login

1. Go to **https://render.com**
2. Click **Sign up** → Choose **GitHub** sign-in
3. Authorize Render to access your GitHub account
4. Click **Create new** → Select **Web Service**

### Step 3: Deploy Backend Service

1. **Select Repository**:
   - Search for and select `scoutai` repository
   - Click **Connect**

2. **Configure Service**:

| Setting | Value | Notes |
|---------|-------|-------|
| **Name** | `scoutai-backend` | Keep lowercase, no spaces |
| **Environment** | `Python 3` | From dropdown |
| **Region** | `Oregon` (USA) | Choose closest to your users |
| **Branch** | `main` | Default branch |
| **Root Directory** | `backend` | Leave empty if not asked |

3. **Build & Start Commands**:

   In the Web Service configuration:
   
   - **Build Command**:
   ```
   pip install -r requirements.txt
   ```
   
   - **Start Command**:
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**:
   - Click **Add Environment Variable**
   - Add these:
   
   | Key | Value | Notes |
   |-----|-------|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` | Your actual API key |
   | `PYTHON_VERSION` | `3.10.0` | Exact version |

   Click **Save Environment Variable** after each one

### Step 4: Complete Deployment

1. Click **Create Web Service**
2. **Wait for deployment** (3-5 minutes)
3. You'll see: "Your service is live on https://scoutai-backend.onrender.com"
4. **Note your backend URL** for later!

### Step 5: Verify Backend is Running

1. Open your terminal
2. Test the backend:
```bash
curl https://scoutai-backend.onrender.com/
# or replace with your actual URL
```

Expected response:
```json
{"status":"ok","service":"ScoutAI API"}
```

✅ **Backend is deployed!**

---

## PART 2: Deploy Frontend (React/Vite)

### Step 1: Configure Frontend Build Files

1. **Check `frontend/package.json`**:
```bash
cd frontend
cat package.json | grep -A 5 "scripts"
```

Should show:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. **Create `frontend/render.yaml`**:
```bash
cd frontend
```

Create file named `render.yaml`:
```yaml
services:
  - type: web
    name: scoutai-frontend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    envVars:
      - key: VITE_API_URL
        value: https://scoutai-backend.onrender.com/api
    routes:
      - path: /
        dest: /index.html
```

3. **Update `frontend/vite.config.js`**:

Make sure it looks like this:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Step 2: Update Frontend API Configuration

Edit `frontend/src/utils/api.js`:

**Find this line:**
```javascript
const API_URL = "http://localhost:8000/api";
```

**Replace with:**
```javascript
const API_URL = process.env.VITE_API_URL || "http://localhost:8000/api";
```

### Step 3: Create Static Build Configuration

Create file `frontend/build.sh`:
```bash
#!/bin/bash
npm install
npm run build
```

### Step 4: Push Updated Code to GitHub

```bash
cd c:\Users\reddy\Downloads\scoutai\scoutai
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 5: Deploy Frontend on Render

1. **In Render Dashboard**:
   - Click **Create new** → **Static Site**

2. **Configure Service**:

| Setting | Value |
|---------|-------|
| **Name** | `scoutai-frontend` |
| **Repository** | Select your scoutai repo |
| **Branch** | `main` |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |

3. **Add Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://scoutai-backend.onrender.com/api`
   
   (Replace with your actual backend URL)

4. Click **Create Static Site**

5. **Wait for deployment** (2-3 minutes)

✅ **Frontend is deployed!**

---

## PART 3: Configure Environment Variables

### Backend Environment Variables

1. **In Render Dashboard**:
   - Go to **scoutai-backend** service
   - Click **Environment**

2. **Add/Update Variables**:

```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
PYTHON_VERSION = 3.10.0
```

3. Click **Save**
4. Service will **auto-restart** with new variables

### Frontend Environment Variables

1. **In Render Dashboard**:
   - Go to **scoutai-frontend** static site
   - Click **Environment**

2. **Add/Update Variables**:

```
VITE_API_URL = https://scoutai-backend.onrender.com/api
```

(Replace with your actual backend URL)

3. Click **Save**
4. Service will **auto-rebuild**

---

## PART 4: Connect Frontend to Backend

### Update CORS Configuration (Backend)

**Edit `backend/main.py`**:

Find the CORS section:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← Currently allows all origins
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Update to:**
```python
import os

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,https://scoutai-frontend.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Add Backend Environment Variable

1. **In Render Dashboard** (Backend service):
   - Go to **Environment**
   - Add: `ALLOWED_ORIGINS = https://scoutai-frontend.onrender.com`

2. **Redeploy backend**:
   - Click **Manual Deploy** → **Latest Commit**
   - Wait for redeploy (2-3 minutes)

### Test Connection

1. Open frontend URL: `https://scoutai-frontend.onrender.com`
2. Paste a job description
3. Click **Analyze JD**
4. Check browser console (F12) for errors
5. Should see parsed JD appear

---

## PART 5: Verify Deployment

### Checklist

- [ ] Backend is running (check `/` endpoint)
- [ ] Frontend is loading (page appears)
- [ ] API calls work (no CORS errors)
- [ ] JD parsing works
- [ ] Candidate matching works
- [ ] Outreach simulation works
- [ ] Shortlist generation works

### Test Each Component

#### Test 1: Backend Health
```bash
curl https://scoutai-backend.onrender.com/
# Should return: {"status":"ok","service":"ScoutAI API"}
```

#### Test 2: JD Parsing
```bash
curl -X POST https://scoutai-backend.onrender.com/api/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"jd_text":"Python developer needed"}'
# Should return parsed JD
```

#### Test 3: Candidate Matching
```bash
curl -X POST https://scoutai-backend.onrender.com/api/match-candidates \
  -H "Content-Type: application/json" \
  -d '{"jd_text":"Python, JavaScript, React required"}'
# Should return matched candidates with percentages
```

#### Test 4: Frontend Loading
Open: `https://scoutai-frontend.onrender.com`
- [ ] Page loads without errors
- [ ] UI is visible
- [ ] "Load sample JD" button works
- [ ] "Analyze JD" button works

#### Test 5: End-to-End Flow
1. Open frontend
2. Load sample JD
3. Analyze JD
4. Find Candidates
5. Proceed to Outreach
6. Simulate conversation
7. Generate shortlist

All should work without errors ✅

---

## 🔧 Troubleshooting

### Issue 1: "Failed to connect to backend"

**Symptom**: Frontend shows error about API endpoint

**Solution**:
1. Check backend URL in **VITE_API_URL**:
   ```bash
   curl https://your-backend-url.onrender.com/
   ```

2. If URL is wrong:
   - Go to Render Dashboard
   - Find backend service
   - Copy actual URL
   - Update VITE_API_URL environment variable
   - Redeploy frontend

### Issue 2: "CORS Error"

**Symptom**: 
```
Access to XMLHttpRequest at 'https://backend.onrender.com/api/...' 
from origin 'https://frontend.onrender.com' has been blocked by CORS policy
```

**Solution**:
1. Edit `backend/main.py`
2. Add frontend URL to ALLOWED_ORIGINS
3. Add to backend environment variables:
   ```
   ALLOWED_ORIGINS = https://scoutai-frontend.onrender.com
   ```
4. Redeploy backend

### Issue 3: "JSON.stringify is not a function"

**Symptom**: Console errors during API calls

**Solution**:
1. Check `frontend/src/utils/api.js`
2. Ensure API URL is correct
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+Shift+R)

### Issue 4: Backend takes too long to start

**Symptom**: "Your service is not responding"

**Solution**:
1. Render free tier is slower
2. Wait 5 minutes for cold start
3. Check logs:
   - Render Dashboard → Backend → Logs
   - Look for error messages
4. If Python version mismatch:
   - Update PYTHON_VERSION to 3.10.0
   - Redeploy

### Issue 5: "ANTHROPIC_API_KEY not found"

**Symptom**: Backend errors about missing API key

**Solution**:
1. Verify API key is set:
   - Render Dashboard → Backend → Environment
   - Check ANTHROPIC_API_KEY is present
2. API key should start with `sk-ant-`
3. If missing, add it and redeploy
4. Don't share the key publicly!

### Issue 6: Frontend shows blank page

**Symptom**: Site loads but completely white

**Solution**:
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Common fixes:
   - Clear cache and reload
   - Check VITE_API_URL is set correctly
   - Rebuild frontend: Click redeploy in Render

### Issue 7: Candidate percentages not showing

**Symptom**: Old format without percentages

**Solution**:
1. Ensure backend has latest code
2. Force backend redeploy:
   - Render Dashboard → Backend
   - Click **Manual Deploy** → **Latest Commit**
3. Clear frontend cache
4. Refresh page

---

## 📊 Monitoring & Maintenance

### View Service Logs

**Backend Logs**:
1. Render Dashboard → scoutai-backend
2. Click **Logs** tab
3. See real-time activity

**Frontend Logs**:
1. Render Dashboard → scoutai-frontend
2. Click **Logs** tab
3. See build and serve logs

### Redeploy Without Changes

**Backend**:
1. Render Dashboard → scoutai-backend
2. Click **Manual Deploy**
3. Select **Latest Commit**

**Frontend**:
1. Render Dashboard → scoutai-frontend
2. Click **Manual Redeploy**

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Render automatically redeploys after push
```

### Monitor Performance

1. **Render Dashboard** shows:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

2. Click on service to see detailed metrics

---

## 🔐 Security Tips

### Environment Variables

✅ **DO**:
```
ANTHROPIC_API_KEY = sk-ant-xxxxx  (in production)
ALLOWED_ORIGINS = https://yourdomain.com
```

❌ **DON'T**:
- Commit API keys to GitHub
- Share keys in discord/email
- Store keys in config files

### CORS Configuration

✅ **DO**:
```python
ALLOWED_ORIGINS = ["https://yourdomain.com"]
```

❌ **DON'T**:
```python
allow_origins=["*"]  # Allow all origins
```

### API Rate Limiting

Consider adding rate limiting:
```bash
pip install slowapi
```

---

## 📈 Performance Optimization

### Frontend Optimization

1. **Build optimization**:
   - Vite automatically optimizes
   - Check dist/ folder size

2. **Image optimization**:
   - Use WebP format
   - Compress before upload

3. **Code splitting**:
   - Vite handles automatically
   - Check Network tab in DevTools

### Backend Optimization

1. **Response caching**:
   - Add FastAPI caching

2. **Connection pooling**:
   - Use connection pools for databases

3. **Async operations**:
   - FastAPI handles this well

---

## 🎯 Final Deployment Checklist

### Pre-Deployment
- [ ] All code committed to GitHub
- [ ] API key ready
- [ ] Environment variables documented

### Backend Deployment
- [ ] Backend service created on Render
- [ ] Build command works
- [ ] Start command works
- [ ] Environment variables set
- [ ] Health check passes
- [ ] API endpoints respond

### Frontend Deployment
- [ ] Frontend service created on Render
- [ ] Build command works
- [ ] Environment variables set
- [ ] API URL correctly configured
- [ ] CORS configured
- [ ] Site loads without errors

### Testing
- [ ] Backend `/` endpoint works
- [ ] `/api/parse-jd` endpoint works
- [ ] `/api/match-candidates` endpoint works
- [ ] Frontend loads
- [ ] JD parsing works
- [ ] Candidate matching works
- [ ] All features functional

### Documentation
- [ ] Note backend URL
- [ ] Note frontend URL
- [ ] Document API key location
- [ ] Share URLs with team

---

## 📞 Quick Reference URLs

Once deployed, your URLs will be:

```
Backend:  https://scoutai-backend.onrender.com
Frontend: https://scoutai-frontend.onrender.com

API Endpoint:    https://scoutai-backend.onrender.com/api
Parse JD:        https://scoutai-backend.onrender.com/api/parse-jd
Match Candidates: https://scoutai-backend.onrender.com/api/match-candidates
All Candidates:   https://scoutai-backend.onrender.com/api/candidates
```

---

## ✅ Success Indicators

When everything is working:

✅ Frontend loads without errors  
✅ Can paste and analyze JD  
✅ Shows ALL required skills (not capped at 8)  
✅ Shows skill percentages (e.g., "9/16 (56.2%)")  
✅ Can find candidates  
✅ Can simulate outreach  
✅ Can generate shortlist  
✅ No console errors (F12)  
✅ No CORS errors  
✅ API responses show percentage-based scoring  

---

## 🎉 Deployment Complete!

Your ScoutAI application is now live on Render with:
- ✅ Backend FastAPI server
- ✅ Frontend React/Vite application
- ✅ Percentage-based candidate scoring
- ✅ Full JD parsing capabilities
- ✅ All features functional

**Share your deployed URLs:**
- Frontend: `https://scoutai-frontend.onrender.com`
- Backend API: `https://scoutai-backend.onrender.com/api`
