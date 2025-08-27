import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Twelve Data API key not configured' },
        { status: 500 }
      );
    }

    // Popular stock symbols for real-time data
    const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK.A', 'JPM', 'V'];
    
    // Fetch each stock individually to ensure proper data structure
    const stockPromises = popularSymbols.map(async (symbol) => {
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
          currency: data.currency,
          volume: parseInt(data.volume) || 0,
          open: parseFloat(data.open) || 0,
          high: parseFloat(data.high) || 0,
          low: parseFloat(data.low) || 0,
          previousClose: parseFloat(data.previous_close) || 0
        };
      } catch (error) {
        return null;
      }
    });
    
    const stocks = await Promise.all(stockPromises);
    const validStocks = stocks.filter(stock => stock !== null);
    
    return NextResponse.json(validStocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
