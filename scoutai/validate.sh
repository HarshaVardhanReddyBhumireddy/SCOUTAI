#!/bin/bash

# ScoutAI Project Validation Script
# Checks if all files are present and valid

echo "🔍 ScoutAI Project Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0
WARNINGS=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ MISSING: $1"
        ((ERRORS++))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ MISSING: $1/"
        ((ERRORS++))
    fi
}

echo "📁 Checking Project Structure..."
echo "──────────────────────────────────────────────"

# Root files
check_file "README.md"
check_file "QUICKSTART.md"
check_file "ARCHITECTURE.md"
check_file "sample_output.json"
check_file ".gitignore"

echo ""
echo "📦 Checking Backend..."
echo "──────────────────────────────────────────────"

# Backend structure
check_dir "backend"
check_file "backend/main.py"
check_file "backend/jd_parser.py"
check_file "backend/matcher.py"
check_file "backend/outreach.py"
check_file "backend/scorer.py"
check_file "backend/candidate_db.py"
check_file "backend/requirements.txt"
check_file "backend/.env.example"
check_file "backend/run.sh"
check_file "backend/run.bat"
check_file "backend/render.yaml"

echo ""
echo "🎨 Checking Frontend..."
echo "──────────────────────────────────────────────"

# Frontend structure
check_dir "frontend"
check_dir "frontend/src"
check_dir "frontend/src/components"
check_dir "frontend/src/pages"
check_dir "frontend/src/utils"

check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
check_file "frontend/index.html"
check_file "frontend/.env.example"
check_file "frontend/run.sh"
check_file "frontend/run.bat"
check_file "frontend/vercel.json"

# Frontend source files
check_file "frontend/src/main.jsx"
check_file "frontend/src/App.jsx"
check_file "frontend/src/index.css"
check_file "frontend/src/components/Topbar.jsx"
check_file "frontend/src/components/UI.jsx"
check_file "frontend/src/pages/JDPage.jsx"
check_file "frontend/src/pages/CandidatesPage.jsx"
check_file "frontend/src/pages/OutreachPage.jsx"
check_file "frontend/src/pages/ShortlistPage.jsx"
check_file "frontend/src/utils/api.js"

echo ""
echo "🔬 Running Syntax Validation..."
echo "──────────────────────────────────────────────"

# Validate Python syntax
if command -v python3 &> /dev/null; then
    echo -n "Python files... "
    if python3 -m py_compile backend/*.py 2>/dev/null; then
        echo "✅ All valid"
    else
        echo "❌ Syntax errors found"
        ((ERRORS++))
    fi
else
    echo "⚠️  Python3 not found - skipping Python validation"
    ((WARNINGS++))
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "⚠️  Node.js not found"
    ((WARNINGS++))
fi

# Check Python
if command -v python3 &> /dev/null; then
    echo "✅ Python: $(python3 --version)"
else
    echo "⚠️  Python3 not found"
    ((WARNINGS++))
fi

echo ""
echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ $ERRORS missing files"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "⚠️  $WARNINGS warnings"
fi

echo ""
echo "📋 Next Steps:"
echo "──────────────────────────────────────────────"
echo "1. Get Anthropic API key: https://console.anthropic.com"
echo "2. Run backend: cd backend && ./run.sh"
echo "3. Run frontend: cd frontend && ./run.sh"
echo "4. Open: http://localhost:5173"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "🎉 Project validation successful!"
    exit 0
else
    echo "❌ Project validation failed - please fix errors above"
    exit 1
fi
