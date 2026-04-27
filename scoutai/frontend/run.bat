@echo off
REM ScoutAI Frontend Startup Script (Windows)

echo 🎨 Starting ScoutAI Frontend...
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

REM Check for .env file
if not exist ".env" (
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
)

REM Start the development server
echo 🌐 Starting Vite dev server...
echo 📱 Frontend will be available at http://localhost:5173
echo.
echo Make sure the backend is running on http://localhost:8000
echo Press Ctrl+C to stop the server
echo ─────────────────────────────────────────────────
echo.

npm run dev
