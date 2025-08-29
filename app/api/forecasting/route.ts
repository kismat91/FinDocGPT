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
      confidenceScore: structuredForecast.confidence,
      riskAssessment: `Risk Score: ${structuredForecast.riskScore}/10 - ${structuredForecast.marketTrend} trend with ${structuredForecast.riskFactors.length} risk factors identified.`,
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

Please provide a structured forecast in the following JSON format. Ensure all values are properly formatted as valid JSON:

{
  "symbol": "${symbol}",
  "timeframe": "${timeframe}",
  "pricePrediction": {
    "shortTerm": 145.50,
    "mediumTerm": 148.20,
    "longTerm": 152.50
  },
  "confidence": 85,
  "riskFactors": ["factor1", "factor2"],
  "marketTrend": "Bullish",
  "sectorAnalysis": {
    "sector": "Technology",
    "trend": "Bullish",
    "strength": 8
  },
  "technicalIndicators": {
    "rsi": 55,
    "macd": "Buy",
    "support": 140.50,
    "resistance": 150.20
  },
  "fundamentalFactors": {
    "peRatio": 25.12,
    "debtToEquity": 0.12,
    "growthRate": 12.5,
    "marketCap": 2.35
  },
  "riskScore": 4,
  "anomalies": ["anomaly1", "anomaly2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

IMPORTANT: 
- Use only numbers for numeric values (no "T", "B", "M", "%" symbols)
- Ensure all JSON is valid and properly formatted
- No trailing commas
- All strings must be in double quotes

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
    // Try to extract JSON from the AI response - look for JSON content between { and }
    // Use a more robust pattern that handles multiline content
    const jsonMatch = aiResponse.match(/\{[\s\S]*?\}/s);
    if (jsonMatch) {
      let jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);
      
      // Clean up common JSON formatting issues
      jsonStr = jsonStr
        .replace(/(\d+\.\d+[TBMK])/g, '"$1"') // Wrap values like 2.35T in quotes
        .replace(/(\d+\.\d+%)/g, '"$1"') // Wrap values like 10.50% in quotes
        .replace(/(\d+\.\d+[A-Z]+)/g, '"$1"') // Wrap other similar values
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      console.log('Cleaned JSON string:', jsonStr);
      
      const parsed = JSON.parse(jsonStr);
      console.log('Parsed forecast data:', parsed);
      
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
    console.log('Failed to parse AI forecast response as JSON:', error);
    console.log('AI Response:', aiResponse);
  }

  // Fallback parsing: extract key values directly from text
  console.log('Using fallback text parsing');
  const fallbackData = parseForecastFromText(aiResponse, symbol, timeframe);
  if (fallbackData) {
    return fallbackData;
  }

  // Final fallback if all parsing methods fail
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

function parseForecastFromText(text: string, symbol: string, timeframe: string): MarketForecast | null {
  try {
    // Extract confidence score
    const confidenceMatch = text.match(/"confidence":\s*(\d+)/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;
    
    // Extract risk score
    const riskScoreMatch = text.match(/"riskScore":\s*(\d+)/);
    const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1]) : 5;
    
    // Extract market trend
    const trendMatch = text.match(/"marketTrend":\s*"([^"]+)"/);
    const marketTrend = trendMatch ? trendMatch[1] : 'Neutral';
    
    // Extract risk factors
    const riskFactorsMatch = text.match(/"riskFactors":\s*\[([^\]]+)\]/);
    const riskFactors = riskFactorsMatch ? 
      riskFactorsMatch[1].split(',').map(f => f.trim().replace(/"/g, '')) : 
      ['Analysis incomplete'];
    
    // Extract sector
    const sectorMatch = text.match(/"sector":\s*"([^"]+)"/);
    const sector = sectorMatch ? sectorMatch[1] : 'Unknown';
    
    // Extract RSI
    const rsiMatch = text.match(/"rsi":\s*(\d+(?:\.\d+)?)/);
    const rsi = rsiMatch ? parseFloat(rsiMatch[1]) : 50;
    
    // Extract support and resistance
    const supportMatch = text.match(/"support":\s*(\d+(?:\.\d+)?)/);
    const support = supportMatch ? parseFloat(supportMatch[1]) : 0;
    
    const resistanceMatch = text.match(/"resistance":\s*(\d+(?:\.\d+)?)/);
    const resistance = resistanceMatch ? parseFloat(resistanceMatch[1]) : 0;
    
    // Extract P/E ratio
    const peMatch = text.match(/"peRatio":\s*(\d+(?:\.\d+)?)/);
    const peRatio = peMatch ? parseFloat(peMatch[1]) : 0;
    
    // Extract price predictions
    const shortTermMatch = text.match(/"shortTerm":\s*(\d+(?:\.\d+)?)/);
    const shortTerm = shortTermMatch ? parseFloat(shortTermMatch[1]) : 0;
    
    const mediumTermMatch = text.match(/"mediumTerm":\s*(\d+(?:\.\d+)?)/);
    const mediumTerm = mediumTermMatch ? parseFloat(mediumTermMatch[1]) : 0;
    
    const longTermMatch = text.match(/"longTerm":\s*(\d+(?:\.\d+)?)/);
    const longTerm = longTermMatch ? parseFloat(longTermMatch[1]) : 0;
    
    console.log('Fallback parsing extracted:', { confidence, riskScore, marketTrend, sector, rsi, support, resistance, peRatio, shortTerm, mediumTerm, longTerm });
    
    return {
      symbol,
      timeframe,
      pricePrediction: {
        shortTerm,
        mediumTerm,
        longTerm
      },
      confidence,
      riskFactors,
      marketTrend: marketTrend as any,
      sectorAnalysis: {
        sector,
        trend: marketTrend,
        strength: 5
      },
      technicalIndicators: {
        rsi,
        macd: 'Neutral',
        support,
        resistance
      },
      fundamentalFactors: {
        peRatio,
        debtToEquity: 0.12,
        growthRate: 10.0,
        marketCap: 2.0
      },
      riskScore,
      anomalies: ['Extracted from text analysis'],
      recommendations: ['Based on text analysis']
    };
  } catch (error) {
    console.log('Fallback text parsing failed:', error);
    return null;
  }
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
