from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.database.base import get_db
from app.models.database.models import Document, AnalysisResult
from app.models.schemas.analysis import AnalysisRequest, AnalysisResponse, QAResponse, AnomalyDetectionResponse
from app.services.ai.document_qa import DocumentQA
from app.services.ai.anomaly_detector import AnomalyDetector

router = APIRouter()

@router.post("/qa", response_model=QAResponse)
async def ask_question(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    """Ask a question about a financial document"""
    
    # Get document
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Process question
    qa_service = DocumentQA()
    answer = await qa_service.ask_question(document.content, request.question)
    
    # Save analysis result
    analysis_result = AnalysisResult(
        document_id=request.document_id,
        analysis_type="qa",
        result={
            "question": request.question,
            "answer": answer["answer"],
            "confidence": answer["confidence"],
            "sources": answer.get("sources", [])
        },
        confidence_score=answer["confidence"]
    )
    
    db.add(analysis_result)
    db.commit()
    
    return QAResponse(
        question=request.question,
        answer=answer["answer"],
        confidence=answer["confidence"],
        sources=answer.get("sources", []),
        reasoning=answer.get("reasoning")
    )

@router.post("/anomaly", response_model=AnomalyDetectionResponse)
async def detect_anomalies(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    """Detect anomalies in financial document data"""
    
    # Get document
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Detect anomalies
    detector = AnomalyDetector()
    anomalies = await detector.detect_anomalies(document.content)
    
    # Save analysis result
    analysis_result = AnalysisResult(
        document_id=request.document_id,
        analysis_type="anomaly",
        result=anomalies,
        confidence_score=anomalies.get("confidence", 0.0)
    )
    
    db.add(analysis_result)
    db.commit()
    
    return AnomalyDetectionResponse(
        anomalies=anomalies.get("anomalies", []),
        risk_score=anomalies.get("risk_score", 0.0),
        recommendations=anomalies.get("recommendations", []),
        affected_metrics=anomalies.get("affected_metrics", [])
    )

@router.get("/results/{document_id}", response_model=List[AnalysisResponse])
async def get_analysis_results(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Get all analysis results for a document"""
    
    # Check if document exists
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Get analysis results
    results = db.query(AnalysisResult).filter(AnalysisResult.document_id == document_id).all()
    return [AnalysisResponse.from_orm(result) for result in results] 