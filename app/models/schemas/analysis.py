from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AnalysisRequest(BaseModel):
    document_id: int
    question: str
    analysis_type: str = "qa"  # qa, sentiment, anomaly

class AnalysisResponse(BaseModel):
    id: int
    document_id: int
    analysis_type: str
    result: Dict[str, Any]
    confidence_score: Optional[float] = None
    created_at: str
    
    class Config:
        from_attributes = True

class QAResponse(BaseModel):
    question: str
    answer: str
    confidence: float
    sources: List[str] = []
    reasoning: Optional[str] = None

class AnomalyDetectionResponse(BaseModel):
    anomalies: List[Dict[str, Any]]
    risk_score: float
    recommendations: List[str]
    affected_metrics: List[str] 