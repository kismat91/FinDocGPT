import React, { useState } from 'react';
import { 
  HeartIcon, 
  FaceSmileIcon,
  FaceFrownIcon,
  FaceNeutralIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Sentiment {
  overall_sentiment: string;
  sentiment_score: number;
  confidence: number;
  key_phrases: string[];
  sentiment_trend: string;
  risk_factors: string[];
  positive_factors: string[];
  negative_factors: string[];
}

const SentimentAnalysis: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeSentiment = async () => {
    if (!symbol.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockSentiment: Sentiment = {
        overall_sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        sentiment_score: (Math.random() - 0.5) * 2, // -1 to 1
        confidence: 0.7 + Math.random() * 0.3,
        key_phrases: [
          'revenue growth',
          'market expansion',
          'innovation',
          'competitive advantage',
          'financial performance'
        ],
        sentiment_trend: Math.random() > 0.5 ? 'improving' : 'declining',
        risk_factors: [
          'Market volatility concerns',
          'Regulatory changes',
          'Competition pressure'
        ],
        positive_factors: [
          'Strong quarterly results',
          'New product launches',
          'Market share growth'
        ],
        negative_factors: [
          'Supply chain issues',
          'Economic uncertainty',
          'Cost pressures'
        ]
      };

      setSentiment(mockSentiment);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'negative':
        return 'text-danger-600 bg-danger-50 border-danger-200';
      case 'neutral':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <FaceSmileIcon className="w-6 h-6" />;
      case 'negative':
        return <FaceFrownIcon className="w-6 h-6" />;
      case 'neutral':
        return <FaceNeutralIcon className="w-6 h-6" />;
      default:
        return <FaceNeutralIcon className="w-6 h-6" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUpIcon className="w-5 h-5 text-success-600" />;
      case 'declining':
        return <TrendingDownIcon className="w-5 h-5 text-danger-600" />;
      case 'stable':
        return <MinusIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <MinusIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const chartData = sentiment ? [
    { name: 'Positive', value: sentiment.positive_factors.length, color: '#22c55e' },
    { name: 'Negative', value: sentiment.negative_factors.length, color: '#ef4444' },
    { name: 'Neutral', value: Math.max(0, 5 - sentiment.positive_factors.length - sentiment.negative_factors.length), color: '#f59e0b' }
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sentiment Analysis</h1>
        <p className="mt-2 text-gray-600">
          Analyze market sentiment and emotional indicators for financial instruments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analysis Configuration */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol or Market
                </label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, TSLA, or 'Tech Sector'"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleAnalyzeSentiment}
                disabled={!symbol.trim() || isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
              </button>
            </div>
          </div>
        </div>

        {/* Sentiment Results */}
        <div className="lg:col-span-2 space-y-6">
          {sentiment ? (
            <>
              {/* Overall Sentiment */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sentiment Analysis for {symbol}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <HeartIcon className="w-4 h-4" />
                    <span>Real-time analysis</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${getSentimentColor(sentiment.overall_sentiment)}`}>
                  <div className="flex items-center space-x-3">
                    {getSentimentIcon(sentiment.overall_sentiment)}
                    <div>
                      <h3 className="text-lg font-semibold capitalize">
                        {sentiment.overall_sentiment} Sentiment
                      </h3>
                      <p className="text-sm">
                        Confidence: {(sentiment.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Sentiment Score</p>
                    <p className={`text-lg font-semibold ${
                      sentiment.sentiment_score > 0.2 ? 'text-success-600' :
                      sentiment.sentiment_score < -0.2 ? 'text-danger-600' : 'text-warning-600'
                    }`}>
                      {(sentiment.sentiment_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Trend</p>
                    <div className="flex items-center justify-center space-x-1">
                      {getTrendIcon(sentiment.sentiment_trend)}
                      <span className="text-lg font-semibold text-gray-900 capitalize">
                        {sentiment.sentiment_trend}
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(sentiment.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentiment Distribution Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Phrases */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Phrases</h3>
                <div className="flex flex-wrap gap-2">
                  {sentiment.key_phrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Factors Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Positive Factors */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-success-700 mb-3">Positive Factors</h4>
                  <div className="space-y-2">
                    {sentiment.positive_factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negative Factors */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-danger-700 mb-3">Negative Factors</h4>
                  <div className="space-y-2">
                    {sentiment.negative_factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-warning-700 mb-3">Risk Factors</h4>
                  <div className="space-y-2">
                    {sentiment.risk_factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sentiment analysis</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a symbol to analyze market sentiment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis; 