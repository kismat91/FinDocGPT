from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class DocumentCreate(BaseModel):
    filename: str
    file_type: str
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    upload_date: datetime
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True 