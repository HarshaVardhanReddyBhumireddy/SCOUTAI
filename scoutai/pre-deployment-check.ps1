# Pre-deployment Check for Windows (PowerShell)
# Run from: scoutai\ directory

Write-Host "=================================================="
Write-Host "ScoutAI - Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "=================================================="
Write-Host ""

# Check 1: Git status
Write-Host "1. Checking Git status..."
$gitStatus = git status 2>&1
if ($gitStatus -like "*nothing to commit*" -or $gitStatus -like "*working tree clean*") {
    Write-Host "   ✅ All changes committed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Uncommitted changes found!" -ForegroundColor Red
    Write-Host "   Run: git add . && git commit -m 'message'"
    exit 1
}
Write-Host ""

# Check 2: Python version
Write-Host "2. Checking Python version..."
$pythonVersion = python --version 2>&1
Write-Host "   $pythonVersion" -ForegroundColor Yellow
if ($pythonVersion -match "3.1[0-9]") {
    Write-Host "   ✅ Compatible version" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  May need Python 3.10+" -ForegroundColor Yellow
}
Write-Host ""

# Check 3: Backend requirements
Write-Host "3. Checking backend requirements.txt..."
if (Test-Path "backend/requirements.txt") {
    Write-Host "   ✅ requirements.txt found" -ForegroundColor Green
    Write-Host "   Dependencies:"
    Get-Content "backend/requirements.txt" | Select-Object -First 6 | ForEach-Object { Write-Host "      $_" }
} else {
    Write-Host "   ❌ requirements.txt not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check 4: Frontend package.json
Write-Host "4. Checking frontend package.json..."
if (Test-Path "frontend/package.json") {
    Write-Host "   ✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "   ❌ package.json not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check 5: Main.py and index
Write-Host "5. Checking entry points..."
if (Test-Path "backend/main.py") {
    Write-Host "   ✅ backend/main.py found" -ForegroundColor Green
} else {
    Write-Host "   ❌ backend/main.py not found!" -ForegroundColor Red
    exit 1
}
if (Test-Path "frontend/index.html") {
    Write-Host "   ✅ frontend/index.html found" -ForegroundColor Green
} else {
    Write-Host "   ❌ frontend/index.html not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check 6: GitHub remote
Write-Host "6. Checking GitHub remote..."
try {
    $gitRemote = git remote get-url origin
    if ($gitRemote -like "*github.com*") {
        Write-Host "   ✅ GitHub remote: $gitRemote" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ GitHub remote not configured!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=================================================="
Write-Host "✅ All checks passed! Ready to deploy." -ForegroundColor Green
Write-Host "=================================================="
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Push code: git push origin main"
Write-Host "2. Go to render.com"
Write-Host "3. Follow RENDER_DEPLOYMENT.md instructions"
Write-Host ""
