#!/bin/bash

echo "🚀 Setting up FinDocGPT - AI-Powered Financial Analysis Platform"
echo "================================================================"

# Check if Python 3.9+ is installed
python_version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
required_version="3.9"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Python $python_version is installed"
else
    echo "❌ Python 3.9+ is required. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
else
    echo "❌ Node.js is required. Please install Node.js 16+."
    exit 1
fi

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "🗄️  Initializing database..."
python init_db.py

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads data models static

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

# Build frontend (optional for development)
echo "🔨 Building frontend..."
npm run build

cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# FinDocGPT Environment Variables
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Customize these settings
DATABASE_URL=sqlite:///./findocgpt.db
UPLOAD_DIR=uploads
MODEL_CACHE_DIR=models
EOF
    echo "✅ .env file created. Please update with your API keys."
fi

echo ""
echo "🎉 FinDocGPT setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your API keys"
echo "2. Start the backend: python -m uvicorn app.main:app --reload"
echo "3. Start the frontend: cd frontend && npm start"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🐳 Or use Docker: docker-compose up --build"
echo ""
echo "📚 Documentation: Check README.md for detailed instructions" 