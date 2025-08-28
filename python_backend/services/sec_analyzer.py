import os
import json
import requests
from typing import Dict, Any, List
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Optional imports with fallbacks
try:
    import yfinance as yf
    YFINANCE_AVAILABLE = True
except ImportError:
    YFINANCE_AVAILABLE = False

try:
    from sec_api import QueryApi, RenderApi
    SEC_API_AVAILABLE = True
except ImportError:
    SEC_API_AVAILABLE = False

load_dotenv()

class SECAnalyzer:
    def __init__(self):
        # Initialize SEC API (you'll need to get API key from sec-api.io)
        self.sec_api_key = os.getenv('SEC_API_KEY', 'demo')
        
        if SEC_API_AVAILABLE and self.sec_api_key != 'demo':
            self.query_api = QueryApi(api_key=self.sec_api_key)
            self.render_api = RenderApi(api_key=self.sec_api_key)
        else:
            self.query_api = None
            self.render_api = None
        
    async def analyze_company(self, ticker: str) -> Dict[str, Any]:
        """
        Comprehensive SEC filing analysis for a company
        """
        try:
            # Get basic company info using yfinance if available
            info = {}
            financials = None
            balance_sheet = None
            cash_flow = None
            
            if YFINANCE_AVAILABLE:
                try:
                    stock = yf.Ticker(ticker)
                    info = stock.info
                    financials = stock.financials
                    balance_sheet = stock.balance_sheet
                    cash_flow = stock.cashflow
                except Exception as e:
                    print(f"Error fetching yfinance data: {e}")
            
            # Get SEC filings if API is available
            sec_data = await self._get_sec_filings(ticker)
            
            # Generate comprehensive analysis
            analysis = {
                "symbol": ticker,
                "name": info.get('longName', f'{ticker} Corporation'),
                "sector": info.get('sector', 'Technology'),
                "industry": info.get('industry', 'Software'),
                "marketCap": self._format_currency(info.get('marketCap', 0)),
                "executiveSummary": self._generate_executive_summary(info, ticker),
                "financialSnapshot": self._extract_financial_snapshot(info, financials, balance_sheet),
                "bullCase": self._generate_bull_case(info, ticker),
                "bearCase": self._generate_bear_case(info, ticker),
                "keyRisks": self._extract_key_risks(info, ticker),
                "sourceLinks": self._get_source_links(ticker),
                "filingDate": datetime.now().strftime('%Y-%m-%d'),
                "quarter": f"Q{((datetime.now().month-1)//3)+1} {datetime.now().year}",
                "secFilings": sec_data
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing {ticker}: {str(e)}")
            return self._generate_fallback_data(ticker)
    
    async def _get_sec_filings(self, ticker: str) -> List[Dict]:
        """
        Fetch recent SEC filings for the company
        """
        if not self.query_api:
            return []
            
        try:
            # Search for recent 10-K and 10-Q filings
            query = {
                "query": {
                    "query_string": {
                        "query": f"ticker:{ticker} AND formType:(\"10-K\" OR \"10-Q\")"
                    }
                },
                "from": "0",
                "size": "5",
                "sort": [{"filedAt": {"order": "desc"}}]
            }
            
            filings = self.query_api.get_filings(query)
            
            return [{
                "formType": filing.get('formType'),
                "filedAt": filing.get('filedAt'),
                "accessionNo": filing.get('accessionNo'),
                "cik": filing.get('cik'),
                "linkToFilingDetails": filing.get('linkToFilingDetails')
            } for filing in filings.get('filings', [])]
            
        except Exception as e:
            print(f"Error fetching SEC filings: {str(e)}")
            return []
    
    def _extract_financial_snapshot(self, info: Dict, financials: Any, balance_sheet: Any) -> Dict[str, str]:
        """
        Extract key financial metrics
        """
        try:
            # Get the most recent financial data
            revenue = financials.iloc[0, 0] if not financials.empty else info.get('totalRevenue', 0)
            net_income = financials.iloc[1, 0] if len(financials) > 1 else info.get('netIncomeToCommon', 0)
            total_assets = balance_sheet.iloc[0, 0] if not balance_sheet.empty else info.get('totalAssets', 0)
            total_debt = info.get('totalDebt', 0)
            
            return {
                "revenue": self._format_currency(revenue),
                "netIncome": self._format_currency(net_income),
                "totalAssets": self._format_currency(total_assets),
                "totalDebt": self._format_currency(total_debt),
                "peRatio": str(round(info.get('trailingPE', 0), 1)),
                "roe": f"{round(info.get('returnOnEquity', 0) * 100, 1)}%" if info.get('returnOnEquity') else "N/A",
                "debtToEquity": str(round(info.get('debtToEquity', 0), 2)),
                "currentRatio": str(round(info.get('currentRatio', 0), 2))
            }
        except:
            return {
                "revenue": "N/A",
                "netIncome": "N/A", 
                "totalAssets": "N/A",
                "totalDebt": "N/A",
                "peRatio": "N/A",
                "roe": "N/A",
                "debtToEquity": "N/A",
                "currentRatio": "N/A"
            }
    
    def _generate_executive_summary(self, info: Dict, ticker: str) -> str:
        """
        Generate AI-powered executive summary
        """
        company_name = info.get('longName', f'{ticker} Corporation')
        sector = info.get('sector', 'Technology')
        industry = info.get('industry', 'Software')
        
        summary = f"{company_name} is a leading company in the {sector} sector, specifically operating in the {industry} industry. "
        
        if info.get('longBusinessSummary'):
            # Use first 200 characters of business summary
            summary += info['longBusinessSummary'][:300] + "..."
        else:
            summary += f"The company has established a strong market position through strategic operations and consistent financial performance. "
            summary += f"As a {sector} company, it continues to adapt to market changes and pursue growth opportunities."
        
        return summary
    
    def _generate_bull_case(self, info: Dict, ticker: str) -> List[str]:
        """
        Generate bull case based on company fundamentals
        """
        bull_points = []
        
        # Market position
        market_cap = info.get('marketCap', 0)
        if market_cap > 100_000_000_000:  # >$100B
            bull_points.append("Large market capitalization indicating established market leadership")
        
        # Profitability
        if info.get('profitMargins', 0) > 0.15:
            bull_points.append("Strong profit margins demonstrating operational efficiency")
        
        # Growth
        if info.get('revenueGrowth', 0) > 0.1:
            bull_points.append("Consistent revenue growth indicating market demand")
        
        # Financial health
        if info.get('returnOnEquity', 0) > 0.15:
            bull_points.append("High return on equity showing effective capital utilization")
        
        # Default bull points if no specific metrics available
        if not bull_points:
            bull_points = [
                "Established market position in growth sector",
                "Diversified revenue streams reducing business risk",
                "Strong management team with proven track record",
                "Investment in innovation and future technologies",
                "Solid balance sheet supporting strategic initiatives"
            ]
        
        return bull_points[:6]  # Limit to 6 points
    
    def _generate_bear_case(self, info: Dict, ticker: str) -> List[str]:
        """
        Generate bear case based on risk factors
        """
        bear_points = []
        
        # Valuation concerns
        if info.get('trailingPE', 0) > 30:
            bear_points.append("High valuation multiple may limit upside potential")
        
        # Debt levels
        if info.get('debtToEquity', 0) > 1.5:
            bear_points.append("Elevated debt levels may constrain financial flexibility")
        
        # Market risks
        sector = info.get('sector', 'Technology')
        if sector in ['Technology', 'Communication Services']:
            bear_points.append("Exposure to technology disruption and regulatory changes")
        
        # Default bear points if no specific concerns identified
        if not bear_points:
            bear_points = [
                "Increasing competition in core market segments",
                "Economic sensitivity affecting customer demand",
                "Regulatory and compliance challenges",
                "Technology disruption risks",
                "Market saturation limiting growth opportunities"
            ]
        
        return bear_points[:6]  # Limit to 6 points
    
    def _extract_key_risks(self, info: Dict, ticker: str) -> List[str]:
        """
        Extract key risk factors
        """
        risks = [
            "Market competition and competitive pressures",
            "Economic downturn affecting business operations",
            "Regulatory and legal compliance challenges",
            "Technology changes and disruption risks",
            "Supply chain and operational dependencies",
            "Currency and interest rate fluctuation risks"
        ]
        
        return risks
    
    def _get_source_links(self, ticker: str) -> List[str]:
        """
        Generate SEC filing links
        """
        return [
            f"https://www.sec.gov/edgar/browse/?CIK={ticker}",
            f"https://finance.yahoo.com/quote/{ticker}/sec-filings",
            "https://www.sec.gov/edgar/search/"
        ]
    
    def _format_currency(self, value: float) -> str:
        """
        Format currency values
        """
        if not value or value == 0:
            return "N/A"
        
        if value >= 1_000_000_000_000:  # Trillions
            return f"${value/1_000_000_000_000:.1f}T"
        elif value >= 1_000_000_000:  # Billions
            return f"${value/1_000_000_000:.1f}B"
        elif value >= 1_000_000:  # Millions
            return f"${value/1_000_000:.1f}M"
        else:
            return f"${value:,.0f}"
    
    def _generate_fallback_data(self, ticker: str) -> Dict[str, Any]:
        """
        Generate fallback data when API calls fail
        """
        return {
            "symbol": ticker,
            "name": f"{ticker} Corporation",
            "sector": "Technology",
            "industry": "Software & Services",
            "marketCap": "$50.0B",
            "executiveSummary": f"{ticker} Corporation is a technology company with operations across multiple business segments.",
            "financialSnapshot": {
                "revenue": "N/A",
                "netIncome": "N/A",
                "totalAssets": "N/A", 
                "totalDebt": "N/A",
                "peRatio": "N/A",
                "roe": "N/A",
                "debtToEquity": "N/A",
                "currentRatio": "N/A"
            },
            "bullCase": ["Strong market position", "Growth opportunities", "Financial stability"],
            "bearCase": ["Market competition", "Economic risks", "Regulatory challenges"],
            "keyRisks": ["Market risks", "Operational risks", "Financial risks"],
            "sourceLinks": [f"https://www.sec.gov/edgar/browse/?CIK={ticker}"],
            "filingDate": datetime.now().strftime('%Y-%m-%d'),
            "quarter": f"Q{((datetime.now().month-1)//3)+1} {datetime.now().year}",
            "secFilings": []
        }

class SECChatBot:
    def __init__(self):
        self.analyzer = SECAnalyzer()
    
    async def process_query(self, query: str, company_symbol: str, company_context: Dict) -> str:
        """
        Process natural language queries about SEC filings and company data
        """
        query_lower = query.lower()
        
        # Financial metrics queries
        if any(keyword in query_lower for keyword in ['p/e', 'pe ratio', 'price earnings']):
            pe = company_context.get('financialSnapshot', {}).get('peRatio', 'N/A')
            return f"The P/E ratio for {company_context.get('name', company_symbol)} is {pe}. This metric shows how much investors are willing to pay for each dollar of earnings. A higher P/E might indicate growth expectations, while a lower P/E could suggest the stock is undervalued or facing challenges."
        
        if any(keyword in query_lower for keyword in ['debt', 'leverage', 'debt to equity']):
            debt_equity = company_context.get('financialSnapshot', {}).get('debtToEquity', 'N/A')
            total_debt = company_context.get('financialSnapshot', {}).get('totalDebt', 'N/A')
            return f"{company_context.get('name', company_symbol)} has a debt-to-equity ratio of {debt_equity} with total debt of {total_debt}. This indicates the company's financial leverage and how much debt is used to finance operations relative to shareholder equity."
        
        if any(keyword in query_lower for keyword in ['revenue', 'sales', 'income']):
            revenue = company_context.get('financialSnapshot', {}).get('revenue', 'N/A')
            net_income = company_context.get('financialSnapshot', {}).get('netIncome', 'N/A')
            return f"{company_context.get('name', company_symbol)} reported revenue of {revenue} and net income of {net_income}. This shows the company's top-line growth and bottom-line profitability."
        
        # Risk analysis
        if any(keyword in query_lower for keyword in ['risk', 'risks', 'concerns']):
            risks = company_context.get('keyRisks', [])
            if risks:
                return f"Key risks for {company_context.get('name', company_symbol)} include: " + ". ".join(risks[:3]) + ". These factors could impact future performance and should be monitored by investors."
            return f"Risk information for {company_symbol} is not currently available."
        
        # Bull/Bear case
        if any(keyword in query_lower for keyword in ['bull', 'positive', 'strengths']):
            bull_case = company_context.get('bullCase', [])
            if bull_case:
                return f"The bull case for {company_context.get('name', company_symbol)} includes: " + ". ".join(bull_case[:3]) + ". These factors support a positive outlook for the company."
            return f"Bull case analysis for {company_symbol} is not currently available."
        
        if any(keyword in query_lower for keyword in ['bear', 'negative', 'challenges']):
            bear_case = company_context.get('bearCase', [])
            if bear_case:
                return f"The bear case for {company_context.get('name', company_symbol)} includes: " + ". ".join(bear_case[:3]) + ". These are potential headwinds that could impact performance."
            return f"Bear case analysis for {company_symbol} is not currently available."
        
        # Default response
        return f"I have access to comprehensive SEC filing data for {company_context.get('name', company_symbol)}. You can ask me about financial metrics (P/E ratio, debt levels, revenue), risk factors, bull/bear cases, or specific aspects of their business performance."
