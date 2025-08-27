#!/bin/bash

# 🚀 TradePro Platform - Virtual Environment Setup Script
# This script will set up your complete development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status "Detected macOS system"
    PLATFORM="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_status "Detected Linux system"
    PLATFORM="linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    print_status "Detected Windows system"
    PLATFORM="windows"
else
    print_warning "Unknown operating system: $OSTYPE"
    PLATFORM="unknown"
fi

print_header "🚀 TradePro Platform Setup"
print_status "Setting up your development environment..."

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    print_status "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    print_status "Please upgrade Node.js and try again."
    exit 1
fi

print_success "Node.js $(node --version) ✓"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm $(npm --version) ✓"

# Check Git
if ! command -v git &> /dev/null; then
    print_warning "Git is not installed. Some features may not work properly."
else
    print_success "Git $(git --version) ✓"
fi

print_header "📦 Installing Dependencies"

# Install dependencies
print_status "Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully ✓"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_header "🔧 Environment Configuration"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    print_status "Creating .env.local file..."
    if [ -f env.example ]; then
        cp env.example .env.local
        print_success "Created .env.local from env.example ✓"
        print_warning "Please edit .env.local and add your API keys"
    else
        print_warning "env.example not found. Creating basic .env.local..."
        cat > .env.local << EOF
# TradePro Platform Environment Configuration
# Add your API keys here

# Required APIs
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key_here
TWELVE_DATA_API_KEY=your_twelvedata_api_key_here
NEXT_PUBLIC_TWELVEDATA_API_KEY=your_twelvedata_api_key_here
NEXT_PUBLIC_GROK_API_KEY=your_groq_api_key_here

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
        print_success "Created basic .env.local ✓"
    fi
else
    print_success ".env.local already exists ✓"
fi

print_header "🧹 Code Quality Setup"

# Install additional development tools
print_status "Setting up code quality tools..."

# Check if ESLint is configured
if [ -f .eslintrc.json ] || [ -f .eslintrc.js ]; then
    print_success "ESLint configuration found ✓"
else
    print_warning "ESLint configuration not found. Consider adding ESLint for code quality."
fi

# Check if Prettier is configured
if [ -f .prettierrc ] || [ -f .prettierrc.json ]; then
    print_success "Prettier configuration found ✓"
else
    print_warning "Prettier configuration not found. Consider adding Prettier for code formatting."
fi

print_header "🐳 Docker Setup (Optional)"

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_success "Docker is available ✓"
    
    # Create Docker Compose file if it doesn't exist
    if [ ! -f docker-compose.yml ]; then
        print_status "Creating docker-compose.yml for development..."
        cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # Add Redis for caching (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
EOF
        print_success "Created docker-compose.yml ✓"
    else
        print_success "docker-compose.yml already exists ✓"
    fi
else
    print_warning "Docker not available. Skipping Docker setup."
fi

print_header "📱 Development Tools"

# Create VS Code settings if it doesn't exist
if [ ! -d .vscode ]; then
    print_status "Creating VS Code workspace settings..."
    mkdir -p .vscode
    
    cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF

    cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
EOF

    print_success "Created VS Code workspace settings ✓"
else
    print_success "VS Code settings already exist ✓"
fi

print_header "🚀 Quick Start Commands"

# Create a quick start script
cat > quick-start.sh << 'EOF'
#!/bin/bash

echo "🚀 TradePro Platform - Quick Start"
echo "=================================="
echo ""
echo "Available commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run start   - Start production server"
echo "  npm run lint    - Run ESLint"
echo "  npm run test    - Run tests"
echo ""
echo "🌐 Open your browser to: http://localhost:3000"
echo ""
echo "📚 Documentation: Check README.md for more details"
echo "🔧 Configuration: Edit .env.local with your API keys"
EOF

chmod +x quick-start.sh
print_success "Created quick-start.sh script ✓"

print_header "✅ Setup Complete!"

print_success "Your TradePro Platform development environment is ready!"
echo ""
echo "📋 Next steps:"
echo "  1. Edit .env.local and add your API keys"
echo "  2. Run 'npm run dev' to start development"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Required API keys:"
echo "  - NEXT_PUBLIC_NEWSAPI_KEY (News API)"
echo "  - TWELVE_DATA_API_KEY (Twelve Data)"
echo "  - NEXT_PUBLIC_GROK_API_KEY (Groq API)"
echo ""
echo "📚 For help getting API keys, check the env.example file"
echo "🐳 For Docker setup, run 'docker-compose up'"
echo ""

print_status "Happy coding! 🎉"

# Make the script executable
chmod +x setup.sh
