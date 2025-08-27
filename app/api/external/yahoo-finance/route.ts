import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

// Enhanced external data integration with Yahoo Finance
// Based on FinanceAI architecture with multi-source data capabilities

interface YahooFinanceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekRange: {
    low: number;
    high: number;
  };
  historicalData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const period = searchParams.get("period") || "1y";
    
    if (!symbol) {
      return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 });
    }

    // Fetch real-time quote data
    const quote = await yahooFinance.quote(symbol);
    
    // Fetch historical data
    const historical = await yahooFinance.historical(symbol, {
      period: period as any,
      interval: "1d"
    });

    // Transform data to consistent format
    const transformedData: YahooFinanceData = {
      symbol: quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      dividendYield: quote.trailingAnnualDividendYield || 0,
      fiftyTwoWeekRange: {
        low: quote.fiftyTwoWeekLow || 0,
        high: quote.fiftyTwoWeekHigh || 0
      },
      historicalData: historical.map(item => ({
        date: item.date.toISOString().split('T')[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
      source: "Yahoo Finance",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Yahoo Finance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Yahoo Finance" },
      { status: 500 }
    );
  }
}

// Additional endpoint for batch symbol lookup
export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: "Symbols array is required" }, { status: 400 });
    }

    // Limit to 10 symbols per request to avoid rate limiting
    const limitedSymbols = symbols.slice(0, 10);
    
    // Fetch data for multiple symbols
    const results = await Promise.allSettled(
      limitedSymbols.map(async (symbol: string) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          return {
            symbol: quote.symbol,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            volume: quote.regularMarketVolume || 0,
            marketCap: quote.marketCap || 0
          };
        } catch (error) {
          return { symbol, error: "Failed to fetch data" };
        }
      })
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
      .map(result => result.value);

    const failedResults = results
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map(result => ({ error: result.reason }));

    return NextResponse.json({
      success: true,
      data: successfulResults,
      failed: failedResults,
      totalRequested: symbols.length,
      totalSuccessful: successfulResults.length,
      source: "Yahoo Finance",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Batch Yahoo Finance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch batch data from Yahoo Finance" },
      { status: 500 }
    );
  }
}
