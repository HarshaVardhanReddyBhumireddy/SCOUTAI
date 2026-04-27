#!/bin/bash
# Pre-deployment check script for Render

echo "=================================================="
echo "ScoutAI - Pre-Deployment Checklist"
echo "=================================================="
echo ""

# Check 1: Git status
echo "1. Checking Git status..."
if git status | grep -q "nothing to commit"; then
    echo "   ✅ All changes committed"
else
    echo "   ❌ Uncommitted changes found! Run: git add . && git commit -m 'message'"
    exit 1
fi
echo ""

# Check 2: Python version
echo "2. Checking Python version..."
PYTHON_VERSION=$(python --version 2>&1 | grep -oP '\d+\.\d+')
if [[ $PYTHON_VERSION == 3.1* ]]; then
    echo "   ✅ Python $PYTHON_VERSION (compatible)"
else
    echo "   ⚠️  Python $PYTHON_VERSION (may not be compatible, needs 3.10+)"
fi
echo ""

# Check 3: Backend requirements
echo "3. Checking backend requirements.txt..."
if [ -f "backend/requirements.txt" ]; then
    echo "   ✅ requirements.txt found"
    echo "   Dependencies:"
    head -6 backend/requirements.txt | sed 's/^/      /'
else
    echo "   ❌ requirements.txt not found!"
    exit 1
fi
echo ""

# Check 4: Frontend package.json
echo "4. Checking frontend package.json..."
if [ -f "frontend/package.json" ]; then
    echo "   ✅ package.json found"
else
    echo "   ❌ package.json not found!"
    exit 1
fi
echo ""

# Check 5: Environment files
echo "5. Checking environment files..."
if [ -f "backend/.env" ]; then
    echo "   ⚠️  backend/.env exists (won't be in git)"
else
    echo "   ℹ️  backend/.env not needed (set via Render env vars)"
fi
if [ -f "frontend/.env" ]; then
    echo "   ⚠️  frontend/.env exists (won't be in git)"
else
    echo "   ℹ️  frontend/.env not needed (set via Render env vars)"
fi
echo ""

# Check 6: Main.py and index
echo "6. Checking entry points..."
if [ -f "backend/main.py" ]; then
    echo "   ✅ backend/main.py found"
else
    echo "   ❌ backend/main.py not found!"
    exit 1
fi
if [ -f "frontend/index.html" ]; then
    echo "   ✅ frontend/index.html found"
else
    echo "   ❌ frontend/index.html not found!"
    exit 1
fi
echo ""

# Check 7: Render config
echo "7. Checking Render configuration..."
if [ -f "backend/render.yaml" ]; then
    echo "   ✅ backend/render.yaml found"
else
    echo "   ℹ️  backend/render.yaml not required (create in Render UI)"
fi
echo ""

# Check 8: GitHub remote
echo "8. Checking GitHub remote..."
if git remote get-url origin | grep -q "github.com"; then
    echo "   ✅ GitHub remote configured: $(git remote get-url origin)"
else
    echo "   ❌ GitHub remote not configured!"
    exit 1
fi
echo ""

# Check 9: API configuration
echo "9. Checking API configuration..."
if grep -q "VITE_API_URL" frontend/src/utils/api.js 2>/dev/null; then
    echo "   ✅ Frontend API URL configured"
else
    echo "   ⚠️  Check frontend/src/utils/api.js"
fi
echo ""

echo "=================================================="
echo "✅ All checks passed! Ready to deploy."
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Push code: git push origin main"
echo "2. Go to render.com"
echo "3. Follow RENDER_DEPLOYMENT.md instructions"
echo ""
