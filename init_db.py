#!/usr/bin/env python3
"""
Database initialization script for FinDocGPT
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import create_tables
from app.models.database.base import engine
from app.models.database.models import Base

def init_database():
    """Initialize the database with all tables"""
    print("Creating database tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")
    print("You can now start the FinDocGPT application.")

if __name__ == "__main__":
    init_database() 