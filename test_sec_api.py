#!/usr/bin/env python3
"""
Test SEC Filings API endpoints
"""

import requests
import json

def test_sec_analysis():
    """Test SEC analysis endpoint"""
    url = "http://localhost:8001/api/sec-analysis"
    
    # Test with Apple
    payload = {"ticker": "AAPL"}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ SEC Analysis Test - SUCCESS")
            print(f"Company: {data['name']} ({data['symbol']})")
            print(f"Market Cap: {data['marketCap']}")
            print(f"Sector: {data['sector']}")
            print(f"P/E Ratio: {data['financialSnapshot']['peRatio']}")
            print(f"Revenue: {data['financialSnapshot']['revenue']}")
            print("\nBull Case:")
            for i, point in enumerate(data['bullCase'][:3], 1):
                print(f"  {i}. {point}")
            print("\nKey Risks:")
            for i, risk in enumerate(data['keyRisks'][:3], 1):
                print(f"  {i}. {risk}")
            return True
        else:
            print(f"❌ SEC Analysis Test - FAILED: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ SEC Analysis Test - ERROR: {str(e)}")
        return False

def test_sec_chat():
    """Test SEC chat endpoint"""
    url = "http://localhost:8001/api/sec-chat"
    
    payload = {
        "query": "What is the P/E ratio for Apple?",
        "company_symbol": "AAPL",
        "company_context": {
            "name": "Apple Inc.",
            "financialSnapshot": {
                "peRatio": "28.5"
            }
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ SEC Chat Test - SUCCESS")
            print(f"Query: {payload['query']}")
            print(f"Response: {data['response']}")
            return True
        else:
            print(f"\n❌ SEC Chat Test - FAILED: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"\n❌ SEC Chat Test - ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing SEC Filings API...")
    print("=" * 50)
    
    # Test SEC analysis
    analysis_success = test_sec_analysis()
    
    # Test SEC chat
    chat_success = test_sec_chat()
    
    print("\n" + "=" * 50)
    if analysis_success and chat_success:
        print("🎉 All tests passed! SEC Filings functionality is working!")
    else:
        print("⚠️  Some tests failed. Check the backend logs.")
