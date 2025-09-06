#!/usr/bin/env python3
"""
Test script to verify document analysis functionality
"""
import requests
import json

def test_document_analysis():
    """Test the document analysis API with different document types"""
    
    # Test with resume
    try:
        with open('test_resume.txt', 'rb') as f:
            files = {'file': f}
            response = requests.post('http://localhost:8001/enhanced-document-analysis', files=files)
            
        if response.status_code == 200:
            result = response.json()
            print("✅ Resume Analysis Results:")
            print(f"   Document Type: {result.get('document_type', 'Unknown')}")
            print(f"   Confidence Score: {result.get('confidence_score', 0):.2f}")
            print(f"   Analysis Context: {result.get('analysis_context', 'Unknown')}")
            print(f"   Key Insights: {result.get('key_insights', [])[:2]}")
            print()
        else:
            print(f"❌ Resume test failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Resume test error: {e}")
    
    # Test chat query
    try:
        response = requests.post('http://localhost:8001/chat-query', 
                               json={'query': 'Tell me about document analysis'})
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Chat Query Test:")
            print(f"   Response length: {len(result.get('response', ''))}")
            print(f"   Contains document info: {'document' in result.get('response', '').lower()}")
            print()
        else:
            print(f"❌ Chat query test failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Chat query test error: {e}")

if __name__ == "__main__":
    test_document_analysis()
