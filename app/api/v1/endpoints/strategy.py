from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database.base import get_db
from app.models.database.models import InvestmentStrategy
from app.models.schemas.strategy import StrategyRequest, StrategyResponse, InvestmentRecommendation
from app.services.financial.strategy_service import StrategyService

router = APIRouter()

@router.post("/recommend", response_model=StrategyResponse)
async def get_investment_recommendation(
    request: StrategyRequest,
    db: Session = Depends(get_db)
):
    """Get investment recommendation for a symbol"""
    
    # Create strategy service
    strategy_service = StrategyService()
    
    # Generate recommendation
    recommendation = await strategy_service.generate_recommendation(
        symbol=request.symbol,
        investment_amount=request.investment_amount,
        risk_tolerance=request.risk_tolerance,
        time_horizon=request.time_horizon,
        include_technical_analysis=request.include_technical_analysis,
        include_fundamental_analysis=request.include_fundamental_analysis
    )
    
    # Save strategy to database
    db_strategy = InvestmentStrategy(
        symbol=request.symbol.upper(),
        recommendation=recommendation["action"],
        confidence_score=recommendation["confidence"],
        reasoning=recommendation["reasoning"],
        risk_level=recommendation.get("risk_level", "medium"),
        target_price=recommendation.get("target_price"),
        stop_loss=recommendation.get("stop_loss"),
        strategy_factors=recommendation.get("factors", {})
    )
    
    db.add(db_strategy)
    db.commit()
    db.refresh(db_strategy)
    
    return StrategyResponse(
        symbol=request.symbol.upper(),
        recommendation=recommendation["action"],
        confidence_score=recommendation["confidence"],
        reasoning=recommendation["reasoning"],
        risk_level=recommendation.get("risk_level", "medium"),
        target_price=recommendation.get("target_price"),
        stop_loss=recommendation.get("stop_loss"),
        time_horizon=request.time_horizon,
        factors_considered=recommendation.get("factors_considered", []),
        created_at=db_strategy.created_at
    )

@router.get("/{symbol}/history", response_model=List[StrategyResponse])
async def get_strategy_history(
    symbol: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get investment strategy history for a symbol"""
    
    strategies = db.query(InvestmentStrategy).filter(
        InvestmentStrategy.symbol == symbol.upper()
    ).order_by(InvestmentStrategy.created_at.desc()).limit(limit).all()
    
    return [
        StrategyResponse(
            symbol=strategy.symbol,
            recommendation=strategy.recommendation,
            confidence_score=strategy.confidence_score,
            reasoning=strategy.reasoning,
            risk_level=strategy.risk_level,
            target_price=strategy.target_price,
            stop_loss=strategy.stop_loss,
            time_horizon="1y",  # Default
            factors_considered=strategy.strategy_factors.get("factors", []) if strategy.strategy_factors else [],
            created_at=strategy.created_at
        )
        for strategy in strategies
    ]

@router.get("/{symbol}/latest", response_model=StrategyResponse)
async def get_latest_strategy(
    symbol: str,
    db: Session = Depends(get_db)
):
    """Get the latest investment strategy for a symbol"""
    
    strategy = db.query(InvestmentStrategy).filter(
        InvestmentStrategy.symbol == symbol.upper()
    ).order_by(InvestmentStrategy.created_at.desc()).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="No strategy found for this symbol")
    
    return StrategyResponse(
        symbol=strategy.symbol,
        recommendation=strategy.recommendation,
        confidence_score=strategy.confidence_score,
        reasoning=strategy.reasoning,
        risk_level=strategy.risk_level,
        target_price=strategy.target_price,
        stop_loss=strategy.stop_loss,
        time_horizon="1y",  # Default
        factors_considered=strategy.strategy_factors.get("factors", []) if strategy.strategy_factors else [],
        created_at=strategy.created_at
    )

@router.get("/portfolio/overview")
async def get_portfolio_overview(
    symbols: List[str] = None,
    db: Session = Depends(get_db)
):
    """Get portfolio overview with recommendations for multiple symbols"""
    
    if not symbols:
        # Get all unique symbols from strategies
        symbols = [strategy.symbol for strategy in db.query(InvestmentStrategy.symbol).distinct().all()]
    
    portfolio_overview = []
    
    for symbol in symbols:
        latest_strategy = db.query(InvestmentStrategy).filter(
            InvestmentStrategy.symbol == symbol
        ).order_by(InvestmentStrategy.created_at.desc()).first()
        
        if latest_strategy:
            portfolio_overview.append({
                "symbol": symbol,
                "recommendation": latest_strategy.recommendation,
                "confidence": latest_strategy.confidence_score,
                "risk_level": latest_strategy.risk_level,
                "last_updated": latest_strategy.created_at.isoformat()
            })
    
    return {
        "portfolio_overview": portfolio_overview,
        "total_symbols": len(portfolio_overview),
        "buy_recommendations": len([p for p in portfolio_overview if p["recommendation"] == "buy"]),
        "sell_recommendations": len([p for p in portfolio_overview if p["recommendation"] == "sell"]),
        "hold_recommendations": len([p for p in portfolio_overview if p["recommendation"] == "hold"])
    } 