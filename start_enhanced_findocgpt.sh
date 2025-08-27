#!/bin/bash

echo "🚀 Starting Enhanced FinDocGPT Platform..."
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it with your API keys."
    exit 1
fi

# Load environment variables
source .env.local

# Check required API keys
echo "🔑 Checking API keys..."
if [ -z "$GROQ_API_KEY" ]; then
    echo "❌ GROQ_API_KEY not found in .env.local"
    exit 1
fi

if [ -z "$TWELVE_DATA_API_KEY" ]; then
    echo "❌ TWELVE_DATA_API_KEY not found in .env.local"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_NEWSAPI_KEY" ]; then
    echo "❌ NEXT_PUBLIC_NEWSAPI_KEY not found in .env.local"
    exit 1
fi

echo "✅ All required API keys found"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check Python backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Python Backend (Port 8000): HEALTHY"
else
    echo "❌ Python Backend (Port 8000): UNHEALTHY"
fi

# Check Next.js frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Next.js Frontend (Port 3000): HEALTHY"
else
    echo "❌ Next.js Frontend (Port 3000): UNHEALTHY"
fi

# Check Redis
if docker exec findocgpt-redis-1 redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis Cache (Port 6379): HEALTHY"
else
    echo "❌ Redis Cache (Port 6379): UNHEALTHY"
fi

echo ""
echo "🎉 Enhanced FinDocGPT Platform is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "🏥 Health Check: http://localhost:8000/health"
echo ""
echo "🚀 New Features Available:"
echo "   • Advanced Document AI with OCR + Computer Vision"
echo "   • Multi-Agent AI System"
echo "   • RAG (Retrieval Augmented Generation)"
echo "   • Vector Database (ChromaDB + FAISS)"
echo "   • Multiple LLM Providers (Groq, OpenAI, Anthropic)"
echo "   • Enhanced Financial Analysis"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""

# Show running containers
echo "🐳 Running containers:"
docker-compose ps
