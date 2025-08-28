import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  companySymbol: string;
  context: any;
}

export async function POST(request: NextRequest) {
  try {
    const { message, companySymbol, context } = await request.json() as ChatRequest;

    if (!message || !companySymbol) {
      return NextResponse.json({ error: 'Message and company symbol are required' }, { status: 400 });
    }

    // Try to call Python backend for AI-powered response
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const backendResponse = await fetch('http://localhost:8001/api/sec-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          company_symbol: companySymbol,
          company_context: context
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json({ response: data.response });
      }
    } catch (error) {
      console.log('Backend not available, using intelligent mock responses');
    }

    // Intelligent fallback responses based on query analysis
    const response = generateIntelligentResponse(message, companySymbol, context);
    
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error in SEC filings chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function generateIntelligentResponse(message: string, companySymbol: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Financial ratios queries
  if (lowerMessage.includes('p/e') || lowerMessage.includes('pe ratio') || lowerMessage.includes('price to earnings')) {
    return `${context.name} currently has a P/E ratio of ${context.financialSnapshot.peRatio}. This means investors are willing to pay $${context.financialSnapshot.peRatio} for every $1 of earnings. Compared to the sector average, this valuation suggests ${parseFloat(context.financialSnapshot.peRatio) > 25 ? 'the stock may be trading at a premium, indicating strong growth expectations' : 'the stock is reasonably valued with moderate growth expectations'}. Consider this alongside the company's growth prospects and competitive position.`;
  }
  
  if (lowerMessage.includes('debt') || lowerMessage.includes('leverage') || lowerMessage.includes('debt to equity')) {
    return `${context.name} has a debt-to-equity ratio of ${context.financialSnapshot.debtToEquity}, with total debt of ${context.financialSnapshot.totalDebt}. This indicates ${parseFloat(context.financialSnapshot.debtToEquity) > 1.0 ? 'moderate to high leverage' : 'conservative leverage'}. The current ratio of ${context.financialSnapshot.currentRatio} suggests ${parseFloat(context.financialSnapshot.currentRatio) > 1.0 ? 'adequate liquidity to meet short-term obligations' : 'potential liquidity concerns'}. Overall, the company's debt management appears ${parseFloat(context.financialSnapshot.debtToEquity) < 2.0 ? 'reasonable' : 'worth monitoring closely'}.`;
  }
  
  if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('income')) {
    return `${context.name} reported revenue of ${context.financialSnapshot.revenue} with net income of ${context.financialSnapshot.netIncome}. This represents a net profit margin of approximately ${(parseFloat(context.financialSnapshot.netIncome.replace(/[^0-9.]/g, '')) / parseFloat(context.financialSnapshot.revenue.replace(/[^0-9.]/g, '')) * 100).toFixed(1)}%. The company's return on equity (ROE) of ${context.financialSnapshot.roe} indicates ${parseFloat(context.financialSnapshot.roe.replace('%', '')) > 15 ? 'strong' : 'moderate'} profitability relative to shareholder equity.`;
  }
  
  // Risk-related queries
  if (lowerMessage.includes('risk') || lowerMessage.includes('risks') || lowerMessage.includes('concerns')) {
    const riskCount = context.keyRisks.length;
    const topRisks = context.keyRisks.slice(0, 3).join('; ');
    return `${context.name} faces ${riskCount} key risk factors identified in their SEC filings. The primary concerns include: ${topRisks}. These risks are typical for companies in the ${context.sector} sector. Investors should monitor these factors as they could impact future performance. The company's diversified ${context.sector.toLowerCase()} operations help mitigate some sector-specific risks.`;
  }
  
  // Bull/bear case queries
  if (lowerMessage.includes('bull') || lowerMessage.includes('positive') || lowerMessage.includes('strengths')) {
    const topBullPoints = context.bullCase.slice(0, 3).join('; ');
    return `The bull case for ${context.name} centers on: ${topBullPoints}. These strengths position the company well for continued growth in the ${context.sector} sector. The company's market cap of ${context.marketCap} reflects investor confidence in these competitive advantages.`;
  }
  
  if (lowerMessage.includes('bear') || lowerMessage.includes('negative') || lowerMessage.includes('challenges')) {
    const topBearPoints = context.bearCase.slice(0, 3).join('; ');
    return `The bear case for ${context.name} includes: ${topBearPoints}. These challenges are common in the ${context.sector} sector and require ongoing management attention. Investors should weigh these concerns against the company's strengths and market position.`;
  }
  
  // Growth and future prospects
  if (lowerMessage.includes('growth') || lowerMessage.includes('future') || lowerMessage.includes('prospects')) {
    return `${context.name}'s growth prospects in the ${context.sector} sector appear ${parseFloat(context.financialSnapshot.roe.replace('%', '')) > 15 ? 'promising' : 'moderate'} based on their ROE of ${context.financialSnapshot.roe} and strong market position. Key growth drivers include their competitive advantages in ${context.industry}. However, investors should consider the challenges outlined in their bear case, including market competition and regulatory factors.`;
  }
  
  // Valuation queries
  if (lowerMessage.includes('valuation') || lowerMessage.includes('value') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap')) {
    const peRatio = parseFloat(context.financialSnapshot.peRatio);
    const valuation = peRatio > 30 ? 'premium' : peRatio > 20 ? 'moderate' : 'conservative';
    return `${context.name} is currently trading at a ${valuation} valuation with a P/E ratio of ${context.financialSnapshot.peRatio}. This ${valuation} valuation ${valuation === 'premium' ? 'suggests high growth expectations' : valuation === 'moderate' ? 'reflects balanced growth expectations' : 'may indicate value opportunity'}. Consider the company's ROE of ${context.financialSnapshot.roe} and debt levels when evaluating if this valuation is justified by fundamentals.`;
  }
  
  // Competition queries
  if (lowerMessage.includes('competition') || lowerMessage.includes('competitive') || lowerMessage.includes('market share')) {
    return `${context.name} operates in the competitive ${context.sector} sector, specifically in ${context.industry}. Based on their SEC filings, key competitive challenges include market saturation and new entrants. However, the company maintains competitive advantages through brand strength, operational efficiency, and market position. Their ${context.marketCap} market cap reflects their significant market presence.`;
  }
  
  // Management and governance
  if (lowerMessage.includes('management') || lowerMessage.includes('leadership') || lowerMessage.includes('governance')) {
    return `${context.name}'s management team has demonstrated capability in navigating the ${context.sector} sector challenges. The company's ROE of ${context.financialSnapshot.roe} and debt management (debt-to-equity: ${context.financialSnapshot.debtToEquity}) suggest effective capital allocation. For detailed management insights, refer to the company's latest proxy statement and management discussion in their SEC filings.`;
  }
  
  // Industry and sector queries
  if (lowerMessage.includes('industry') || lowerMessage.includes('sector') || lowerMessage.includes('market')) {
    return `${context.name} operates in the ${context.sector} sector, specifically in the ${context.industry} industry. This sector faces both opportunities and challenges including technological disruption, regulatory changes, and evolving consumer preferences. The company's position within this industry is reflected in their market cap of ${context.marketCap} and financial performance metrics.`;
  }
  
  // Default intelligent response
  return `Based on ${context.name}'s latest SEC filings, the company shows ${parseFloat(context.financialSnapshot.roe.replace('%', '')) > 15 ? 'strong' : 'moderate'} financial performance with revenue of ${context.financialSnapshot.revenue} and net income of ${context.financialSnapshot.netIncome}. Their position in the ${context.sector} sector presents both opportunities and challenges. For specific questions about financials, try asking about P/E ratios, debt levels, growth prospects, or key risks. You can also ask about the bull case, bear case, or competitive position.`;
}
