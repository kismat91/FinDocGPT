from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json

app = FastAPI(
    title="FinDocGPT API",
    description="AI-Powered Financial Document Analysis & Investment Strategy",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple data models
class DocumentUpload(BaseModel):
    filename: str
    content: Optional[str] = None

class QuestionRequest(BaseModel):
    document_id: int
    question: str

class ForecastRequest(BaseModel):
    symbol: str
    forecast_type: str = "stock_price"
    timeframe: str = "30d"

class StrategyRequest(BaseModel):
    symbol: str
    risk_tolerance: str = "medium"

# Mock data storage
documents = []
analysis_results = []

@app.get("/")
async def root():
    return {
        "message": "Welcome to FinDocGPT API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FinDocGPT"}

@app.post("/api/v1/documents/upload")
async def upload_document(document: DocumentUpload):
    doc_id = len(documents) + 1
    doc = {
        "id": doc_id,
        "filename": document.filename,
        "content": document.content or "Sample financial document content",
        "upload_date": "2024-01-15T10:30:00Z"
    }
    documents.append(doc)
    return doc

@app.get("/api/v1/documents/")
async def get_documents():
    return documents

@app.post("/api/v1/analysis/qa")
async def ask_question(request: QuestionRequest):
    # Mock Q&A response
    return {
        "question": request.question,
        "answer": f"Based on the analysis of document {request.document_id}, here is the answer to your question: '{request.question}'. The document contains relevant financial information that indicates positive growth trends.",
        "confidence": 0.85,
        "sources": [f"Document {request.document_id}"],
        "reasoning": "Analysis based on document content and financial metrics extraction."
    }

@app.post("/api/v1/forecast/")
async def create_forecast(request: ForecastRequest):
    # Mock forecast response
    return {
        "symbol": request.symbol.upper(),
        "forecast_type": request.forecast_type,
        "predictions": [
            {"date": "2024-01-16", "predicted_price": 150.25, "confidence_lower": 145.50, "confidence_upper": 155.00},
            {"date": "2024-01-17", "predicted_price": 152.75, "confidence_lower": 147.80, "confidence_upper": 157.70},
            {"date": "2024-01-18", "predicted_price": 154.30, "confidence_lower": 149.20, "confidence_upper": 159.40}
        ],
        "confidence_interval": {
            "lower": [145.50, 147.80, 149.20],
            "upper": [155.00, 157.70, 159.40]
        },
        "model_used": "linear",
        "accuracy_metrics": {"rmse": 2.45, "mae": 1.89, "r2_score": 0.87},
        "last_updated": "2024-01-15T10:30:00Z"
    }

@app.post("/api/v1/strategy/recommend")
async def get_investment_recommendation(request: StrategyRequest):
    # Mock strategy response
    return {
        "symbol": request.symbol.upper(),
        "recommendation": "buy",
        "confidence_score": 0.75,
        "reasoning": f"Based on technical and fundamental analysis, {request.symbol.upper()} shows positive momentum. The stock is currently above key moving averages with strong volume support.",
        "risk_level": request.risk_tolerance,
        "target_price": 165.50,
        "stop_loss": 140.25,
        "time_horizon": "1y",
        "factors_considered": ["Moving Averages", "RSI", "MACD", "Volume Analysis", "P/E Ratio"],
        "created_at": "2024-01-15T10:30:00Z"
    }

@app.post("/api/v1/sentiment/analyze")
async def analyze_sentiment(document_id: int):
    # Mock sentiment analysis
    return {
        "document_id": document_id,
        "sentiment_score": 0.65,
        "sentiment_label": "positive",
        "confidence": 0.78,
        "keywords": ["revenue growth", "market expansion", "innovation", "competitive advantage"],
        "created_at": "2024-01-15T10:30:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 