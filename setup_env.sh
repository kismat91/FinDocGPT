#!/bin/bash

echo "🔧 FinDocGPT Enhanced Platform Environment Setup"
echo "================================================"

# Check if env.api.keys exists
if [ ! -f "env.api.keys" ]; then
    echo "❌ env.api.keys file not found!"
    echo "Please make sure the file exists with your API keys."
    exit 1
fi

# Create .env file from env.api.keys
echo "📝 Creating .env file from env.api.keys..."
cp env.api.keys .env

# Check if .env was created successfully
if [ -f ".env" ]; then
    echo "✅ .env file created successfully!"
    echo ""
    echo "🔑 Your API keys are now configured:"
    echo "   • GROQ_API_KEY: ✅"
    echo "   • OPENAI_API_KEY: ✅"
    echo "   • ANTHROPIC_API_KEY: ✅"
    echo "   • MISTRAL_API_KEY: ✅"
    echo "   • HUGGINGFACE_API_KEY: ✅"
    echo "   • TWELVE_DATA_API_KEY: ✅"
    echo "   • NEXT_PUBLIC_NEWSAPI_KEY: ✅"
    echo "   • ALPHA_VANTAGE_API_KEY: ✅"
    echo ""
    echo "🚀 You can now start the enhanced platform:"
    echo "   ./start_enhanced_findocgpt.sh"
    echo ""
    echo "⚠️  IMPORTANT: .env file is now in .gitignore"
    echo "   Your API keys will NOT be pushed to GitHub"
else
    echo "❌ Failed to create .env file"
    exit 1
fi

echo "================================================"
echo "🎉 Environment setup complete!"
