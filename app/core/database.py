from app.models.database.base import engine, Base
from app.models.database.models import (
    Document, AnalysisResult, FinancialForecast, 
    InvestmentStrategy, MarketData, SentimentAnalysis
)

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Database tables created successfully!") 