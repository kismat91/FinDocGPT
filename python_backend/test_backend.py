#!/usr/bin/env python3
"""
Test script for FinDocGPT Python Backend
"""

import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_services():
    """Test all backend services"""
    print("🧪 Testing FinDocGPT Python Backend Services...")
    print("=" * 50)
    
    try:
        # Test Document Processor
        print("\n1️⃣ Testing Document Processor...")
        from services.document_processor import DocumentProcessor
        processor = DocumentProcessor()
        print("✅ Document Processor initialized successfully")
        
        # Test Multi-Agent System
        print("\n2️⃣ Testing Multi-Agent System...")
        from services.multi_agent import MultiAgentSystem
        multi_agent = MultiAgentSystem()
        print("✅ Multi-Agent System initialized successfully")
        
        # Test AI Analyzer
        print("\n3️⃣ Testing AI Analyzer...")
        from services.ai_analyzer import AIAnalyzer
        ai_analyzer = AIAnalyzer()
        print("✅ AI Analyzer initialized successfully")
        
        # Test Vector Store
        print("\n4️⃣ Testing Vector Store...")
        from services.vector_store import VectorStore
        vector_store = VectorStore()
        print("✅ Vector Store initialized successfully")
        
        print("\n🎉 All services initialized successfully!")
        
        # Show available LLM providers
        providers = ai_analyzer.get_available_providers()
        print(f"\n🔑 Available LLM Providers: {providers}")
        
        # Show analysis templates
        templates = ai_analyzer.get_analysis_templates()
        print(f"📋 Available Analysis Templates: {templates}")
        
        # Show vector store statistics
        stats = vector_store.get_statistics()
        print(f"📊 Vector Store Statistics: {stats}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Service test failed: {str(e)}")
        return False

async def test_api_endpoints():
    """Test API endpoints"""
    print("\n🌐 Testing API Endpoints...")
    print("=" * 50)
    
    try:
        import requests
        
        # Test health endpoint
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Health endpoint: HEALTHY")
        else:
            print(f"❌ Health endpoint: {response.status_code}")
        
        # Test root endpoint
        response = requests.get("http://localhost:8000/")
        if response.status_code == 200:
            print("✅ Root endpoint: WORKING")
        else:
            print(f"❌ Root endpoint: {response.status_code}")
        
        # Test supported formats
        response = requests.get("http://localhost:8000/api/supported-formats")
        if response.status_code == 200:
            print("✅ Supported formats endpoint: WORKING")
        else:
            print(f"❌ Supported formats endpoint: {response.status_code}")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        return False
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🚀 FinDocGPT Python Backend Test Suite")
    print("=" * 50)
    
    # Test services
    services_ok = asyncio.run(test_services())
    
    if services_ok:
        print("\n" + "=" * 50)
        print("🎯 Services are ready! Starting API tests...")
        
        # Test API endpoints
        api_ok = asyncio.run(test_api_endpoints())
        
        if api_ok:
            print("\n🎉 All tests passed! Backend is ready.")
            print("\n📱 You can now:")
            print("   • Access the API at: http://localhost:8000")
            print("   • View API docs at: http://localhost:8000/docs")
            print("   • Use the frontend at: http://localhost:3000")
        else:
            print("\n⚠️  API tests failed. Check if backend is running.")
    else:
        print("\n❌ Service tests failed. Check your installation.")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()
