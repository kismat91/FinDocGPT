from fastapi import APIRouter
from app.api.v1.endpoints import documents, analysis, forecast, strategy, sentiment

api_router = APIRouter()

api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
api_router.include_router(strategy.router, prefix="/strategy", tags=["strategy"])
api_router.include_router(sentiment.router, prefix="/sentiment", tags=["sentiment"]) 