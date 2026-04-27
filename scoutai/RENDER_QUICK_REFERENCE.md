# 🚀 RENDER DEPLOYMENT - QUICK REFERENCE CARD

**Print this or save to phone for quick reference during deployment**

---

## STEP 1: Prepare Code (5 minutes)

### Windows
```powershell
cd c:\Users\reddy\Downloads\scoutai\scoutai
.\pre-deployment-check.ps1
```

### Mac/Linux
```bash
cd scoutai/
bash pre-deployment-check.sh
```

### What this checks:
✅ Git status (all committed)
✅ Python version (3.10+)
✅ requirements.txt exists
✅ package.json exists
✅ main.py exists
✅ index.html exists
✅ GitHub remote configured

---

## STEP 2: Commit & Push (2 minutes)

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

**Wait for push to complete** ✅

---

## STEP 3: Create Render Account (2 minutes)

1. Go to **render.com**
2. Click **Sign up**
3. Select **GitHub** option
4. Authorize Render to access GitHub
5. Done! ✅

---

## STEP 4: Deploy Backend (5 minutes)

### In Render Dashboard:

| Action | Value |
|--------|-------|
| Click | **Create new** → **Web Service** |
| Repository | Select `scoutai` |
| Click | **Connect** |
| Name | `scoutai-backend` |
| Environment | `Python 3` |
| Region | `Oregon` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Add Env Variables:
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
PYTHON_VERSION = 3.10.0
```

### Click:
- **Add Environment Variable** for each
- **Create Web Service**
- **Wait 3-5 minutes for deployment** ⏳

**✅ Backend URL:** `https://scoutai-backend.onrender.com`
(Copy this for later)

---

## STEP 5: Deploy Frontend (3 minutes)

### In Render Dashboard:

| Action | Value |
|--------|-------|
| Click | **Create new** → **Static Site** |
| Repository | Select `scoutai` |
| Name | `scoutai-frontend` |
| Build Command | `cd frontend && npm install && npm run build` |
| Publish Directory | `frontend/dist` |

### Add Env Variable:
```
VITE_API_URL = https://scoutai-backend.onrender.com/api
```

### Click:
- **Add Environment Variable**
- **Create Static Site**
- **Wait 2-3 minutes for deployment** ⏳

**✅ Frontend URL:** `https://scoutai-frontend.onrender.com`

---

## STEP 6: Verify Deployment (3 minutes)

### Quick Tests:

1. **Backend Health Check**:
```bash
curl https://scoutai-backend.onrender.com/
# Expected: {"status":"ok","service":"ScoutAI API"}
```

2. **Frontend Loading**:
   - Open: `https://scoutai-frontend.onrender.com`
   - Should see the UI
   - No errors in console

3. **API Test** (optional):
```bash
curl -X POST https://scoutai-backend.onrender.com/api/parse-jd \
  -H "Content-Type: application/json" \
  -d '{"jd_text":"Python developer needed"}'
```

4. **Full Feature Test**:
   - Load sample JD
   - Analyze JD
   - Find Candidates
   - Check if percentages show (e.g., "9/16 (56.2%)")

**✅ Everything working?** Deployment complete!

---

## TROUBLESHOOTING QUICK FIXES

### Frontend shows blank page
```
→ Clear cache: Ctrl+Shift+Delete
→ Hard refresh: Ctrl+Shift+R
```

### "Failed to connect to backend"
```
→ Check VITE_API_URL in Frontend env var
→ Verify backend URL is correct
→ Redeploy frontend
```

### "CORS Error" in console
```
→ Update backend ALLOWED_ORIGINS env var
→ Add frontend URL to it
→ Redeploy backend
```

### Percentages not showing
```
→ Force backend redeploy
→ Clear frontend cache
→ Refresh page
```

### API key errors
```
→ Check ANTHROPIC_API_KEY is set
→ Verify it starts with sk-ant-
→ Redeploy backend if changed
```

---

## ENVIRONMENT VARIABLES REFERENCE

### Backend (Web Service)
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
PYTHON_VERSION = 3.10.0
ALLOWED_ORIGINS = https://scoutai-frontend.onrender.com
```

### Frontend (Static Site)
```
VITE_API_URL = https://scoutai-backend.onrender.com/api
```

---

## IMPORTANT URLS

After deployment:

```
Frontend:  https://scoutai-frontend.onrender.com
Backend:   https://scoutai-backend.onrender.com
API:       https://scoutai-backend.onrender.com/api
```

---

## COMMON MISTAKES TO AVOID

❌ Forgot `cd frontend` in build command
❌ Wrong API key format (should start with `sk-ant-`)
❌ Publish directory for frontend is `dist` not `build`
❌ Build command for backend should be pip install
❌ Not setting VITE_API_URL on frontend
❌ Random spaces in environment variables
❌ Wrong region selected (choose nearest to users)

---

## COMPLETION CHECKLIST

- [ ] Pre-deployment check passed
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend deployed
- [ ] Backend URL noted
- [ ] Frontend deployed  
- [ ] Frontend URL noted
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] JD parsing works
- [ ] Candidate matching works
- [ ] Percentages showing (9/16 format)
- [ ] All features functional

**✅ If all checked: DEPLOYMENT SUCCESSFUL!**

---

## DEPLOYMENT TIME SUMMARY

| Step | Time | Cumulative |
|------|------|-----------|
| Pre-check | 5 min | 5 min |
| Git push | 2 min | 7 min |
| Create account | 2 min | 9 min |
| Backend deploy | 5 min | 14 min |
| Frontend deploy | 3 min | 17 min |
| Verification | 3 min | 20 min |
| **TOTAL** | **20 min** | |

---

## SUPPORT LINKS

- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

---

## EMERGENCY REVERT

If something breaks:

1. **Stop service**:
   - Render Dashboard → Service → Settings → Suspend

2. **Revert code**:
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Restart**:
   - Render Dashboard → Service → Resume → Manual Deploy

---

**🎉 You're ready to deploy!**

For detailed instructions, see: **RENDER_DEPLOYMENT.md**
