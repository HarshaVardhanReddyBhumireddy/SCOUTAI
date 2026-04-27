# 🔧 ENVIRONMENT VARIABLES GUIDE - Render Deployment

## Backend Environment Variables

These must be set in **Render Dashboard** → **Web Service (Backend)** → **Environment**

### Required Variables

#### 1. ANTHROPIC_API_KEY
**Purpose**: Enable AI-powered conversation simulation
**Where to get it**: 
- Go to https://console.anthropic.com
- Sign in / Create account
- Go to **API Keys**
- Click **Create Key**
- Copy the key (starts with `sk-ant-`)

**How to set**:
```
Key:   ANTHROPIC_API_KEY
Value: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Example**:
```
sk-ant-xyz1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnop
```

**Important**:
- ✅ Must start with `sk-ant-`
- ✅ Don't share this key publicly
- ✅ Regenerate if compromised
- ❌ Never commit to GitHub

#### 2. PYTHON_VERSION
**Purpose**: Ensure correct Python runtime
**Value**: `3.10.0`

**How to set**:
```
Key:   PYTHON_VERSION
Value: 3.10.0
```

### Optional Variables

#### 3. ALLOWED_ORIGINS
**Purpose**: Configure CORS for frontend
**Value**: Your frontend URL

**How to set**:
```
Key:   ALLOWED_ORIGINS
Value: https://scoutai-frontend.onrender.com
```

**After setting**:
1. Save all environment variables
2. Render automatically redeploys backend

---

## Frontend Environment Variables

These must be set in **Render Dashboard** → **Static Site (Frontend)** → **Environment**

### Required Variable

#### 1. VITE_API_URL
**Purpose**: Tell frontend where backend is located
**Value**: Your backend API URL

**How to set**:
```
Key:   VITE_API_URL
Value: https://scoutai-backend.onrender.com/api
```

**Steps**:
1. Deploy backend first (get URL)
2. Copy the backend URL
3. Add `/api` at the end
4. Set this as VITE_API_URL
5. Frontend will rebuild automatically

**Example**:
```
https://scoutai-backend.onrender.com/api
```

---

## How to Add Environment Variables to Render

### Backend (Web Service)

1. **Open Render Dashboard**: https://dashboard.render.com
2. **Select service**: Click on `scoutai-backend`
3. **Go to Environment**: Click **Environment** tab
4. **Add variable**:
   - Click **+ Add Environment Variable**
   - Fill in **Key** (e.g., `ANTHROPIC_API_KEY`)
   - Fill in **Value** (e.g., `sk-ant-...`)
   - Click **Save Variable**
5. **Repeat** for each variable
6. **Auto-redeploy**: Service redeploys when variables saved

### Frontend (Static Site)

1. **Open Render Dashboard**: https://dashboard.render.com
2. **Select service**: Click on `scoutai-frontend`
3. **Go to Environment**: Click **Environment** tab
4. **Add variable**:
   - Click **+ Add Environment Variable**
   - Fill in **Key** (e.g., `VITE_API_URL`)
   - Fill in **Value** (e.g., `https://scoutai-backend...`)
   - Click **Save Variable**
5. **Auto-rebuild**: Frontend rebuilds when variables saved

---

## Variable Setup Sequence

Follow this order to avoid connection issues:

### Step 1: Backend Variables (Do First)
```
1. ANTHROPIC_API_KEY = sk-ant-...
2. PYTHON_VERSION = 3.10.0
```
✅ Wait for backend to redeploy (2-3 min)

### Step 2: Backend URL Verification
```bash
curl https://scoutai-backend.onrender.com/
# Should return: {"status":"ok","service":"ScoutAI API"}
```
✅ If working, proceed to Step 3

### Step 3: Frontend Variables (Do Second)
```
1. VITE_API_URL = https://scoutai-backend.onrender.com/api
```
✅ Wait for frontend to rebuild (2-3 min)

### Step 4: Backend CORS Variable (Do Last)
```
ALLOWED_ORIGINS = https://scoutai-frontend.onrender.com
```
✅ Wait for backend to redeploy (2-3 min)

### Step 5: Test Connection
Open: `https://scoutai-frontend.onrender.com`
- Page should load
- No CORS errors in console
- JD parsing should work

---

## Retrieving Environment Variables from Render

### View Existing Variables

1. Go to Render Dashboard
2. Click on your service
3. Click **Environment** tab
4. You'll see all variables (values hidden for security)

### Edit Existing Variables

1. Click on the variable
2. Click **Edit**
3. Update value
4. Click **Save Variable**
5. Service redeploys automatically

### Delete Variables

1. Click on the variable
2. Click **Delete**
3. Variable is removed
4. Service redeploys

---

