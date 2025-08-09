import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Forecast {
  symbol: string;
  forecast_type: string;
  predictions: Array<{
    date: string;
    predicted_price?: number;
    predicted_earnings?: number;
    predicted_revenue?: number;
    confidence_lower?: number;
    confidence_upper?: number;
  }>;
  confidence_interval: {
    lower: number[];
    upper: number[];
  };
  model_used: string;
  accuracy_metrics: {
    rmse?: number;
    mae?: number;
    r2_score?: number;
  };
  last_updated: string;
}

const Forecasting: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [forecastType, setForecastType] = useState('stock_price');
  const [timeframe, setTimeframe] = useState('30d');
  const [modelType, setModelType] = useState('linear');
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateForecast = async () => {
    if (!symbol.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockForecast: Forecast = {
        symbol: symbol.toUpperCase(),
        forecast_type: forecastType,
        predictions: [
          { date: '2024-01-15', predicted_price: 150.25, confidence_lower: 145.50, confidence_upper: 155.00 },
          { date: '2024-01-16', predicted_price: 152.75, confidence_lower: 147.80, confidence_upper: 157.70 },
          { date: '2024-01-17', predicted_price: 154.30, confidence_lower: 149.20, confidence_upper: 159.40 },
          { date: '2024-01-18', predicted_price: 156.80, confidence_lower: 151.60, confidence_upper: 162.00 },
          { date: '2024-01-19', predicted_price: 158.45, confidence_lower: 153.10, confidence_upper: 163.80 },
        ],
        confidence_interval: {
          lower: [145.50, 147.80, 149.20, 151.60, 153.10],
          upper: [155.00, 157.70, 159.40, 162.00, 163.80]
        },
        model_used: modelType,
        accuracy_metrics: {
          rmse: 2.45,
          mae: 1.89,
          r2_score: 0.87
        },
        last_updated: new Date().toISOString()
      };

      setForecast(mockForecast);
    } catch (error) {
      console.error('Forecast generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = forecast?.predictions.map((pred, index) => ({
    date: pred.date,
    predicted: pred.predicted_price || pred.predicted_earnings || pred.predicted_revenue || 0,
    lower: forecast.confidence_interval.lower[index],
    upper: forecast.confidence_interval.upper[index]
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Forecasting</h1>
        <p className="mt-2 text-gray-600">
          Generate AI-powered forecasts for stock prices, earnings, and revenue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Configuration */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Forecast Settings</h2>
            
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
                  Forecast Type
                </label>
                <select
                  value={forecastType}
                  onChange={(e) => setForecastType(e.target.value)}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="stock_price">Stock Price</option>
                  <option value="earnings">Earnings</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                  <option value="1y">1 Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Type
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="linear">Linear Regression</option>
                  <option value="lstm">LSTM Neural Network</option>
                  <option value="arima">ARIMA</option>
                </select>
              </div>

              <button
                onClick={handleGenerateForecast}
                disabled={!symbol.trim() || isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating Forecast...' : 'Generate Forecast'}
              </button>
            </div>
          </div>
        </div>

        {/* Forecast Results */}
        <div className="lg:col-span-2 space-y-6">
          {forecast ? (
            <>
              {/* Forecast Summary */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Forecast for {forecast.symbol}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Updated {new Date(forecast.last_updated).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Model Used</p>
                    <p className="text-lg font-semibold text-gray-900">{forecast.model_used}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Forecast Type</p>
                    <p className="text-lg font-semibold text-gray-900">{forecast.forecast_type}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Timeframe</p>
                    <p className="text-lg font-semibold text-gray-900">{timeframe}</p>
                  </div>
                </div>

                {/* Accuracy Metrics */}
                {forecast.accuracy_metrics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {forecast.accuracy_metrics.rmse && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">RMSE</p>
                        <p className="text-lg font-semibold text-blue-900">{forecast.accuracy_metrics.rmse.toFixed(2)}</p>
                      </div>
                    )}
                    {forecast.accuracy_metrics.mae && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">MAE</p>
                        <p className="text-lg font-semibold text-green-900">{forecast.accuracy_metrics.mae.toFixed(2)}</p>
                      </div>
                    )}
                    {forecast.accuracy_metrics.r2_score && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">R² Score</p>
                        <p className="text-lg font-semibold text-purple-900">{(forecast.accuracy_metrics.r2_score * 100).toFixed(1)}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Chart</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Predicted"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lower" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        name="Lower Bound"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upper" 
                        stroke="#22c55e" 
                        strokeDasharray="5 5"
                        name="Upper Bound"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Predictions Table */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Predictions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Predicted Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence Interval
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {forecast.predictions.map((pred, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(pred.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${(pred.predicted_price || pred.predicted_earnings || pred.predicted_revenue || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${forecast.confidence_interval.lower[index]?.toFixed(2)} - ${forecast.confidence_interval.upper[index]?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No forecast generated</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter a symbol and generate a forecast to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecasting; 