import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('🧪 TEST STOCKS API CALLED');
  
  const mockStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.00,
      change: 2.50,
      changePercent: 1.69,
      exchange: 'NASDAQ',
      currency: 'USD',
      volume: 50000000,
      open: 148.50,
      high: 151.20,
      low: 147.80,
      previousClose: 147.50
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 320.00,
      change: -1.20,
      changePercent: -0.37,
      exchange: 'NASDAQ',
      currency: 'USD',
      volume: 30000000,
      open: 322.00,
      high: 323.50,
      low: 319.00,
      previousClose: 321.20
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 135.00,
      change: 0.80,
      changePercent: 0.60,
      exchange: 'NASDAQ',
      currency: 'USD',
      volume: 25000000,
      open: 134.20,
      high: 136.00,
      low: 133.50,
      previousClose: 134.20
    }
  ];
  
  console.log('🧪 Returning test mock data:', mockStocks.length, 'stocks');
  return NextResponse.json(mockStocks);
}
