import { NextResponse } from 'next/server';

interface ForecastingRequest {
  symbol: string;
  timeframe?: string;
  forecastType?: string;
}

export async function POST(request: Request) {
  try {
    const body: ForecastingRequest = await request.json();
    const { symbol, timeframe = "1 month", forecastType = "trend_analysis" } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Call the Python backend for forecasting
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001';
    
    const response = await fetch(`${backendUrl}/api/forecasting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: symbol.toUpperCase(),
        timeframe,
        forecastType
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generating forecast:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate forecast', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}