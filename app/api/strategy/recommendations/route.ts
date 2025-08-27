import { NextRequest, NextResponse } from "next/server";

// Enhanced investment strategy engine for buy/sell recommendations
// Based on FinanceAI architecture with strategic decision-making capabilities

interface MarketData {
  symbol: string;
  currentPrice: number;
  historicalPrices: number[];
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

interface FinancialMetrics {
  revenue: number;
  profit: number;
  debt: number;
  cash: number;
  growthRate: number;
}

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  movingAverage: number;
  volatility: number;
}

interface StrategyRecommendation {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string[];
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  targetPrice: number;
  stopLoss: number;
  timeHorizon: string;
  portfolioAllocation: number;
}

export async function POST(request: NextRequest) {
  try {
    const { marketData, financialMetrics, technicalIndicators, userProfile } = await request.json();
    
    if (!marketData || !financialMetrics || !technicalIndicators) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // Generate comprehensive investment strategy
    const recommendation = await generateInvestmentStrategy(
      marketData,
      financialMetrics,
      technicalIndicators,
      userProfile
    );

    // Calculate risk-adjusted returns
    const riskMetrics = calculateRiskMetrics(marketData, financialMetrics);
    
    // Generate portfolio optimization suggestions
    const portfolioSuggestions = generatePortfolioSuggestions(recommendation, riskMetrics);

    return NextResponse.json({
      success: true,
      recommendation,
      riskMetrics,
      portfolioSuggestions,
      timestamp: new Date().toISOString(),
      modelVersion: "FinanceAI-Strategy-v2.0"
    });

  } catch (error) {
    console.error("Strategy generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate investment strategy" },
      { status: 500 }
    );
  }
}

async function generateInvestmentStrategy(
  marketData: MarketData,
  financialMetrics: FinancialMetrics,
  technicalIndicators: TechnicalIndicators,
  userProfile: any
): Promise<StrategyRecommendation> {
  
  let action: "BUY" | "SELL" | "HOLD" = "HOLD";
  let confidence = 0;
  let reasoning: string[] = [];
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
  
  // Fundamental Analysis
  const fundamentalScore = analyzeFundamentals(financialMetrics);
  if (fundamentalScore > 0.7) {
    action = "BUY";
    confidence += 0.4;
    reasoning.push("Strong fundamental metrics with positive growth trajectory");
  } else if (fundamentalScore < 0.3) {
    action = "SELL";
    confidence += 0.4;
    reasoning.push("Weak fundamental metrics indicating potential decline");
  }
  
  // Technical Analysis
  const technicalScore = analyzeTechnicalIndicators(technicalIndicators);
  if (technicalScore > 0.7) {
    if (action === "BUY") confidence += 0.3;
    reasoning.push("Positive technical indicators support bullish momentum");
  } else if (technicalScore < 0.3) {
    if (action === "SELL") confidence += 0.3;
    reasoning.push("Negative technical indicators suggest bearish trend");
  }
  
  // Valuation Analysis
  const valuationScore = analyzeValuation(marketData);
  if (valuationScore > 0.7) {
    if (action === "BUY") confidence += 0.2;
    reasoning.push("Attractive valuation metrics compared to peers");
  } else if (valuationScore < 0.3) {
    if (action === "SELL") confidence += 0.2;
    reasoning.push("Overvalued compared to fundamental metrics");
  }
  
  // Risk Assessment
  riskLevel = assessRiskLevel(marketData, financialMetrics, technicalIndicators);
  
  // Calculate target price and stop loss
  const { targetPrice, stopLoss } = calculatePriceTargets(
    marketData.currentPrice,
    action,
    technicalIndicators,
    financialMetrics
  );
  
  // Determine time horizon
  const timeHorizon = determineTimeHorizon(action, confidence, userProfile);
  
  // Calculate portfolio allocation
  const portfolioAllocation = calculatePortfolioAllocation(
    confidence,
    riskLevel,
    userProfile
  );
  
  return {
    action,
    confidence: Math.min(1, confidence),
    reasoning,
    riskLevel,
    targetPrice,
    stopLoss,
    timeHorizon,
    portfolioAllocation
  };
}

function analyzeFundamentals(metrics: FinancialMetrics): number {
  let score = 0;
  
  // Revenue growth
  if (metrics.growthRate > 0.15) score += 0.3;
  else if (metrics.growthRate > 0.05) score += 0.2;
  else if (metrics.growthRate < 0) score -= 0.2;
  
  // Profitability
  if (metrics.profit > 0) score += 0.3;
  else score -= 0.3;
  
  // Financial health
  if (metrics.cash > metrics.debt) score += 0.2;
  else score -= 0.2;
  
  // Revenue quality
  if (metrics.revenue > 0) score += 0.2;
  
  return Math.max(0, Math.min(1, score));
}

function analyzeTechnicalIndicators(indicators: TechnicalIndicators): number {
  let score = 0;
  
  // RSI analysis
  if (indicators.rsi < 30) score += 0.3; // Oversold
  else if (indicators.rsi > 70) score -= 0.3; // Overbought
  else score += 0.1; // Neutral
  
  // MACD analysis
  if (indicators.macd > 0) score += 0.3; // Bullish
  else score -= 0.3; // Bearish
  
  // Moving average analysis
  if (indicators.movingAverage > 0) score += 0.2; // Above MA
  else score -= 0.2; // Below MA
  
  // Volatility consideration
  if (indicators.volatility < 0.2) score += 0.2; // Low volatility
  else if (indicators.volatility > 0.5) score -= 0.1; // High volatility
  
  return Math.max(0, Math.min(1, (score + 1) / 2));
}

