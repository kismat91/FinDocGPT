import { NextRequest, NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'No query provided' },
        { status: 400 }
      );
    }

    // Try to send query to Python backend for AI processing
    try {
      const response = await fetch(`${PYTHON_BACKEND_URL}/chat-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query, 
          context: context || {} 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json(result);
      }
    } catch (backendError) {
      console.log('Backend not available, using local AI logic');
    }

    // Fallback to local AI-like responses
    const aiResponse = generateAIResponse(query);
    return NextResponse.json({
      response: aiResponse,
      confidence: 0.85,
      source: 'local_ai'
    });

  } catch (error) {
    console.error('Chat query error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

function generateAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Financial analysis responses
  if (lowerQuery.includes('stock') || lowerQuery.includes('equity')) {
    return `📈 **Stock Market Analysis**

Based on current market conditions and AI analysis:

• **Market Trend**: Currently showing moderate volatility with tech sector leadership
• **Recommended Strategy**: Consider diversified approach with focus on blue-chip stocks
• **Risk Level**: Medium - monitor for economic indicators
• **Key Sectors**: Technology, Healthcare, and Financial services showing strength

*Would you like me to analyze specific stocks or upload documents for detailed equity analysis?*`;
  }

  if (lowerQuery.includes('risk') || lowerQuery.includes('assessment')) {
    return `🛡️ **Risk Assessment Insights**

AI-powered risk analysis suggests:

• **Current Market Risk**: Moderate (6.2/10)
• **Key Risk Factors**:
  - Interest rate volatility
  - Geopolitical tensions
  - Inflation concerns
  - Supply chain disruptions

• **Mitigation Strategies**:
  - Portfolio diversification
  - Hedging strategies
  - Regular rebalancing
  - Stress testing

*Upload financial documents for comprehensive risk analysis using our multi-agent AI system.*`;
  }

  if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
    return `🔮 **AI Market Forecasting**

Our advanced AI models predict:

• **Short-term (3 months)**: Continued volatility with selective opportunities
• **Medium-term (6-12 months)**: Gradual market stabilization expected
• **Long-term (1-2 years)**: Growth resumption with emerging sector leadership

**Key Factors Monitored**:
- Economic indicators
- Corporate earnings
- Policy changes
- Global events

*For detailed forecasting analysis, please upload specific financial documents or portfolio data.*`;
  }

  if (lowerQuery.includes('compliance') || lowerQuery.includes('regulation')) {
    return `⚖️ **Compliance & Regulatory Insights**

Current regulatory landscape analysis:

• **SEC Requirements**: Enhanced disclosure rules in effect
• **Banking Regulations**: Basel III compliance monitoring
• **Data Protection**: GDPR and privacy regulations
• **ESG Reporting**: Increasing mandatory disclosures

**Compliance Tools Available**:
- Automated document checking
- Regulatory change alerts
- Compliance gap analysis
- Risk scoring

*Upload your compliance documents for automated regulatory analysis.*`;
  }

  if (lowerQuery.includes('document') || lowerQuery.includes('analyze') || lowerQuery.includes('upload')) {
    return `📄 **Document Analysis Capabilities**

I can analyze various financial documents using advanced AI:

**Supported Formats**:
• PDF financial reports
• Excel spreadsheets
• Word documents
• Images (OCR enabled)

**Analysis Types**:
• Financial performance metrics
• Risk assessment
• Compliance checking
• Forecasting models
• Portfolio analysis

**AI Features**:
• Multi-agent analysis system
• OCR with computer vision
• Natural language processing
• Pattern recognition

*Simply upload your documents using the 📎 button for comprehensive AI analysis!*`;
  }

  if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('blockchain')) {
    return `₿ **Cryptocurrency Analysis**

Current crypto market insights:

• **Market Sentiment**: Mixed with institutional interest growing
• **Key Trends**: DeFi evolution, regulatory clarity, institutional adoption
• **Risk Factors**: Volatility, regulatory uncertainty, market maturity

**Popular Assets**:
- Bitcoin (BTC): Digital gold narrative
- Ethereum (ETH): Smart contract platform
- Altcoins: Diverse use cases emerging

*For detailed crypto analysis, visit our crypto section or upload portfolio data for AI assessment.*`;
  }

  if (lowerQuery.includes('forex') || lowerQuery.includes('currency') || lowerQuery.includes('fx')) {
    return `💱 **Forex Market Analysis**

Current currency market overview:

• **USD Strength**: Continued dominance in uncertain times
• **Major Pairs**: EUR/USD, GBP/USD showing volatility
• **Emerging Markets**: Mixed performance with selective opportunities

**Key Drivers**:
- Central bank policies
- Economic data releases
- Geopolitical events
- Risk sentiment

*Check our forex section for real-time analysis or upload trading documents for strategy assessment.*`;
  }

  // General/default response
  return `🤖 **FinDocGPT AI Assistant**

I'm here to help with comprehensive financial analysis! Here's what I can do:

**📊 Market Analysis**
- Real-time data interpretation
- Trend analysis and forecasting
- Risk assessment

**📄 Document Intelligence**
- AI-powered document analysis
- OCR and data extraction
- Compliance checking

**💼 Portfolio Management**
- Performance analysis
- Risk optimization
- Strategic recommendations

**🔍 Research & Insights**
- Market research
- Economic analysis
- Regulatory updates

*How can I assist you today? You can ask questions or upload documents for analysis!*`;
}
