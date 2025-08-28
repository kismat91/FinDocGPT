import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🧪 TEST FOREX API CALLED');
  
  const testData = {
    pairs: [
      {
        symbol: 'EUR/USD',
        name: 'EUR/USD Exchange Rate',
        price: 1.0542,
        change: 0.0012,
        changePercent: 0.11
      },
      {
        symbol: 'GBP/USD',
        name: 'GBP/USD Exchange Rate',
        price: 1.2678,
        change: -0.0034,
        changePercent: -0.27
      },
      {
        symbol: 'USD/JPY',
        name: 'USD/JPY Exchange Rate',
        price: 149.85,
        change: 0.45,
        changePercent: 0.30
      }
    ]
  };
  
  console.log('🧪 Returning test forex data:', testData.pairs.length, 'pairs');
  return NextResponse.json(testData);
}
