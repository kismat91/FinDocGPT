from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON
from sqlalchemy.sql import func
from app.models.database.base import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    content = Column(Text)
    metadata = Column(JSON)
    
class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=False)
    analysis_type = Column(String, nullable=False)  # sentiment, qa, anomaly
    result = Column(JSON, nullable=False)
    confidence_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class FinancialForecast(Base):
    __tablename__ = "financial_forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    forecast_type = Column(String, nullable=False)  # stock_price, earnings, revenue
    forecast_date = Column(DateTime(timezone=True), server_default=func.now())
    predicted_value = Column(Float, nullable=False)
    confidence_interval = Column(JSON)
    model_used = Column(String)
    historical_data = Column(JSON)
    
class InvestmentStrategy(Base):
    __tablename__ = "investment_strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    recommendation = Column(String, nullable=False)  # buy, sell, hold
    confidence_score = Column(Float, nullable=False)
    reasoning = Column(Text)
    risk_level = Column(String)  # low, medium, high
    target_price = Column(Float)
    stop_loss = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    strategy_factors = Column(JSON)
    
class MarketData(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    open_price = Column(Float)
    close_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    volume = Column(Integer)
    market_cap = Column(Float)
    pe_ratio = Column(Float)
    dividend_yield = Column(Float)
    
class SentimentAnalysis(Base):
    __tablename__ = "sentiment_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=False)
    sentiment_score = Column(Float, nullable=False)
    sentiment_label = Column(String, nullable=False)  # positive, negative, neutral
    confidence = Column(Float)
    keywords = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 