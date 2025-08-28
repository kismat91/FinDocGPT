import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Parse the URL to handle query parameters
    const url = new URL(request.url);
    console.log('Crypto API called with URL:', url.toString());
    
    const API_KEY = process.env.TWELVE_DATA_API_KEY;
    console.log('Crypto API Key available:', !!API_KEY);
    
    if (!API_KEY) {
      console.error('TWELVE_DATA_API_KEY is not set');
      return NextResponse.json({ error: 'API key is required' }, { status: 500 });
    }

    const cryptos = ['BTC/USD', 'ETH/USD', 'ADA/USD', 'DOT/USD', 'XRP/USD', 'LTC/USD', 'BCH/USD', 'LINK/USD'];
    
    const cryptoPromises = cryptos.map(async (crypto) => {
      try {
        const symbol = crypto.replace('/', '');
        const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`;
        console.log(`Fetching crypto data for ${crypto} from:`, url.replace(API_KEY, 'API_KEY_MASKED'));
        
        const response = await fetch(url);
        console.log(`Crypto API response status for ${crypto}:`, response.status);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${crypto}:`, response.status, response.statusText);
          return null;
        }

        const data = await response.json();
        console.log(`Crypto API response data for ${crypto}:`, data);

        if (data.code === 429) {
          console.error(`Rate limit exceeded for ${crypto}`);
          return null;
        }

        if (!data || data.status === 'error' || !data.close) {
          console.error(`Invalid data structure for ${crypto}:`, data);
          return null;
        }

        return {
          symbol: crypto,
          name: crypto.replace('/USD', ''),
          price: parseFloat(data.close),
          change: data.change ? parseFloat(data.change) : 0,
          changePercent: data.percent_change ? parseFloat(data.percent_change) : 0,
          open: data.open ? parseFloat(data.open) : null,
          high: data.high ? parseFloat(data.high) : null,
          low: data.low ? parseFloat(data.low) : null,
          previousClose: data.previous_close ? parseFloat(data.previous_close) : null,
          volume: data.volume ? parseInt(data.volume) : null,
          marketCap: null, // Not available in twelve data
          timestamp: data.datetime || new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error fetching ${crypto}:`, error);
        return null;
      }
    });

    const cryptoData = await Promise.all(cryptoPromises);
    const validCryptos = cryptoData.filter(crypto => crypto !== null);
    
    console.log('Valid cryptos found:', validCryptos.length);
    
    // If no valid cryptos, return mock data for testing
    if (validCryptos.length === 0) {
      console.log('No valid cryptos from API, returning mock data');
      const mockCryptos = [
        {
          symbol: 'BTC/USD',
          name: 'BTC',
          price: 43250.00,
          change: 1250.50,
          changePercent: 2.98,
          open: 42000.00,
          high: 43500.00,
          low: 41800.00,
          previousClose: 42000.00,
          volume: 28000000000,
          marketCap: null,
          timestamp: new Date().toISOString()
        },
        {
          symbol: 'ETH/USD',
          name: 'ETH',
          price: 2650.00,
          change: -85.30,
          changePercent: -3.12,
          open: 2735.30,
          high: 2750.00,
          low: 2620.00,
          previousClose: 2735.30,
          volume: 15000000000,
          marketCap: null,
          timestamp: new Date().toISOString()
        },
        {
          symbol: 'ADA/USD',
          name: 'ADA',
          price: 0.485,
          change: 0.022,
          changePercent: 4.75,
          open: 0.463,
          high: 0.495,
          low: 0.460,
          previousClose: 0.463,
          volume: 750000000,
          marketCap: null,
          timestamp: new Date().toISOString()
        }
      ];
      return NextResponse.json(mockCryptos);
    }
    
    return NextResponse.json(validCryptos);
  } catch (error) {
    console.error('Crypto API error:', error);
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
  }
}
