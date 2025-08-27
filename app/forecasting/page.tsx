"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  BarChart3, 
  Brain, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Rocket,
  Sparkles,
  Zap,
  Globe,
  Star,
  LineChart,
  PieChart,
  Activity,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  Shield
} from "lucide-react";
import Link from "next/link";

interface ForecastData {
  period: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface ForecastResult {
  company: string;
  symbol: string;
  forecast: ForecastData[];
  metrics: {
    accuracy: number;
    confidence: number;
    riskScore: number;
    trend: 'up' | 'down' | 'stable';
  };
  recommendations: {
    action: string;
    confidence: number;
    reasoning: string;
    priceTarget: number;
    stopLoss: number;
  }[];
  insights: string[];
}

export default function FinancialForecasting() {
  const [symbol, setSymbol] = useState("");
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [activeTab, setActiveTab] = useState<'forecast' | 'results' | 'insights'>('forecast');
  const { toast } = useToast();

  const handleForecast = async () => {
    if (!symbol.trim()) {
      toast({
        title: "Symbol required",
        description: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }

    setIsForecasting(true);
    try {
      // Simulate API call to forecasting service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result: ForecastResult = {
        company: "Sample Corporation",
        symbol: symbol.toUpperCase(),
        forecast: [
          { period: "Q1 2024", actual: 2.45, predicted: 2.52, confidence: 85 },
          { period: "Q2 2024", actual: 2.67, predicted: 2.71, confidence: 82 },
          { period: "Q3 2024", actual: 2.89, predicted: 2.95, confidence: 79 },
          { period: "Q4 2024", actual: 3.12, predicted: 3.18, confidence: 76 },
          { period: "Q1 2025", actual: null, predicted: 3.45, confidence: 73 },
          { period: "Q2 2025", actual: null, predicted: 3.67, confidence: 70 },
          { period: "Q3 2025", actual: null, predicted: 3.89, confidence: 67 },
          { period: "Q4 2025", actual: null, predicted: 4.12, confidence: 64 }
        ],
        metrics: {
          accuracy: 87,
          confidence: 78,
          riskScore: 32,
          trend: 'up'
        },
        recommendations: [
          {
            action: "BUY",
            confidence: 85,
            reasoning: "Strong earnings growth trajectory with improving fundamentals",
            priceTarget: 185.50,
            stopLoss: 145.20
          },
          {
            action: "HOLD",
            confidence: 72,
            reasoning: "Monitor market conditions and competitive landscape",
            priceTarget: 165.00,
            stopLoss: 155.00
          }
        ],
        insights: [
          "Revenue growth expected to accelerate in Q3-Q4 2024",
          "Operating margins improving due to cost optimization",
          "Market expansion into Asia-Pacific region showing positive results",
          "Technology investments driving operational efficiency gains"
        ]
      };

      setForecastResult(result);
      setActiveTab('results');
      
      toast({
        title: "Forecast complete!",
        description: "AI-powered financial forecasting analysis ready",
      });
    } catch (error) {
      toast({
        title: "Forecast failed",
        description: "Error generating forecast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsForecasting(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-400" />;
      default: return <Activity className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-600';
      case 'SELL': return 'bg-red-600';
      case 'HOLD': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-green-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">TradePro</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/choose-market">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Markets
                </Button>
              </Link>
              <Link href="/choose-advisor">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  AI Assistant
                </Button>
              </Link>
              <Link href="/document-analysis">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Document Analysis
                </Button>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="h-5 w-5 text-purple-300 mr-3" />
                <span className="text-purple-300 font-medium">AI-Powered Financial Forecasting</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Predict Market
                <br />
                <span className="gradient-text">Movements</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Use advanced machine learning models to forecast earnings, predict stock prices, 
                and identify market trends with unprecedented accuracy.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex space-x-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                {[
                  { id: 'forecast', label: 'Generate Forecast', icon: TrendingUp },
                  { id: 'results', label: 'Forecast Results', icon: BarChart3 },
                  { id: 'insights', label: 'AI Insights', icon: Brain }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'forecast' && (
                <motion.div
                  key="forecast"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Generate Financial Forecast</h3>
                      <p className="text-white/70">Enter a stock symbol to get AI-powered earnings and price predictions</p>
                    </div>

                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="relative max-w-md mx-auto">
                          <Input
                            type="text"
                            placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            className="text-center text-lg py-4 px-6 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 backdrop-blur-sm"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Globe className="h-5 w-5 text-white/50" />
                          </div>
                        </div>
                        <p className="text-white/50 text-sm mt-2">Enter a valid stock symbol to begin forecasting</p>
                      </div>

                      <Button
                        onClick={handleForecast}
                        disabled={!symbol.trim() || isForecasting}
                        className="w-full btn-modern text-lg py-4 h-auto"
                      >
                        {isForecasting ? (
                          <>
                            <div className="spinner-modern mr-3"></div>
                            Generating AI Forecast...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-5 w-5" />
                            Generate Forecast
                          </>
                        )}
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-white font-semibold">High Accuracy</div>
                          <div className="text-white/60 text-sm">ML-powered predictions</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-3">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-white font-semibold">Real-time Data</div>
                          <div className="text-white/60 text-sm">Live market updates</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                            <Shield className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-white font-semibold">Risk Assessment</div>
                          <div className="text-white/60 text-sm">Comprehensive analysis</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'results' && forecastResult && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Forecast Results</h3>
                      <p className="text-white/70">{forecastResult.company} ({forecastResult.symbol})</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{forecastResult.metrics.accuracy}%</div>
                        <div className="text-white/70 text-sm">Model Accuracy</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{forecastResult.metrics.confidence}%</div>
                        <div className="text-white/70 text-sm">Forecast Confidence</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className={`text-3xl font-bold mb-2 ${getTrendColor(forecastResult.metrics.trend)}`}>
                          {getTrendIcon(forecastResult.metrics.trend)}
                        </div>
                        <div className="text-white/70 text-sm">Market Trend</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{forecastResult.metrics.riskScore}/100</div>
                        <div className="text-white/70 text-sm">Risk Score</div>
                      </div>
                    </div>

                    {/* Forecast Chart */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-white mb-6 text-center">Earnings Forecast</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {forecastResult.forecast.map((period, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <div className="text-white/70 text-sm mb-2">{period.period}</div>
                            {period.actual !== null ? (
                              <div className="text-white font-semibold">${period.actual}</div>
                            ) : (
                              <div className="text-white/50 text-sm">Actual</div>
                            )}
                            <div className="text-purple-400 font-semibold">${period.predicted}</div>
                            <div className="text-white/60 text-xs">Predicted</div>
                            <div className="text-white/50 text-xs">{period.confidence}% confidence</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-white mb-6 text-center">AI Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {forecastResult.recommendations.map((rec, index) => (
                          <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`inline-block px-4 py-2 rounded-full ${getActionColor(rec.action)} text-white text-sm font-semibold`}>
                                {rec.action}
                              </div>
                              <div className="text-2xl font-bold text-white">{rec.confidence}%</div>
                            </div>
                            <p className="text-white/80 text-sm mb-4">{rec.reasoning}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center">
                                <div className="text-white/60 text-xs">Price Target</div>
                                <div className="text-green-400 font-semibold">${rec.priceTarget}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white/60 text-xs">Stop Loss</div>
                                <div className="text-red-400 font-semibold">${rec.stopLoss}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'insights' && forecastResult && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">AI-Generated Insights</h3>
                      <p className="text-white/70">Key findings and market intelligence from our analysis</p>
                    </div>

                    <div className="space-y-4">
                      {forecastResult.insights.map((insight, index) => (
                        <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-white/90">{insight}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 text-center">
                      <Button
                        onClick={() => setActiveTab('forecast')}
                        className="btn-modern text-lg px-8 py-4 h-auto"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Generate New Forecast
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
