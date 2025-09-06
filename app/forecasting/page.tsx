"use client";

import { useState } from "react";
import Link from "next/link";

interface ForecastResult {
  success: boolean;
  symbol: string;
  timeframe: string;
  forecastType: string;
  analysis?: {
    trendDirection: string;
    confidence: number;
    keyLevels: {
      support: number;
      resistance: number;
      current: number;
    };
    momentum: string;
    technicalIndicators: {
      rsi: number;
      macd: string;
      movingAverages: string;
      bollingerBands: string;
    };
  };
  predictions?: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  riskFactors?: string[];
  recommendations?: string[];
  marketContext?: {
    sectorOutlook: string;
    marketSentiment: string;
    economicFactors: string;
    sectorRotation: string;
  };
  priceTargets?: {
    conservative: number;
    baseCase: number;
    bullCase: number;
    bearCase: number;
  };
  volatilityMetrics?: {
    currentVolatility: number;
    predictedVolatility: number;
    volatilityTrend: string;
    vixCorrelation: number;
  };
}

export default function ForecastingPage() {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1 month');
  const [forecastType, setForecastType] = useState('trend_analysis');
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeframes = [
    { value: '1 day', label: '1 Day' },
    { value: '1 week', label: '1 Week' },
    { value: '1 month', label: '1 Month' },
    { value: '3 months', label: '3 Months' },
    { value: '6 months', label: '6 Months' },
    { value: '1 year', label: '1 Year' }
  ];

  const forecastTypes = [
    { 
      value: 'trend_analysis', 
      label: 'Trend Analysis', 
      description: 'Market direction and momentum analysis',
              icon: ''
    },
    { 
      value: 'price_prediction', 
      label: 'Price Prediction', 
      description: 'Specific price targets and levels',
      icon: ''
    },
    { 
      value: 'volatility_forecast', 
      label: 'Volatility Forecast', 
      description: 'Expected market volatility and risk',
              icon: ''
    },
    { 
      value: 'earnings_forecast', 
      label: 'Earnings Forecast', 
      description: 'Revenue and profit projections',
      icon: ''
    }
  ];

  const handleForecast = async () => {
    if (!symbol.trim()) {
      setError('Please enter a symbol');
      return;
    }

    setIsForecasting(true);
    setError(null);
    setForecastResult(null);

    try {
      const response = await fetch('/api/forecasting', {
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

      const result = await response.json();

      if (result.success) {
        setForecastResult(result);
      } else {
        setError(result.error || 'Forecast generation failed');
      }
    } catch (error) {
      setError('Failed to generate forecast. Please try again.');
    } finally {
      setIsForecasting(false);
    }
  };

  const resetForecast = () => {
    setSymbol('');
    setForecastResult(null);
    setError(null);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white">FinDocGPT</span>
            </Link>
            <div className="flex space-x-6">
              <Link href="/stocks" className="text-white/80 hover:text-white transition-colors">Stocks</Link>
              <Link href="/forexs" className="text-white/80 hover:text-white transition-colors">Forex</Link>
              <Link href="/cryptos" className="text-white/80 hover:text-white transition-colors">Crypto</Link>
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
              <Link href="/document-analysis" className="text-white/80 hover:text-white transition-colors">Documents</Link>
              <Link href="/forecasting" className="text-white font-semibold">Forecasting</Link>
              <Link href="/strategy" className="text-white/80 hover:text-white transition-colors">Strategy</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Forecasting</h1>
          <p className="text-xl text-white/80">Machine learning market predictions and trend analysis</p>
        </div>

        {/* Forecast Configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Forecast Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Symbol Input */}
            <div>
              <label className="block text-white font-medium mb-3">Symbol:</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g., AAPL, BTC/USD, EUR/USD"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Timeframe Selection */}
            <div>
              <label className="block text-white font-medium mb-3">Timeframe:</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {timeframes.map((tf) => (
                  <option key={tf.value} value={tf.value} className="bg-slate-800 text-white">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Type Selection */}
            <div>
              <label className="block text-white font-medium mb-3">Forecast Type:</label>
              <select
                value={forecastType}
                onChange={(e) => setForecastType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {forecastTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800 text-white">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forecast Type Details */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Selected Forecast Type:</h3>
            <div className="bg-white/10 rounded-lg p-4">
              {(() => {
                const selectedType = forecastTypes.find(t => t.value === forecastType);
                return (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedType?.icon}</span>
                    <div>
                      <div className="text-white font-semibold">{selectedType?.label}</div>
                      <div className="text-white/70 text-sm">{selectedType?.description}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleForecast}
              disabled={!symbol.trim() || isForecasting}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg transition-colors duration-300"
            >
              {isForecasting ? (
                <>
                  <div className="spinner inline-block mr-2"></div>
                  Generating Forecast...
                </>
              ) : (
                'Generate Forecast'
              )}
            </button>
            
            {symbol && (
              <button
                onClick={resetForecast}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Reset
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Forecast Results */}
        {forecastResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Forecast Results</h2>
            
            {/* Forecast Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white/70 text-sm mb-1">Symbol</h3>
                <p className="text-white font-bold text-lg">{forecastResult.symbol}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white/70 text-sm mb-1">Timeframe</h3>
                <p className="text-white font-bold text-lg">{forecastResult.timeframe}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white/70 text-sm mb-1">Type</h3>
                <p className="text-white font-bold text-lg">
                  {forecastTypes.find(t => t.value === forecastResult.forecastType)?.label}
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white/70 text-sm mb-1">Confidence</h3>
                <p className={`font-bold text-lg ${getConfidenceColor((forecastResult.analysis?.confidence || 0) * 100)}`}>
                  {Math.round((forecastResult.analysis?.confidence || 0) * 100)}%
                </p>
                <p className={`text-xs ${getConfidenceColor((forecastResult.analysis?.confidence || 0) * 100)}`}>
                  {getConfidenceLabel((forecastResult.analysis?.confidence || 0) * 100)}
                </p>
              </div>
            </div>

            {/* Risk Assessment */}
            {forecastResult.riskFactors && forecastResult.riskFactors.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-2">Risk Assessment</h3>
                <ul className="text-white/90 space-y-1">
                  {forecastResult.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Forecast Analysis */}
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">AI Forecast Analysis</h3>
              
              {/* Trend Analysis */}
              {forecastResult.analysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Trend Direction</h4>
                      <p className={`text-lg font-semibold ${
                        forecastResult.analysis.trendDirection === 'Bullish' ? 'text-green-400' : 
                        forecastResult.analysis.trendDirection === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {forecastResult.analysis.trendDirection}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Momentum</h4>
                      <p className="text-white/90">{forecastResult.analysis.momentum}</p>
                    </div>
                  </div>

                  {/* Key Levels */}
                  <div>
                    <h4 className="text-white font-medium mb-2">Key Levels</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Support</p>
                        <p className="text-red-400 font-semibold">${forecastResult.analysis.keyLevels.support}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Current</p>
                        <p className="text-white font-semibold">${forecastResult.analysis.keyLevels.current}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Resistance</p>
                        <p className="text-green-400 font-semibold">${forecastResult.analysis.keyLevels.resistance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Indicators */}
                  <div>
                    <h4 className="text-white font-medium mb-2">Technical Indicators</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm">RSI</p>
                        <p className="text-white">{forecastResult.analysis.technicalIndicators.rsi}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">MACD</p>
                        <p className="text-white">{forecastResult.analysis.technicalIndicators.macd}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Moving Averages</p>
                        <p className="text-white">{forecastResult.analysis.technicalIndicators.movingAverages}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Bollinger Bands</p>
                        <p className="text-white">{forecastResult.analysis.technicalIndicators.bollingerBands}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Predictions */}
              {forecastResult.predictions && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Predictions</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-white/70 text-sm">Short-term (1-2 weeks)</p>
                      <p className="text-white/90">{forecastResult.predictions.shortTerm}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Medium-term (1-3 months)</p>
                      <p className="text-white/90">{forecastResult.predictions.mediumTerm}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Long-term (3-12 months)</p>
                      <p className="text-white/90">{forecastResult.predictions.longTerm}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Targets */}
              {forecastResult.priceTargets && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Price Targets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Conservative</p>
                      <p className="text-yellow-400 font-semibold">${forecastResult.priceTargets.conservative}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Base Case</p>
                      <p className="text-white font-semibold">${forecastResult.priceTargets.baseCase}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Bull Case</p>
                      <p className="text-green-400 font-semibold">${forecastResult.priceTargets.bullCase}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Bear Case</p>
                      <p className="text-red-400 font-semibold">${forecastResult.priceTargets.bearCase}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Volatility Metrics */}
              {forecastResult.volatilityMetrics && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Volatility Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Current Volatility</p>
                      <p className="text-white font-semibold">{(forecastResult.volatilityMetrics.currentVolatility * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Predicted Volatility</p>
                      <p className="text-white font-semibold">{(forecastResult.volatilityMetrics.predictedVolatility * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Trend</p>
                      <p className="text-white">{forecastResult.volatilityMetrics.volatilityTrend}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">VIX Correlation</p>
                      <p className="text-white">{(forecastResult.volatilityMetrics.vixCorrelation * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Context */}
              {forecastResult.marketContext && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Market Context</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-sm">Sector Outlook</p>
                      <p className="text-white/90">{forecastResult.marketContext.sectorOutlook}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Market Sentiment</p>
                      <p className="text-white/90">{forecastResult.marketContext.marketSentiment}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Economic Factors</p>
                      <p className="text-white/90">{forecastResult.marketContext.economicFactors}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Sector Rotation</p>
                      <p className="text-white/90">{forecastResult.marketContext.sectorRotation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {forecastResult.recommendations && forecastResult.recommendations.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Recommendations</h4>
                  <ul className="text-white/90 space-y-1">
                    {forecastResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Disclaimer:</strong> This AI-generated forecast is for informational purposes only and should not be considered as financial advice. 
                Always conduct your own research and consult with financial professionals before making investment decisions.
              </p>
            </div>

            {/* Timestamp */}
            <div className="mt-4 text-center">
              <p className="text-white/50 text-sm">
                Generated on: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
