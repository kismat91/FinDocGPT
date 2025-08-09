import os
from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FinDocGPT"
    
    # Database
    DATABASE_URL: str = "sqlite:///./findocgpt.db"
    
    # External APIs
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    YAHOO_FINANCE_ENABLED: bool = True
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: list = [".pdf", ".docx", ".txt", ".xlsx"]
    
    # AI/ML Settings
    MODEL_CACHE_DIR: str = "models"
    SENTIMENT_ANALYSIS_ENABLED: bool = True
    FORECASTING_ENABLED: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings() 