## Secret Management Best Practices

### For API Keys

✅ **DO**:
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx  (in Render env vars)
```

❌ **DON'T**:
```
export ANTHROPIC_API_KEY="sk-ant-xxx" (in .env files)
github/commit (in version control)
slack/email (in communications)
```

### For Frontend URLs

✅ **DO**:
```
VITE_API_URL = https://yourdomain.com/api  (in Render env vars)
```

❌ **DON'T**:
```
hardcode in source code
commit to GitHub
```

### For Database URLs (Future)

✅ **DO**:
```
DATABASE_URL = postgresql://user:pass@host/db  (in Render env vars)
```

❌ **DON'T**:
```
in config files
in source code
```

---

## Troubleshooting Environment Variables

### Problem: Backend says API key not found

**Symptom**:
```
ERROR: ANTHROPIC_API_KEY not found in environment
```

**Solution**:
1. Go to Render Dashboard
2. Click **scoutai-backend**
3. Click **Environment**
4. Check if `ANTHROPIC_API_KEY` exists
5. If missing, add it
6. If present, click **Manual Deploy** → **Redeploy**

### Problem: Frontend can't connect to backend

**Symptom**:
```
Failed to connect to backend
```

**Solution**:
1. Check `VITE_API_URL` is set correctly
2. Verify backend URL is correct:
   ```bash
   curl https://scoutai-backend.onrender.com/
   ```
3. If backend works, redeploy frontend:
   - Render Dashboard → Frontend → Manual Redeploy

### Problem: CORS errors in console

**Symptom**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
1. Add `ALLOWED_ORIGINS` to backend:
   ```
   ALLOWED_ORIGINS = https://scoutai-frontend.onrender.com
   ```
2. Redeploy backend
3. Clear frontend cache
4. Refresh page

### Problem: Wrong value showing in environment

**Symptom**:
Frontend still trying to use old URL

**Solution**:
1. Check Render env var is correct
2. Force hard refresh: **Ctrl+Shift+R**
3. Clear cache: **Ctrl+Shift+Delete**
4. Check browser console for actual values being used

---

## Common Issues & Solutions

### Issue 1: Mismatched URLs

**Problem**: Frontend pointing to wrong backend

**Solution**:
```
VITE_API_URL should match your backend URL exactly:
https://scoutai-backend.onrender.com/api
                ↑ must match your backend name
```

### Issue 2: API Key Format

**Problem**: Backend rejects API key

**Solution**:
```
Key must start with: sk-ant-
Format: sk-ant-[long string of characters]
Length: Usually 80+ characters
```

### Issue 3: Extra Spaces

**Problem**: Environment variable not recognized

**Solution**:
```
❌ ANTHROPIC_API_KEY= sk-ant-xxx (space before value)
✅ ANTHROPIC_API_KEY=sk-ant-xxx (no space)
```

### Issue 4: Special Characters

**Problem**: URL with special characters fails

**Solution**:
```
If URL contains: &, ?, =, etc.
→ URL-encode them or wrap in quotes
→ Or copy directly from Render without editing
```

---

## Updating Environment Variables

### When to Update

- API key expires or needs refresh
- Backend URL changes
- Frontend URL changes
- Need to enable/disable features

### How to Update

1. **Go to Render Dashboard**
2. **Select service**
3. **Click Environment**
4. **Click the variable to edit**
5. **Update value**
6. **Service redeploys automatically**

### Time Required

- Backend env var: 2-3 min to redeploy
- Frontend env var: 2-3 min to rebuild
- Wait before testing!

---

## Environment Variables Checklist

### Backend Variables
- [ ] `ANTHROPIC_API_KEY` (sk-ant-...)
- [ ] `PYTHON_VERSION` (3.10.0)
- [ ] `ALLOWED_ORIGINS` (frontend URL)

### Frontend Variables
- [ ] `VITE_API_URL` (backend URL/api)

### Verification
- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] JD parsing works
- [ ] API calls succeed

---

## Security Reminders

🔒 **Never**:
- Share API keys in email/slack
- Commit secrets to GitHub
- Leave secrets in frontend code
- Use same key for different services

🔐 **Always**:
- Store secrets in environment variables only
- Regenerate compromised keys
- Use different keys for dev/staging/prod
- Audit access to environment variables

---

## Reference: Where Each Variable Is Used

| Variable | Used By | Purpose |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | Backend | AI conversation simulation |
| `PYTHON_VERSION` | Render | Python runtime version |
| `ALLOWED_ORIGINS` | Backend | CORS configuration |
| `VITE_API_URL` | Frontend | Backend connection URL |

---

**Next Steps**: After setting all variables, see **RENDER_DEPLOYMENT.md** for verification steps.
