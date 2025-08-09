from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class SentimentResponse(BaseModel):
    document_id: int
    sentiment_score: float
    sentiment_label: str  # positive, negative, neutral
    confidence: float
    keywords: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class MarketSentiment(BaseModel):
    overall_sentiment: str
    sentiment_score: float
    confidence: float
    key_phrases: List[str]
    sentiment_trend: str  # improving, declining, stable
    risk_factors: List[str]
    positive_factors: List[str]
    negative_factors: List[str] 