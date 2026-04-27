@echo off
REM ScoutAI Backend Startup Script (Windows)

echo 🚀 Starting ScoutAI Backend...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.10+
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -q -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo ⚠️  Warning: .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please add your ANTHROPIC_API_KEY to .env file
    echo    Get your API key from: https://console.anthropic.com
    echo.
    pause
)

REM Start the server
echo 🌐 Starting FastAPI server on http://localhost:8000
echo 📚 API docs available at http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ─────────────────────────────────────────────────
echo.

python main.py
