from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database.base import get_db
from app.models.database.models import Document, SentimentAnalysis
from app.models.schemas.sentiment import SentimentResponse, MarketSentiment
from app.services.ai.sentiment_analyzer import SentimentAnalyzer

router = APIRouter()

@router.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Analyze sentiment of a financial document"""
    
    # Get document
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Analyze sentiment
    analyzer = SentimentAnalyzer()
    sentiment_result = await analyzer.analyze_sentiment(document.content)
    
    # Save sentiment analysis
    db_sentiment = SentimentAnalysis(
        document_id=document_id,
        sentiment_score=sentiment_result["score"],
        sentiment_label=sentiment_result["label"],
        confidence=sentiment_result["confidence"],
        keywords=sentiment_result.get("keywords", [])
    )
    
    db.add(db_sentiment)
    db.commit()
    db.refresh(db_sentiment)
    
    return SentimentResponse(
        document_id=document_id,
        sentiment_score=sentiment_result["score"],
        sentiment_label=sentiment_result["label"],
        confidence=sentiment_result["confidence"],
        keywords=sentiment_result.get("keywords", []),
        created_at=db_sentiment.created_at
    )

@router.get("/document/{document_id}", response_model=List[SentimentResponse])
async def get_document_sentiment(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Get sentiment analysis results for a document"""
    
    # Check if document exists
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Get sentiment analyses
    analyses = db.query(SentimentAnalysis).filter(
        SentimentAnalysis.document_id == document_id
    ).order_by(SentimentAnalysis.created_at.desc()).all()
    
    return [SentimentResponse.from_orm(analysis) for analysis in analyses]

@router.get("/market/{symbol}", response_model=MarketSentiment)
async def get_market_sentiment(
    symbol: str,
    db: Session = Depends(get_db)
):
    """Get market sentiment for a specific symbol based on related documents"""
    
    # Get documents related to the symbol (simple keyword matching)
    documents = db.query(Document).filter(
        Document.content.contains(symbol.upper())
    ).all()
    
    if not documents:
        raise HTTPException(status_code=404, detail="No documents found for this symbol")
    
    # Analyze sentiment for all documents
    analyzer = SentimentAnalyzer()
    sentiment_scores = []
    all_keywords = []
    positive_factors = []
    negative_factors = []
    
    for document in documents:
        sentiment_result = await analyzer.analyze_sentiment(document.content)
        sentiment_scores.append(sentiment_result["score"])
        all_keywords.extend(sentiment_result.get("keywords", []))
        
        # Extract positive and negative factors
        if sentiment_result["score"] > 0.1:
            positive_factors.append(f"Positive sentiment in {document.filename}")
        elif sentiment_result["score"] < -0.1:
            negative_factors.append(f"Negative sentiment in {document.filename}")
    
    # Calculate overall sentiment
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
    
    # Determine sentiment trend
    if avg_sentiment > 0.2:
        sentiment_trend = "improving"
        overall_sentiment = "positive"
    elif avg_sentiment < -0.2:
        sentiment_trend = "declining"
        overall_sentiment = "negative"
    else:
        sentiment_trend = "stable"
        overall_sentiment = "neutral"
    
    # Calculate confidence based on number of documents
    confidence = min(len(documents) / 10.0, 1.0)  # Higher confidence with more documents
    
    return MarketSentiment(
        overall_sentiment=overall_sentiment,
        sentiment_score=avg_sentiment,
        confidence=confidence,
        key_phrases=list(set(all_keywords)),
        sentiment_trend=sentiment_trend,
        risk_factors=negative_factors,
        positive_factors=positive_factors,
        negative_factors=negative_factors
    )

@router.get("/trends", response_model=List[dict])
async def get_sentiment_trends(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get recent sentiment trends across all documents"""
    
    # Get recent sentiment analyses
    analyses = db.query(SentimentAnalysis).order_by(
        SentimentAnalysis.created_at.desc()
    ).limit(limit).all()
    
    trends = []
    for analysis in analyses:
        document = db.query(Document).filter(Document.id == analysis.document_id).first()
        if document:
            trends.append({
                "document_id": analysis.document_id,
                "filename": document.filename,
                "sentiment_score": analysis.sentiment_score,
                "sentiment_label": analysis.sentiment_label,
                "confidence": analysis.confidence,
                "created_at": analysis.created_at.isoformat()
            })
    
    return trends 