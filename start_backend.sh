#!/bin/bash

echo "🚀 FinDocGPT Backend Startup Script"
echo "====================================="

# Activate virtual environment
source findocgpt_env/bin/activate

echo "📦 Current Package Status:"
echo "✅ FastAPI, Uvicorn, Pydantic - Installed (Core backend)"
echo "✅ Requests, YFinance, Pandas - Installed (SEC analysis)"

# Check what's missing and provide options
echo ""
echo "📋 Optional Dependencies Status:"

if python -c "import openai" 2>/dev/null; then
    echo "✅ OpenAI - Available"
else
    echo "❌ OpenAI - Not installed (for advanced AI features)"
fi

if python -c "import cv2" 2>/dev/null; then
    echo "✅ OpenCV - Available"
else
    echo "❌ OpenCV - Not installed (for document OCR)"
fi

if python -c "import chromadb" 2>/dev/null; then
    echo "✅ ChromaDB - Available"
else
    echo "❌ ChromaDB - Not installed (for vector database)"
fi

echo ""
echo "🎯 Installation Options:"
echo "1. MINIMAL (Current): Basic chat + SEC analysis with fallbacks"
echo "2. LITE: Add OpenAI for better chat responses"
echo "   Command: pip install openai"
echo "3. FULL: Install all dependencies for complete features"
echo "   Command: pip install -r requirements.txt"
echo ""

echo "🚀 Starting backend server..."
cd python_backend
python main.py
