# FinDocGPT - AI-Powered Financial Document Analysis & Investment Strategy

An intelligent AI system that transforms financial data analysis, predicts market trends, and generates actionable investment recommendations.

## 🚀 Features

### Stage 1: Insights & Analysis (Document Q&A)
- **Document Q&A**: Answer questions based on financial data (revenue, risks, performance)
- **Market Sentiment Analysis**: Quantify sentiment from financial communications
- **Anomaly Detection**: Identify unusual changes in financial metrics

### Stage 2: Financial Forecasting
- **Predict Financial Trends**: Forecast stock prices, earnings growth, and market performance
- **External Data Integration**: Yahoo Finance API, Alpha Vantage integration
- **Forecasting Models**: ML models for stock movements and earnings predictions

### Stage 3: Investment Strategy & Decision-Making
- **Investment Decision-Making**: Buy/Sell recommendations based on predictions
- **Strategic Decision Support**: Clear investment recommendations using financial data

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python 3.9+
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: SQLite
- **AI/ML**: scikit-learn, pandas, numpy
- **APIs**: Yahoo Finance, Alpha Vantage
- **Deployment**: Docker

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create a `.env` file in the root directory:
```env
ALPHA_VANTAGE_API_KEY=your_api_key_here
OPENAI_API_KEY=your_openai_key_here
```

## 🎯 Usage

1. **Upload Financial Documents**: Upload earnings reports, filings, or press releases
2. **Ask Questions**: Query the system about financial data and insights
3. **View Predictions**: See AI-generated forecasts and market trends
4. **Get Recommendations**: Receive buy/sell recommendations based on analysis

## 📊 API Endpoints

- `POST /api/documents/upload` - Upload financial documents
- `POST /api/qa/ask` - Ask questions about financial data
- `GET /api/forecast/{symbol}` - Get financial forecasts
- `POST /api/strategy/recommend` - Get investment recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details