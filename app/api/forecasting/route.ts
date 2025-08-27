import { NextResponse } from 'next/server';

interface MarketForecast {
  symbol: string;
  timeframe: string;
  pricePrediction: {
    shortTerm: number; // 1-3 months
    mediumTerm: number; // 3-6 months
    longTerm: number; // 6-12 months
  };
  confidence: number; // 0-100%
  riskFactors: string[];
  marketTrend: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  sectorAnalysis: {
    sector: string;
    trend: string;
    strength: number; // 1-10
  };
  technicalIndicators: {
    rsi: number;
    macd: string;
    support: number;
    resistance: number;
  };
  fundamentalFactors: {
    peRatio: number;
    debtToEquity: number;
    growthRate: number;
    marketCap: number;
  };
  riskScore: number; // 1-10
  anomalies: string[];
  recommendations: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      symbol, 
      timeframe, 
      analysisType,
      includeSectorAnalysis,
      riskTolerance 
    } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Check if Groq API key is configured
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Create comprehensive forecasting prompt
    const prompt = createForecastingPrompt(symbol, timeframe, analysisType, includeSectorAnalysis, riskTolerance);
    
    // Call Groq AI for forecasting
    const forecast = await generateForecastWithGroq(prompt, groqApiKey);
    
    // Parse the AI response to extract structured data
    const structuredForecast = parseForecastResponse(forecast, symbol, timeframe);
    
    return NextResponse.json({
      success: true,
      forecast: forecast,
      structuredForecast: structuredForecast,
      symbol: symbol,
      timeframe: timeframe,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating forecast:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function createForecastingPrompt(symbol: string, timeframe: string, analysisType: string, includeSectorAnalysis: boolean, riskTolerance: string): string {
  return `As a certified financial analyst and AI forecasting expert, provide a comprehensive market forecast for ${symbol} over ${timeframe}.

Please provide a structured forecast in the following JSON format:

{
  "symbol": "${symbol}",
  "timeframe": "${timeframe}",
  "pricePrediction": {
    "shortTerm": number,
    "mediumTerm": number,
    "longTerm": number
  },
  "confidence": number (0-100),
  "riskFactors": ["factor1", "factor2"],
  "marketTrend": "Bullish|Bearish|Neutral|Volatile",
  "sectorAnalysis": {
    "sector": "string",
    "trend": "string",
    "strength": number (1-10)
  },
  "technicalIndicators": {
    "rsi": number,
    "macd": "string",
    "support": number,
    "resistance": number
  },
  "fundamentalFactors": {
    "peRatio": number,
    "debtToEquity": number,
    "growthRate": number,
    "marketCap": number
  },
  "riskScore": number (1-10),
  "anomalies": ["anomaly1", "anomaly2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Focus on:
1. Technical analysis and price patterns
2. Fundamental analysis and valuation metrics
3. Market sentiment and sector trends
4. Risk assessment and anomaly detection
5. Actionable investment recommendations

Analysis Type: ${analysisType}
Include Sector Analysis: ${includeSectorAnalysis}
Risk Tolerance: ${riskTolerance}

Provide realistic, data-driven forecasts with clear risk assessments.`;
}

function parseForecastResponse(aiResponse: string, symbol: string, timeframe: string): MarketForecast {
  try {
    // Try to extract JSON from the AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        symbol: parsed.symbol || symbol,
        timeframe: parsed.timeframe || timeframe,
        pricePrediction: parsed.pricePrediction || {
          shortTerm: 0,
          mediumTerm: 0,
          longTerm: 0
        },
        confidence: parsed.confidence || 50,
        riskFactors: parsed.riskFactors || ['Analysis incomplete'],
        marketTrend: parsed.marketTrend || 'Neutral',
        sectorAnalysis: parsed.sectorAnalysis || {
          sector: 'Unknown',
          trend: 'Unknown',
          strength: 5
        },
        technicalIndicators: parsed.technicalIndicators || {
          rsi: 50,
          macd: 'Neutral',
          support: 0,
          resistance: 0
        },
        fundamentalFactors: parsed.fundamentalFactors || {
          peRatio: 0,
          debtToEquity: 0,
          growthRate: 0,
          marketCap: 0
        },
        riskScore: parsed.riskScore || 5,
        anomalies: parsed.anomalies || ['Unable to detect anomalies'],
        recommendations: parsed.recommendations || ['Further research recommended']
      };
    }
  } catch (error) {
    console.log('Failed to parse AI forecast response as JSON, using fallback parsing');
  }

  // Fallback parsing if JSON extraction fails
  return {
    symbol: symbol,
    timeframe: timeframe,
    pricePrediction: {
      shortTerm: 0,
      mediumTerm: 0,
      longTerm: 0
    },
    confidence: 30,
    riskFactors: ['Forecast analysis incomplete'],
    marketTrend: 'Neutral',
    sectorAnalysis: {
      sector: 'Unknown',
      trend: 'Unknown',
      strength: 5
    },
    technicalIndicators: {
      rsi: 50,
      macd: 'Neutral',
      support: 0,
      resistance: 0
    },
    fundamentalFactors: {
      peRatio: 0,
      debtToEquity: 0,
      growthRate: 0,
      marketCap: 0
    },
    riskScore: 5,
    anomalies: ['Unable to detect anomalies'],
    recommendations: ['Further research recommended']
  };
}

async function generateForecastWithGroq(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a certified financial analyst and AI forecasting expert specializing in market analysis, technical indicators, fundamental analysis, and risk assessment. Provide structured, data-driven forecasts with clear risk metrics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Forecast generation failed';
    
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to generate forecast with AI');
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced AI Forecasting API is ready',
    features: [
      'Market Trend Analysis',
      'Price Prediction Models',
      'Technical Indicator Analysis',
      'Fundamental Analysis',
      'Sector Trend Forecasting',
      'Risk Assessment & Scoring',
      'Anomaly Detection',
      'Investment Recommendations'
    ],
    supportedTimeframes: ['1 month', '3 months', '6 months', '1 year', '2 years'],
    supportedAnalysisTypes: ['Technical', 'Fundamental', 'Hybrid', 'Sector', 'Risk'],
    riskToleranceLevels: ['Conservative', 'Moderate', 'Aggressive']
  });
}
