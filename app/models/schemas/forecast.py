from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class ForecastRequest(BaseModel):
    symbol: str
    forecast_type: str = "stock_price"  # stock_price, earnings, revenue
    timeframe: str = "30d"  # 7d, 30d, 90d, 1y
    model_type: Optional[str] = "lstm"  # lstm, linear, arima

class ForecastResponse(BaseModel):
    symbol: str
    forecast_type: str
    predictions: List[Dict[str, Any]]
    confidence_interval: Dict[str, List[float]]
    model_used: str
    accuracy_metrics: Dict[str, float]
    last_updated: datetime
    
    class Config:
        from_attributes = True

class StockPriceForecast(BaseModel):
    date: str
    predicted_price: float
    confidence_lower: float
    confidence_upper: float
    volume_prediction: Optional[int] = None

class EarningsForecast(BaseModel):
    quarter: str
    predicted_earnings: float
    predicted_revenue: float
    growth_rate: float
    confidence_score: float 