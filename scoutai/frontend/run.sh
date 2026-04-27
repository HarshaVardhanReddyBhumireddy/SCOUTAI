#!/bin/bash

# ScoutAI Frontend Startup Script

echo "🎨 Starting ScoutAI Frontend..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js 18+"
    exit 1
fi

node_version=$(node --version)
echo "✓ Node.js version: $node_version"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
fi

# Start the development server
echo "🌐 Starting Vite dev server..."
echo "📱 Frontend will be available at http://localhost:5173"
echo ""
echo "Make sure the backend is running on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo "─────────────────────────────────────────────────"
echo ""

npm run dev
