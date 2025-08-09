import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  MinusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Strategy {
  symbol: string;
  recommendation: 'buy' | 'sell' | 'hold';
  confidence_score: number;
  reasoning: string;
  risk_level: 'low' | 'medium' | 'high';
  target_price?: number;
  stop_loss?: number;
  time_horizon: string;
  factors_considered: string[];
  created_at: string;
}

const InvestmentStrategy: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [timeHorizon, setTimeHorizon] = useState('1y');
  const [includeTechnical, setIncludeTechnical] = useState(true);
  const [includeFundamental, setIncludeFundamental] = useState(true);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStrategy = async () => {
    if (!symbol.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockStrategy: Strategy = {
        symbol: symbol.toUpperCase(),
        recommendation: Math.random() > 0.5 ? 'buy' : 'sell',
        confidence_score: 0.75 + Math.random() * 0.2,
        reasoning: `Based on technical and fundamental analysis, ${symbol.toUpperCase()} shows ${Math.random() > 0.5 ? 'positive' : 'negative'} momentum. The stock is currently ${Math.random() > 0.5 ? 'above' : 'below'} key moving averages with ${Math.random() > 0.5 ? 'strong' : 'weak'} volume support.`,
        risk_level: riskTolerance as 'low' | 'medium' | 'high',
        target_price: 150 + Math.random() * 50,
        stop_loss: 120 + Math.random() * 30,
        time_horizon,
        factors_considered: [
          'Moving Averages',
          'RSI (Relative Strength Index)',
          'MACD',
          'Volume Analysis',
          'P/E Ratio',
          'P/B Ratio',
          'Dividend Yield'
        ],
        created_at: new Date().toISOString()
      };

      setStrategy(mockStrategy);
    } catch (error) {
      console.error('Strategy generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'sell':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      case 'hold':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return <TrendingUpIcon className="w-5 h-5" />;
      case 'sell':
        return <TrendingDownIcon className="w-5 h-5" />;
      case 'hold':
        return <MinusIcon className="w-5 h-5" />;
      default:
        return <MinusIcon className="w-5 h-5" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-success-600 bg-success-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      case 'high':
        return 'text-danger-600 bg-danger-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investment Strategy</h1>
        <p className="mt-2 text-gray-600">
          Get AI-powered buy/sell recommendations based on technical and fundamental analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Strategy Configuration */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Strategy Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, TSLA, MSFT"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (Optional)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="e.g., 10000"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Tolerance
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Horizon
                </label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                  <option value="1y">1 Year</option>
                  <option value="5y">5 Years</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Analysis Types
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeTechnical}
                      onChange={(e) => setIncludeTechnical(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Technical Analysis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeFundamental}
                      onChange={(e) => setIncludeFundamental(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Fundamental Analysis</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleGenerateStrategy}
                disabled={!symbol.trim() || isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating Strategy...' : 'Generate Strategy'}
              </button>
            </div>
          </div>
        </div>

        {/* Strategy Results */}
        <div className="lg:col-span-2 space-y-6">
          {strategy ? (
            <>
              {/* Recommendation Card */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Investment Recommendation for {strategy.symbol}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Generated {new Date(strategy.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${getRecommendationColor(strategy.recommendation)}`}>
                  <div className="flex items-center space-x-3">
                    {getRecommendationIcon(strategy.recommendation)}
                    <div>
                      <h3 className="text-lg font-semibold capitalize">
                        {strategy.recommendation.toUpperCase()} Recommendation
                      </h3>
                      <p className="text-sm">
                        Confidence: {(strategy.confidence_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(strategy.risk_level)}`}>
                      {strategy.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Time Horizon</p>
                    <p className="text-lg font-semibold text-gray-900">{strategy.time_horizon}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-semibold text-gray-900">{(strategy.confidence_score * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              {/* Price Targets */}
              {(strategy.target_price || strategy.stop_loss) && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Targets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategy.target_price && (
                      <div className="p-4 bg-success-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUpIcon className="w-5 h-5 text-success-600" />
                          <div>
                            <p className="text-sm text-success-600">Target Price</p>
                            <p className="text-lg font-semibold text-success-900">${strategy.target_price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {strategy.stop_loss && (
                      <div className="p-4 bg-danger-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingDownIcon className="w-5 h-5 text-danger-600" />
                          <div>
                            <p className="text-sm text-danger-600">Stop Loss</p>
                            <p className="text-lg font-semibold text-danger-900">${strategy.stop_loss.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Reasoning</h3>
                <p className="text-gray-700 leading-relaxed">{strategy.reasoning}</p>
              </div>

              {/* Factors Considered */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {strategy.factors_considered.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <CheckCircleIcon className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No strategy generated</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a symbol and generate a strategy to see recommendations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentStrategy; 