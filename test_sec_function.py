#!/usr/bin/env python3

import hashlib
import random
from datetime import datetime
from typing import Dict, Any

def test_generate_mock_sec_data(ticker: str) -> Dict[str, Any]:
    """Generate realistic mock SEC data for any ticker using deterministic algorithms"""
    import hashlib
    import random
    
    # Use ticker as seed for consistent data generation
    seed_value = int(hashlib.md5(ticker.upper().encode()).hexdigest()[:8], 16)
    random.seed(seed_value)
    
    # Define sector mappings (simplified for testing)
    sector_mapping = {
        'AAPL': ('Technology', 'Consumer Electronics', 'Apple Inc.'),
        'TSLA': ('Consumer Discretionary', 'Automotive', 'Tesla Inc.'),
    }
    
    # Get sector info or generate based on ticker characteristics
    if ticker.upper() in sector_mapping:
        sector, industry, company_name = sector_mapping[ticker.upper()]
    else:
        # Generate sector based on ticker patterns
        if any(tech in ticker.upper() for tech in ['TECH', 'SOFT', 'DATA', 'COMP', 'SYS']):
            sector, industry = 'Technology', 'Software'
        else:
            # Default based on ticker hash
            sectors = [
                ('Technology', 'Software'),
                ('Healthcare', 'Biotechnology'), 
                ('Financials', 'Banking'),
            ]
            sector, industry = sectors[seed_value % len(sectors)]
        
        # Generate company name
        suffixes = ['Inc.', 'Corporation', 'Corp.']
        company_name = f"{ticker.upper()} {random.choice(suffixes)}"
    
    # Generate simple metrics
    market_cap_b = random.uniform(10, 500)
    revenue_b = market_cap_b * random.uniform(0.15, 0.35)
    
    # Format values appropriately
    def format_currency(value_b):
        if value_b >= 1000:
            return f"${value_b/1000:.1f}T"
        elif value_b >= 1:
            return f"${value_b:.0f}B"
        else:
            return f"${value_b*1000:.0f}M"
    
    return {
        "symbol": ticker.upper(),
        "name": company_name,
        "sector": sector,
        "industry": industry,
        "marketCap": format_currency(market_cap_b),
        "revenue": format_currency(revenue_b),
        "dataSource": "Test Mock Data",
        "lastUpdated": datetime.now().isoformat()
    }

if __name__ == "__main__":
    # Test the function
    test_tickers = ["AAPL", "TESTCO", "NEWCO", "TECHSOFT"]
    
    for ticker in test_tickers:
        try:
            result = test_generate_mock_sec_data(ticker)
            print(f"✅ {ticker}: {result['name']} - {result['sector']}")
        except Exception as e:
            print(f"❌ {ticker}: Error - {e}")
    
    print("\n🎯 All tests completed!")
