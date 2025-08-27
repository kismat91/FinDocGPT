# 🚀 TradePro Platform - Development Guide

> **Complete guide to setting up and developing with the TradePro Platform**

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Prerequisites](#-prerequisites)
3. [Environment Setup](#-environment-setup)
4. [Development Workflow](#-development-workflow)
5. [API Configuration](#-api-configuration)
6. [Testing](#-testing)
7. [Deployment](#-deployment)
8. [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd FinDocGPT

# Run the automated setup script
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local with your API keys
# Start development server
npm run dev
```

## 📋 Prerequisites

### Required Software

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 8+** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Optional Software

- **Docker** - [Download here](https://www.docker.com/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Postman** - For API testing

### System Requirements

- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 2GB+ free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 🔧 Environment Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd FinDocGPT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your API keys
nano .env.local  # or use your preferred editor
```

### 4. Required Environment Variables

```env
# Essential APIs (Must be configured)
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key
TWELVE_DATA_API_KEY=your_twelvedata_api_key
NEXT_PUBLIC_TWELVEDATA_API_KEY=your_twelvedata_api_key
NEXT_PUBLIC_GROK_API_KEY=your_groq_api_key

# Application settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Get API Keys

#### News API
1. Visit [newsapi.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key

#### Twelve Data
1. Visit [twelvedata.com](https://twelvedata.com/)
2. Create an account
3. Get your API key from dashboard

#### Groq API
1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up and get API key

## 🚀 Development Workflow

### Start Development Server

```bash
npm run dev
```

Your application will be available at: http://localhost:3000

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |
| `npm run test` | Run test suite |
| `npm run analyze` | Analyze bundle size |

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test

# Bundle analysis
npm run analyze
```

## 🐳 Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Commands

```bash
# Build development image
docker build --target development -t tradepro-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app tradepro-dev

# Build production image
docker build --target production -t tradepro-prod .

# Run production container
docker run -p 3000:3000 tradepro-prod
```

## 🔍 Code Quality

### ESLint Configuration

The project uses ESLint for code quality. Configuration is in `.eslintrc.json`.

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Prettier Configuration

Prettier is configured for consistent code formatting.

```bash
# Format code
npx prettier --write .

# Check formatting
npx prettier --check .
```

### TypeScript

```bash
# Type checking
npm run type-check

# Build with type checking
npm run build
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/     # Component tests
├── pages/         # Page tests
├── api/           # API route tests
└── utils/         # Utility function tests
```

## 📱 Development Tools

### VS Code Extensions

The project includes VS Code workspace settings with recommended extensions:

- **Tailwind CSS IntelliSense** - Tailwind CSS support
- **Prettier** - Code formatting
- **ESLint** - Code quality
- **TypeScript** - TypeScript support
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Path Intellisense** - Path autocompletion

### Browser Extensions

- **React Developer Tools** - React debugging
- **Redux DevTools** - State management debugging
- **Tailwind CSS Debugger** - Tailwind debugging

## 🌐 API Development

### Local API Development

```bash
# Start development server
npm run dev

# API endpoints available at:
# http://localhost:3000/api/stocks
# http://localhost:3000/api/forexs
# http://localhost:3000/api/cryptos
# http://localhost:3000/api/documents/parse
# http://localhost:3000/api/forecasting/earnings
# http://localhost:3000/api/strategy/recommendations
```

### API Testing

```bash
# Test API endpoints
curl http://localhost:3000/api/stocks

# Test with parameters
curl "http://localhost:3000/api/forexs?page=1&perPage=10"
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to configure
```

### Docker Production

```bash
# Build production image
docker build --target production -t tradepro-prod .

# Run production container
docker run -p 3000:3000 -e NODE_ENV=production tradepro-prod
```

### Traditional Hosting

```bash
# Build application
npm run build

# Start production server
npm run start
```

## 🔧 Configuration

### Next.js Configuration

The project uses Next.js 15 with the App Router. Configuration is in `next.config.js`.

### Tailwind CSS

Tailwind CSS is configured with a custom design system. Configuration is in `tailwind.config.ts`.

### TypeScript

TypeScript configuration is in `tsconfig.json` with strict type checking enabled.

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

#### Docker Issues

```bash
# Clean Docker
docker system prune -a

# Rebuild images
docker-compose build --no-cache
```

### Environment Issues

- Ensure all required environment variables are set
- Check API key validity
- Verify API rate limits

### Performance Issues

- Check Node.js version (18+ required)
- Monitor memory usage
- Use production build for testing

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### API Documentation

- [News API](https://newsapi.org/docs)
- [Twelve Data API](https://twelvedata.com/docs)
- [Groq API](https://console.groq.com/docs)

### Community

- [GitHub Issues](https://github.com/your-repo/issues)
- [GitHub Discussions](https://github.com/your-repo/discussions)
- [Discord Community](https://discord.gg/your-community)

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint rules
- Format code with Prettier
- Write meaningful commit messages
- Add tests for new features

---

## 🎉 Getting Help

If you encounter any issues:

1. Check this documentation
2. Search existing issues
3. Create a new issue with details
4. Join our community

**Happy coding! 🚀**
