#!/bin/bash

# FinDocGPT Development Script
set -e

echo "🚀 Starting FinDocGPT Development Environment..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping development servers..."
    pkill -f "uvicorn app.main" || true
    pkill -f "react-scripts" || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    exit 1
fi

# Start backend
echo "🐍 Starting backend server..."
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "⚛️  Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "🎉 Development environment started!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 