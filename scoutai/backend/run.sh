#!/bin/bash

# ScoutAI Backend Startup Script

echo "🚀 Starting ScoutAI Backend..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please add your ANTHROPIC_API_KEY to .env file"
    echo "   Get your API key from: https://console.anthropic.com"
    echo ""
    read -p "Press Enter to continue (or Ctrl+C to exit and configure)..."
fi

# Check if API key is set
if ! grep -q "ANTHROPIC_API_KEY=sk-" .env 2>/dev/null; then
    echo ""
    echo "⚠️  WARNING: ANTHROPIC_API_KEY not configured in .env"
    echo "   Conversation simulation will use fallback templates"
    echo ""
fi

# Start the server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo "─────────────────────────────────────────────────"
echo ""

python main.py