function analyzeValuation(marketData: MarketData): number {
  let score = 0;
  
  // P/E ratio analysis
  if (marketData.peRatio < 15) score += 0.4; // Undervalued
  else if (marketData.peRatio < 25) score += 0.2; // Fair value
  else score -= 0.2; // Potentially overvalued
  
  // Dividend yield analysis
  if (marketData.dividendYield > 0.04) score += 0.3; // Good dividend
  else if (marketData.dividendYield > 0.02) score += 0.1; // Moderate dividend
  
  // Market cap consideration
  if (marketData.marketCap > 10000000000) score += 0.1; // Large cap stability
  else if (marketData.marketCap > 1000000000) score += 0.05; // Mid cap
  
  return Math.max(0, Math.min(1, (score + 1) / 2));
}

function assessRiskLevel(
  marketData: MarketData,
  financialMetrics: FinancialMetrics,
  technicalIndicators: TechnicalIndicators
): "LOW" | "MEDIUM" | "HIGH" {
  let riskScore = 0;
  
  // Volatility risk
  if (technicalIndicators.volatility > 0.4) riskScore += 2;
  else if (technicalIndicators.volatility > 0.2) riskScore += 1;
  
  // Financial risk
  if (financialMetrics.debt > financialMetrics.cash) riskScore += 2;
  if (financialMetrics.growthRate < 0) riskScore += 1;
  
  // Market risk
  if (marketData.marketCap < 1000000000) riskScore += 1; // Small cap
  
  if (riskScore >= 4) return "HIGH";
  if (riskScore >= 2) return "MEDIUM";
  return "LOW";
}

function calculatePriceTargets(
  currentPrice: number,
  action: string,
  indicators: TechnicalIndicators,
  metrics: FinancialMetrics
): { targetPrice: number; stopLoss: number } {
  
  let targetPrice = currentPrice;
  let stopLoss = currentPrice;
  
  if (action === "BUY") {
    // Calculate upside potential based on technical and fundamental factors
    const upsidePotential = 0.15 + (indicators.rsi < 30 ? 0.1 : 0) + (metrics.growthRate > 0.1 ? 0.1 : 0);
    targetPrice = currentPrice * (1 + upsidePotential);
    stopLoss = currentPrice * 0.85; // 15% stop loss
  } else if (action === "SELL") {
    // Calculate downside potential
    const downsidePotential = 0.2 + (indicators.rsi > 70 ? 0.1 : 0) + (metrics.growthRate < 0 ? 0.1 : 0);
    targetPrice = currentPrice * (1 - downsidePotential);
    stopLoss = currentPrice * 1.15; // 15% stop loss for short positions
  }
  
  return { targetPrice, stopLoss };
}

function determineTimeHorizon(
  action: string,
  confidence: number,
  userProfile: any
): string {
  if (action === "HOLD") return "3-6 months";
  
  if (confidence > 0.8) {
    return action === "BUY" ? "6-12 months" : "1-3 months";
  } else if (confidence > 0.6) {
    return action === "BUY" ? "3-6 months" : "1-3 months";
  } else {
    return "1-3 months";
  }
}

function calculatePortfolioAllocation(
  confidence: number,
  riskLevel: "LOW" | "MEDIUM" | "HIGH",
  userProfile: any
): number {
  let baseAllocation = confidence * 0.1; // Base 10% allocation
  
  // Adjust for risk level
  if (riskLevel === "LOW") baseAllocation *= 1.2;
  else if (riskLevel === "HIGH") baseAllocation *= 0.7;
  
  // Adjust for user profile (if available)
  if (userProfile?.riskTolerance === "conservative") baseAllocation *= 0.7;
  else if (userProfile?.riskTolerance === "aggressive") baseAllocation *= 1.3;
  
  return Math.min(0.25, Math.max(0.01, baseAllocation)); // Between 1% and 25%
}

function calculateRiskMetrics(marketData: MarketData, financialMetrics: FinancialMetrics) {
  return {
    volatility: calculateVolatility(marketData.historicalPrices),
    debtToEquity: financialMetrics.debt / Math.max(financialMetrics.cash, 1),
    growthStability: Math.abs(financialMetrics.growthRate),
    marketCapRisk: marketData.marketCap < 1000000000 ? "HIGH" : "MEDIUM"
  };
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  const returns = prices.slice(1).map((price, i) => 
    (price - prices[i]) / prices[i]
  );
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
}

function generatePortfolioSuggestions(recommendation: StrategyRecommendation, riskMetrics: any) {
  const suggestions = [];
  
  if (recommendation.action === "BUY") {
    suggestions.push("Consider dollar-cost averaging for large positions");
    suggestions.push("Monitor stop-loss levels for risk management");
  }
  
  if (riskMetrics.volatility > 0.3) {
    suggestions.push("High volatility detected - consider position sizing");
  }
  
  if (recommendation.riskLevel === "HIGH") {
    suggestions.push("High-risk position - ensure proper diversification");
  }
  
  return suggestions;
}
