from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database.base import get_db
from app.models.database.models import FinancialForecast
from app.models.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.financial.forecast_service import ForecastService

router = APIRouter()

@router.post("/", response_model=ForecastResponse)
async def create_forecast(
    request: ForecastRequest,
    db: Session = Depends(get_db)
):
    """Create a financial forecast for a given symbol"""
    
    # Create forecast service
    forecast_service = ForecastService()
    
    # Generate forecast
    forecast_data = await forecast_service.generate_forecast(
        symbol=request.symbol,
        forecast_type=request.forecast_type,
        timeframe=request.timeframe,
        model_type=request.model_type
    )
    
    # Save forecast to database
    db_forecast = FinancialForecast(
        symbol=request.symbol,
        forecast_type=request.forecast_type,
        predicted_value=forecast_data["predicted_value"],
        confidence_interval=forecast_data.get("confidence_interval", {}),
        model_used=forecast_data.get("model_used", "lstm"),
        historical_data=forecast_data.get("historical_data", {})
    )
    
    db.add(db_forecast)
    db.commit()
    db.refresh(db_forecast)
    
    return ForecastResponse(
        symbol=request.symbol,
        forecast_type=request.forecast_type,
        predictions=forecast_data["predictions"],
        confidence_interval=forecast_data.get("confidence_interval", {}),
        model_used=forecast_data.get("model_used", "lstm"),
        accuracy_metrics=forecast_data.get("accuracy_metrics", {}),
        last_updated=db_forecast.forecast_date
    )

@router.get("/{symbol}", response_model=List[ForecastResponse])
async def get_forecasts(
    symbol: str,
    forecast_type: str = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get forecasts for a specific symbol"""
    
    query = db.query(FinancialForecast).filter(FinancialForecast.symbol == symbol.upper())
    
    if forecast_type:
        query = query.filter(FinancialForecast.forecast_type == forecast_type)
    
    forecasts = query.order_by(FinancialForecast.forecast_date.desc()).limit(limit).all()
    
    return [
        ForecastResponse(
            symbol=forecast.symbol,
            forecast_type=forecast.forecast_type,
            predictions=[{
                "date": forecast.forecast_date.isoformat(),
                "predicted_value": forecast.predicted_value,
                "confidence_interval": forecast.confidence_interval
            }],
            confidence_interval=forecast.confidence_interval or {},
            model_used=forecast.model_used or "lstm",
            accuracy_metrics={},
            last_updated=forecast.forecast_date
        )
        for forecast in forecasts
    ]

@router.get("/{symbol}/latest", response_model=ForecastResponse)
async def get_latest_forecast(
    symbol: str,
    forecast_type: str = "stock_price",
    db: Session = Depends(get_db)
):
    """Get the latest forecast for a symbol"""
    
    forecast = db.query(FinancialForecast).filter(
        FinancialForecast.symbol == symbol.upper(),
        FinancialForecast.forecast_type == forecast_type
    ).order_by(FinancialForecast.forecast_date.desc()).first()
    
    if not forecast:
        raise HTTPException(status_code=404, detail="No forecast found for this symbol")
    
    return ForecastResponse(
        symbol=forecast.symbol,
        forecast_type=forecast.forecast_type,
        predictions=[{
            "date": forecast.forecast_date.isoformat(),
            "predicted_value": forecast.predicted_value,
            "confidence_interval": forecast.confidence_interval
        }],
        confidence_interval=forecast.confidence_interval or {},
        model_used=forecast.model_used or "lstm",
        accuracy_metrics={},
        last_updated=forecast.forecast_date
    ) 