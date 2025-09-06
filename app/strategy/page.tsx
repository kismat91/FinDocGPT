"use client";

import { useState } from "react";
import Link from "next/link";

interface StrategyResult {
  success: boolean;
  strategyType: string;
  riskLevel: string;
  investmentAmount: number;
  allocation?: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives?: number;
  };
  recommendations?: string[];
  expectedReturn?: string;
  riskTolerance?: string;
  timeHorizon?: string;
  diversification?: {
    geographic: string;
    sector: string;
    assetClass: string;
  };
  rebalancing?: string;
  monitoring?: string;
  riskFactors?: string[];
  taxConsiderations?: string[];
  riskProfile?: string;
  investmentGoals?: string;
  timestamp?: string;
}

export default function StrategyPage() {
  const [formData, setFormData] = useState({
    riskProfile: 'Moderate',
    investmentGoals: 'Wealth Building',
    timeHorizon: '10+ years',
    currentPortfolio: 'Starting fresh',
    targetAmount: '100000',
    monthlyContribution: '500'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const riskProfiles = [
    { value: 'Conservative', label: 'Conservative', description: 'Low risk, stable returns' },
    { value: 'Moderate', label: 'Moderate', description: 'Balanced risk and growth' },
    { value: 'Aggressive', label: 'Aggressive', description: 'Higher risk, higher potential returns' }
  ];

  const investmentGoals = [
    { value: 'Retirement', label: 'Retirement Planning', description: 'Long-term retirement savings' },
    { value: 'Wealth Building', label: 'Wealth Building', description: 'Grow wealth over time' },
    { value: 'Income Generation', label: 'Income Generation', description: 'Generate regular income' },
    { value: 'Tax Optimization', label: 'Tax Optimization', description: 'Minimize tax burden' },
    { value: 'Education Funding', label: 'Education Funding', description: 'Save for education expenses' }
  ];

  const timeHorizons = [
    { value: '1-3 years', label: '1-3 years', description: 'Short-term goals' },
    { value: '3-7 years', label: '3-7 years', description: 'Medium-term planning' },
    { value: '7-15 years', label: '7-15 years', description: 'Long-term growth' },
    { value: '15+ years', label: '15+ years', description: 'Very long-term planning' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setStrategyResult(null);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setStrategyResult(result);
      } else {
        setError(result.error || 'Failed to generate strategy');
      }
    } catch (error) {
      setError('Failed to generate investment strategy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      riskProfile: 'Moderate',
      investmentGoals: 'Wealth Building',
      timeHorizon: '10+ years',
      currentPortfolio: 'Starting fresh',
      targetAmount: '100000',
      monthlyContribution: '500'
    });
    setStrategyResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
              <Link href="/forecasting" className="text-white/80 hover:text-white transition-colors">Forecasting</Link>
              <Link href="/strategy" className="text-white font-semibold">Strategy</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎯 Investment Strategy</h1>
          <p className="text-xl text-white/80">AI-powered portfolio optimization and personalized recommendations</p>
        </div>

        {/* Strategy Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Investment Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Risk Profile */}
            <div>
              <label className="block text-white font-medium mb-3">Risk Profile:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {riskProfiles.map((profile) => (
                  <label key={profile.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="riskProfile"
                      value={profile.value}
                      checked={formData.riskProfile === profile.value}
                      onChange={(e) => handleInputChange('riskProfile', e.target.value)}
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <div className="text-white font-medium">{profile.label}</div>
                      <div className="text-white/60 text-xs">{profile.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Investment Goals */}
            <div>
              <label className="block text-white font-medium mb-3">Investment Goals:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {investmentGoals.map((goal) => (
                  <label key={goal.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="investmentGoals"
                      value={goal.value}
                      checked={formData.investmentGoals === goal.value}
                      onChange={(e) => handleInputChange('investmentGoals', e.target.value)}
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <div className="text-white font-medium">{goal.label}</div>
                      <div className="text-white/60 text-xs">{goal.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-white font-medium mb-3">Time Horizon:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {timeHorizons.map((horizon) => (
                  <label key={horizon.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="timeHorizon"
                      value={horizon.value}
                      checked={formData.timeHorizon === horizon.value}
                      onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <div>
                      <div className="text-white font-medium">{horizon.label}</div>
                      <div className="text-white/60 text-xs">{horizon.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Current Portfolio Status:</label>
                <select
                  value={formData.currentPortfolio}
                  onChange={(e) => handleInputChange('currentPortfolio', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Starting fresh">Starting fresh</option>
                  <option value="Small portfolio (<$10k)">Small portfolio (&lt;$10k)</option>
                  <option value="Medium portfolio ($10k-$100k)">Medium portfolio ($10k-$100k)</option>
                  <option value="Large portfolio ($100k+)">Large portfolio ($100k+)</option>
                  <option value="Experienced investor">Experienced investor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Target Amount ($):</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                  placeholder="100000"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Monthly Contribution ($):</label>
              <input
                type="number"
                value={formData.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                placeholder="500"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner inline-block mr-2"></div>
                    Generating Strategy...
                  </>
                  ) : (
                  'Generate AI Strategy'
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Strategy Results */}
        {strategyResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">AI-Generated Investment Strategy</h2>
            
            {/* Strategy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">Strategy Type</h3>
                <p className="text-white/70 text-sm">{strategyResult.strategyType}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">Risk Level</h3>
                <p className="text-white/70 text-sm">{strategyResult.riskLevel}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">Expected Return</h3>
                <p className="text-white/70 text-sm">{strategyResult.expectedReturn || 'N/A'}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h3 className="text-white font-semibold mb-2">Investment Amount</h3>
                <p className="text-white/70 text-sm">${strategyResult.investmentAmount?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>

            {/* Asset Allocation */}
            {strategyResult.allocation && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">📊 Asset Allocation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{strategyResult.allocation.stocks}%</div>
                    <div className="text-white/70 text-sm">Stocks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{strategyResult.allocation.bonds}%</div>
                    <div className="text-white/70 text-sm">Bonds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{strategyResult.allocation.cash}%</div>
                    <div className="text-white/70 text-sm">Cash</div>
                  </div>
                  {strategyResult.allocation.alternatives && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{strategyResult.allocation.alternatives}%</div>
                      <div className="text-white/70 text-sm">Alternatives</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Diversification Strategy */}
            {strategyResult.diversification && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">🌍 Diversification Strategy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Geographic</h4>
                    <p className="text-white/70 text-sm">{strategyResult.diversification.geographic}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Sector Focus</h4>
                    <p className="text-white/70 text-sm">{strategyResult.diversification.sector}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Asset Classes</h4>
                    <p className="text-white/70 text-sm">{strategyResult.diversification.assetClass}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Recommendations */}
            {strategyResult.recommendations && strategyResult.recommendations.length > 0 && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">💡 Investment Recommendations</h3>
                <ul className="space-y-2">
                  {strategyResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-pink-400 mt-1">•</span>
                      <span className="text-white/90 text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {strategyResult.riskFactors && strategyResult.riskFactors.length > 0 && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">⚠️ Risk Factors to Monitor</h3>
                <ul className="space-y-2">
                  {strategyResult.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span className="text-white/90 text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tax Considerations */}
            {strategyResult.taxConsiderations && strategyResult.taxConsiderations.length > 0 && (
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4">💰 Tax Considerations</h3>
                <ul className="space-y-2">
                  {strategyResult.taxConsiderations.map((tax, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-green-400 mt-1">•</span>
                      <span className="text-white/90 text-sm">{tax}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Portfolio Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {strategyResult.rebalancing && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">🔄 Rebalancing</h3>
                  <p className="text-white/70 text-sm">{strategyResult.rebalancing}</p>
                </div>
              )}
              
              {strategyResult.monitoring && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">📈 Monitoring</h3>
                  <p className="text-white/70 text-sm">{strategyResult.monitoring}</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Generate New Strategy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
