import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Twelve Data API key not configured' },
        { status: 500 }
      );
    }

    // Popular forex pairs for real-time data
    const popularPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'];
    
    // Fetch each forex pair individually to ensure proper data structure
    const forexPromises = popularPairs.map(async (symbol) => {
      try {
        const apiUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          return null;
        }
        
        const data = await response.json();
        
        // Check if we have valid data
        if (!data.symbol || !data.close) {
          return null;
        }
        
        return {
          symbol: data.symbol,
          name: data.name,
          price: parseFloat(data.close) || 0,
          change: parseFloat(data.change) || 0,
          changePercent: parseFloat(data.percent_change) || 0,
          exchange: data.exchange,
          currency: 'USD',
          open: parseFloat(data.open) || 0,
          high: parseFloat(data.high) || 0,
          low: parseFloat(data.low) || 0,
          previousClose: parseFloat(data.previous_close) || 0
        };
      } catch (error) {
        return null;
      }
    });
    
    const forexs = await Promise.all(forexPromises);
    const validForexs = forexs.filter(forex => forex !== null);
    
    // Apply pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedForexs = validForexs.slice(start, end);

    return NextResponse.json({
      data: paginatedForexs,
      pagination: {
        page,
        limit,
        total: validForexs.length,
        totalPages: Math.ceil(validForexs.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching forex data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forex data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
