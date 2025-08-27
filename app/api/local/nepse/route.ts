import { NextRequest, NextResponse } from "next/server";

// Enhanced local market data integration for NEPSE
// Based on FinanceAI architecture with local market capabilities

interface NEPSEStock {
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
  high: number;
  low: number;
  open: number;
  marketCap: number;
  peRatio: number;
  bookValue: number;
  dividendYield: number;
}

interface NEPSEIndex {
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
}

interface NEPSEMarketData {
  indices: NEPSEIndex[];
  topGainers: NEPSEStock[];
  topLosers: NEPSEStock[];
  topTurnover: NEPSEStock[];
  sectorPerformance: Array<{
    sector: string;
    change: number;
    changePercent: number;
  }>;
  marketSummary: {
    totalTradedShares: number;
    totalTurnover: number;
    totalTransactions: number;
    marketStatus: string;
    lastUpdated: string;
  };
}

// Mock data for demonstration - replace with actual NEPSE API integration
const mockNEPSEData: NEPSEMarketData = {
  indices: [
    {
      name: "NEPSE",
      currentValue: 2150.45,
      change: 15.67,
      changePercent: 0.73,
      volume: 4567890,
      turnover: 1250000000
    },
    {
      name: "Sensitive Index",
      currentValue: 425.32,
      change: 8.45,
      changePercent: 2.03,
      volume: 2345678,
      turnover: 890000000
    }
  ],
  topGainers: [
    {
      symbol: "NICL",
      companyName: "Nepal Insurance Company Limited",
      sector: "Insurance",
      currentPrice: 1250,
      previousClose: 1100,
      change: 150,
      changePercent: 13.64,
      volume: 45000,
      turnover: 56250000,
      high: 1280,
      low: 1200,
      open: 1150,
      marketCap: 1250000000,
      peRatio: 15.6,
      bookValue: 80.5,
      dividendYield: 4.2
    },
    {
      symbol: "NRIC",
      companyName: "Nepal Reinsurance Company Limited",
      sector: "Insurance",
      currentPrice: 890,
      previousClose: 820,
      change: 70,
      changePercent: 8.54,
      volume: 32000,
      turnover: 28480000,
      high: 900,
      low: 870,
      open: 825,
      marketCap: 890000000,
      peRatio: 12.8,
      bookValue: 69.5,
      dividendYield: 3.8
    }
  ],
  topLosers: [
    {
      symbol: "NBL",
      companyName: "Nepal Bank Limited",
      sector: "Banking",
      currentPrice: 450,
      previousClose: 520,
      change: -70,
      changePercent: -13.46,
      volume: 28000,
      turnover: 12600000,
      high: 480,
      low: 440,
      open: 510,
      marketCap: 4500000000,
      peRatio: 8.9,
      bookValue: 50.8,
      dividendYield: 6.5
    }
  ],
  topTurnover: [
    {
      symbol: "NICL",
      companyName: "Nepal Insurance Company Limited",
      sector: "Insurance",
      currentPrice: 1250,
      previousClose: 1100,
      change: 150,
      changePercent: 13.64,
      volume: 45000,
      turnover: 56250000,
      high: 1280,
      low: 1200,
      open: 1150,
      marketCap: 1250000000,
      peRatio: 15.6,
      bookValue: 80.5,
      dividendYield: 4.2
    }
  ],
  sectorPerformance: [
    { sector: "Banking", change: 2.5, changePercent: 1.2 },
    { sector: "Insurance", change: 8.7, changePercent: 4.1 },
    { sector: "Development Banks", change: 3.2, changePercent: 2.8 },
    { sector: "Finance", change: 1.8, changePercent: 1.5 },
    { sector: "Microfinance", change: 5.4, changePercent: 3.2 }
  ],
  marketSummary: {
    totalTradedShares: 4567890,
    totalTurnover: 1250000000,
    totalTransactions: 45678,
    marketStatus: "Open",
    lastUpdated: new Date().toISOString()
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get("type") || "overview";
    const symbol = searchParams.get("symbol");
    
    let responseData: any;
    
    switch (dataType) {
      case "overview":
        responseData = mockNEPSEData;
        break;
        
      case "indices":
        responseData = mockNEPSEData.indices;
        break;
        
      case "topGainers":
        responseData = mockNEPSEData.topGainers;
        break;
        
      case "topLosers":
        responseData = mockNEPSEData.topLosers;
        break;
        
      case "sectorPerformance":
        responseData = mockNEPSEData.sectorPerformance;
        break;
        
      case "stock":
        if (symbol) {
          const stock = findStockBySymbol(symbol);
          if (stock) {
            responseData = stock;
          } else {
            return NextResponse.json({ error: "Stock not found" }, { status: 404 });
          }
        } else {
          return NextResponse.json({ error: "Symbol parameter required for stock data" }, { status: 400 });
        }
        break;
        
      default:
        responseData = mockNEPSEData;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      source: "NEPSE",
      timestamp: new Date().toISOString(),
      note: "This is mock data. Replace with actual NEPSE API integration."
    });

  } catch (error) {
    console.error("NEPSE API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NEPSE data" },
      { status: 500 }
    );
  }
}

// Search stocks by symbol or company name
export async function POST(request: NextRequest) {
  try {
    const { searchTerm, sector, minPrice, maxPrice } = await request.json();
    
    let filteredStocks = [...mockNEPSEData.topGainers, ...mockNEPSEData.topLosers];
    
    // Apply filters
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredStocks = filteredStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(term) ||
        stock.companyName.toLowerCase().includes(term) ||
        stock.sector.toLowerCase().includes(term)
      );
    }
    
    if (sector) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.sector.toLowerCase() === sector.toLowerCase()
      );
    }
    
    if (minPrice !== undefined) {
      filteredStocks = filteredStocks.filter(stock => stock.currentPrice >= minPrice);
    }
    
    if (maxPrice !== undefined) {
      filteredStocks = filteredStocks.filter(stock => stock.currentPrice <= maxPrice);
    }
    
    return NextResponse.json({
      success: true,
      data: filteredStocks,
      totalResults: filteredStocks.length,
      source: "NEPSE",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("NEPSE search error:", error);
    return NextResponse.json(
      { error: "Failed to search NEPSE stocks" },
      { status: 500 }
    );
  }
}

function findStockBySymbol(symbol: string): NEPSEStock | null {
  const allStocks = [...mockNEPSEData.topGainers, ...mockNEPSEData.topLosers];
  return allStocks.find(stock => stock.symbol.toLowerCase() === symbol.toLowerCase()) || null;
}

// Helper function to get real-time NEPSE data (implement with actual API)
async function fetchRealTimeNEPSEData() {
  try {
    // Replace with actual NEPSE API calls
    // Example: const response = await fetch('https://nepse-api.com/live-data');
    // return await response.json();
    
    // For now, return mock data
    return mockNEPSEData;
  } catch (error) {
    console.error("Failed to fetch real-time NEPSE data:", error);
    return mockNEPSEData; // Fallback to mock data
  }
}
