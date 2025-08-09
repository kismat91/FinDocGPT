# FinDocGPT - AI-Powered Financial Document Analysis & Investment Strategy

A comprehensive financial analysis platform that combines AI-powered document processing, market forecasting, and investment strategy recommendations.

## 🚀 Features

- **Document Analysis**: AI-powered analysis of financial documents (PDF, Excel)
- **Market Forecasting**: Advanced time series forecasting using machine learning
- **Investment Strategy**: Data-driven investment recommendations
- **Sentiment Analysis**: Market sentiment analysis from news and social media
- **Anomaly Detection**: Identify unusual patterns in financial data
- **Real-time Data**: Integration with Yahoo Finance and Alpha Vantage APIs

## 🛠️ Technical Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Lightweight database
- **OpenAI GPT** - AI document processing
- **Scikit-learn** - Machine learning models
- **Pandas/NumPy** - Data processing
- **yfinance/Alpha Vantage** - Financial data APIs

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **Gunicorn** - Production WSGI server

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## 🚀 Quick Start (Production)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FinDocGPT.git
   cd FinDocGPT
   ```

2. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys and settings
   ```

3. **Deploy with Docker**
   ```bash
   ./deploy.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Development Setup

1. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Initialize database
   python init_db.py
   
   # Run development server
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Required API Keys
OPENAI_API_KEY=your_openai_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

# Security
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./findocgpt.db

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Production Settings
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=INFO
```

## 📊 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `GET /` - API information

### Document Analysis
- `POST /api/v1/documents/upload` - Upload financial documents
- `POST /api/v1/analysis/qa` - Document Q&A
- `POST /api/v1/analysis/anomaly` - Anomaly detection

### Financial Forecasting
- `POST /api/v1/forecast/` - Generate market forecasts
- `GET /api/v1/forecast/history` - Get forecast history

### Investment Strategy
- `POST /api/v1/strategy/recommend` - Get investment recommendations
- `GET /api/v1/strategy/portfolio` - Portfolio analysis

### Sentiment Analysis
- `POST /api/v1/sentiment/analyze` - Analyze market sentiment

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose build --no-cache

# Update and restart
docker-compose pull && docker-compose up -d
```

## 🔒 Security Features

- **Rate Limiting**: API rate limiting via Nginx
- **CORS Protection**: Configured CORS policies
- **Security Headers**: XSS protection, content type validation
- **Input Validation**: Pydantic models for data validation
- **Error Handling**: Global exception handling
- **Logging**: Comprehensive logging system

## 📈 Monitoring

- **Health Checks**: Built-in health check endpoints
- **Logging**: Structured logging with rotation
- **Metrics**: Request/response monitoring
- **Error Tracking**: Global exception handling

## 🚀 Production Deployment

### Using Docker Compose (Recommended)
```bash
./deploy.sh
```

### Manual Deployment
1. Set up a production server
2. Install Docker and Docker Compose
3. Configure environment variables
4. Run `docker-compose up -d`

### SSL/HTTPS Setup
1. Obtain SSL certificates
2. Place certificates in `./ssl/` directory
3. Uncomment HTTPS server block in `nginx.conf`
4. Update domain name in nginx configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the logs for debugging information

## 🔄 Updates

To update the application:
```bash
git pull origin main
./deploy.sh
```