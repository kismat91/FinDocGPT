from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
import json

# Import our custom modules
from services.document_processor import DocumentProcessor
from services.ai_analyzer import AIAnalyzer
from services.vector_store import VectorStore
from services.multi_agent import MultiAgentSystem

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FinDocGPT Advanced AI Backend",
    description="Advanced document processing, OCR, computer vision, and AI analysis for financial documents",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
document_processor = DocumentProcessor()
ai_analyzer = AIAnalyzer()
vector_store = VectorStore()
multi_agent = MultiAgentSystem()

@app.get("/")
async def root():
    return {
        "message": "FinDocGPT Advanced AI Backend",
        "version": "2.0.0",
        "status": "running",
        "features": [
            "Advanced Document Processing",
            "OCR + Computer Vision",
            "Multi-Agent AI System",
            "RAG with Vector Database",
            "Enhanced Financial Analysis"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": ["document_processing", "ai_analysis", "vector_store", "multi_agent"]}

@app.post("/api/enhanced-document-analysis")
async def enhanced_document_analysis(
    file: UploadFile = File(...),
    analysis_type: str = "comprehensive",
    include_ocr: bool = True,
    include_layout: bool = True,
    include_tables: bool = True
):
    """
    Enhanced document analysis with OCR, computer vision, and AI
    """
    try:
        # Process document with advanced pipeline
        result = await document_processor.process_document(
            file=file,
            analysis_type=analysis_type,
            include_ocr=include_ocr,
            include_layout=include_layout,
            include_tables=include_tables
        )
        
        return JSONResponse(content=result, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

@app.post("/api/multi-agent-analysis")
async def multi_agent_analysis(
    file: UploadFile = File(...),
    agents: List[str] = ["document", "financial", "risk", "compliance"]
):
    """
    Multi-agent analysis using specialized AI agents
    """
    try:
        # Coordinate multiple agents for comprehensive analysis
        result = await multi_agent.coordinate_analysis(
            file=file,
            agents=agents
        )
        
        return JSONResponse(content=result, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-agent analysis failed: {str(e)}")

@app.post("/api/rag-analysis")
async def rag_analysis(
    file: UploadFile = File(...),
    query: str = "",
    use_vector_db: bool = True
):
    """
    RAG (Retrieval Augmented Generation) analysis
    """
    try:
        # Store document in vector database
        if use_vector_db:
            doc_id = await vector_store.store_document(file)
        
        # Perform RAG analysis
        result = await ai_analyzer.rag_analysis(
            file=file,
            query=query,
            vector_db_id=doc_id if use_vector_db else None
        )
        
        return JSONResponse(content=result, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG analysis failed: {str(e)}")

@app.post("/api/advanced-ocr")
async def advanced_ocr(
    file: UploadFile = File(...),
    ocr_type: str = "auto",  # auto, tesseract, easyocr, paddle
    language: str = "en",
    extract_tables: bool = True,
    extract_charts: bool = True
):
    """
    Advanced OCR with multiple engines and table/chart extraction
    """
    try:
        result = await document_processor.advanced_ocr(
            file=file,
            ocr_type=ocr_type,
            language=language,
            extract_tables=extract_tables,
            extract_charts=extract_charts
        )
        
        return JSONResponse(content=result, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advanced OCR failed: {str(e)}")

@app.post("/api/layout-analysis")
async def layout_analysis(
    file: UploadFile = File(...),
    detect_components: bool = True,
    analyze_structure: bool = True
):
    """
    Document layout analysis with computer vision
    """
    try:
        result = await document_processor.analyze_layout(
            file=file,
            detect_components=detect_components,
            analyze_structure=analyze_structure
        )
        
        return JSONResponse(content=result, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Layout analysis failed: {str(e)}")

@app.get("/api/supported-formats")
async def get_supported_formats():
    """
    Get list of supported document formats
    """
    return {
        "supported_formats": [
            "PDF", "DOCX", "DOC", "TXT", "PNG", "JPG", "JPEG", "TIFF"
        ],
        "ocr_languages": [
            "en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"
        ],
        "analysis_types": [
            "comprehensive", "financial", "compliance", "risk", "extraction"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
