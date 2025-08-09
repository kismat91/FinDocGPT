from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class StrategyRequest(BaseModel):
    symbol: str
    investment_amount: Optional[float] = None
    risk_tolerance: str = "medium"  # low, medium, high
    time_horizon: str = "1y"  # 3m, 6m, 1y, 5y
    include_technical_analysis: bool = True
    include_fundamental_analysis: bool = True

class StrategyResponse(BaseModel):
    symbol: str
    recommendation: str  # buy, sell, hold
    confidence_score: float
    reasoning: str
    risk_level: str
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None
    time_horizon: str
    factors_considered: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvestmentRecommendation(BaseModel):
    action: str  # buy, sell, hold
    confidence: float
    reasoning: List[str]
    risk_assessment: Dict[str, Any]
    technical_indicators: Dict[str, Any]
    fundamental_metrics: Dict[str, Any]
    market_sentiment: Dict[str, Any] 