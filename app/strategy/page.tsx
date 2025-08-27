"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  BarChart3, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Rocket,
  Sparkles,
  Zap,
  Globe,
  Star,
  Shield,
  DollarSign,
  PieChart,
  Activity,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Heart
} from "lucide-react";
import Link from "next/link";

interface StrategyProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  investmentAmount: number;
  goals: string[];
  preferences: string[];
}

interface StrategyResult {
  profile: StrategyProfile;
  portfolio: {
    asset: string;
    allocation: number;
    risk: 'low' | 'medium' | 'high';
    expectedReturn: number;
    description: string;
  }[];
  recommendations: {
    action: string;
    confidence: number;
    reasoning: string;
    timeline: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  riskMetrics: {
    totalRisk: number;
    expectedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  insights: string[];
}

export default function InvestmentStrategy() {
  const [profile, setProfile] = useState<StrategyProfile>({
    riskTolerance: 'moderate',
    investmentHorizon: 'medium',
    investmentAmount: 100000,
    goals: ['Growth', 'Income', 'Capital Preservation'],
    preferences: ['ESG Focus', 'Technology', 'Global Diversification']
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'strategy' | 'portfolio' | 'insights'>('profile');
  const { toast } = useToast();

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to strategy engine
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result: StrategyResult = {
        profile,
        portfolio: [
          {
            asset: "US Large Cap Stocks",
            allocation: 35,
            risk: 'medium',
            expectedReturn: 8.5,
            description: "Core growth component with established companies"
          },
          {
            asset: "International Developed Markets",
            allocation: 20,
            risk: 'medium',
            expectedReturn: 7.2,
            description: "Geographic diversification and growth opportunities"
          },
          {
            asset: "Emerging Markets",
            allocation: 15,
            risk: 'high',
            expectedReturn: 10.5,
            description: "High growth potential in developing economies"
          },
          {
            asset: "Fixed Income",
            allocation: 20,
            risk: 'low',
            expectedReturn: 4.2,
            description: "Stability and income generation"
          },
          {
            asset: "Alternative Investments",
            allocation: 10,
            risk: 'high',
            expectedReturn: 12.0,
            description: "Real estate, commodities, and hedge funds"
          }
        ],
        recommendations: [
          {
            action: "Rebalance Portfolio",
            confidence: 92,
            reasoning: "Current allocation deviates from target by 8%",
            timeline: "Within 30 days",
            priority: 'high'
          },
          {
            action: "Increase International Exposure",
            confidence: 78,
            reasoning: "Underweight in international markets for diversification",
            timeline: "Next quarter",
            priority: 'medium'
          },
          {
            action: "Consider ESG Funds",
            confidence: 85,
            reasoning: "Aligns with stated preferences and growing market trend",
            timeline: "Next 6 months",
            priority: 'medium'
          }
        ],
        riskMetrics: {
          totalRisk: 65,
          expectedReturn: 8.7,
          sharpeRatio: 1.2,
          maxDrawdown: 18
        },
        insights: [
          "Portfolio shows good diversification across asset classes and geographies",
          "Risk-adjusted returns are above market average with current allocation",
          "Consider increasing fixed income allocation as retirement approaches",
          "Technology sector exposure aligns well with stated preferences"
        ]
      };

      setStrategyResult(result);
      setActiveTab('strategy');
      
      toast({
        title: "Strategy generated!",
        description: "AI-powered investment strategy ready for review",
      });
    } catch (error) {
      toast({
        title: "Strategy generation failed",
        description: "Error creating strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskToleranceColor = (tolerance: string) => {
    switch (tolerance) {
      case 'conservative': return 'bg-green-600';
      case 'moderate': return 'bg-yellow-600';
      case 'aggressive': return 'bg-red-600';
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
                <Target className="h-6 w-6 text-white" />
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
                <span className="text-purple-300 font-medium">AI-Powered Investment Strategy</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Personalized
                <br />
                <span className="gradient-text">Investment Strategy</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Get a customized investment strategy based on your risk tolerance, goals, and preferences 
                using advanced AI algorithms and portfolio optimization techniques.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex space-x-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                {[
                  { id: 'profile', label: 'Investment Profile', icon: Users },
                  { id: 'strategy', label: 'AI Strategy', icon: Brain },
                  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
                  { id: 'insights', label: 'Insights', icon: Target }
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
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Investment Profile</h3>
                      <p className="text-white/70">Tell us about your investment preferences and goals</p>
                    </div>

                    <div className="space-y-6">
                      {/* Risk Tolerance */}
                      <div>
                        <label className="block text-white font-semibold mb-3">Risk Tolerance</label>
                        <div className="grid grid-cols-3 gap-4">
                          {['conservative', 'moderate', 'aggressive'].map((tolerance) => (
                            <button
                              key={tolerance}
                              onClick={() => setProfile(prev => ({ ...prev, riskTolerance: tolerance as any }))}
                              className={`p-4 rounded-xl border transition-all duration-300 ${
                                profile.riskTolerance === tolerance
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full ${getRiskToleranceColor(tolerance)} mx-auto mb-2`}></div>
                              <div className="text-white font-medium capitalize">{tolerance}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Investment Horizon */}
                      <div>
                        <label className="block text-white font-semibold mb-3">Investment Horizon</label>
                        <div className="grid grid-cols-3 gap-4">
                          {['short', 'medium', 'long'].map((horizon) => (
                            <button
                              key={horizon}
                              onClick={() => setProfile(prev => ({ ...prev, investmentHorizon: horizon as any }))}
                              className={`p-4 rounded-xl border transition-all duration-300 ${
                                profile.investmentHorizon === horizon
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="text-white font-medium capitalize">{horizon}</div>
                              <div className="text-white/60 text-sm">
                                {horizon === 'short' ? '1-3 years' : horizon === 'medium' ? '3-10 years' : '10+ years'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Investment Amount */}
                      <div>
                        <label className="block text-white font-semibold mb-3">Investment Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                          <Input
                            type="number"
                            value={profile.investmentAmount}
                            onChange={(e) => setProfile(prev => ({ ...prev, investmentAmount: Number(e.target.value) }))}
                            className="pl-12 text-lg py-4 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 backdrop-blur-sm"
                            placeholder="100000"
                          />
                        </div>
                      </div>

                      {/* Investment Goals */}
                      <div>
                        <label className="block text-white font-semibold mb-3">Investment Goals</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {['Growth', 'Income', 'Capital Preservation', 'Tax Efficiency', 'ESG Focus', 'Global Diversification'].map((goal) => (
                            <button
                              key={goal}
                              onClick={() => {
                                const newGoals = profile.goals.includes(goal)
                                  ? profile.goals.filter(g => g !== goal)
                                  : [...profile.goals, goal];
                                setProfile(prev => ({ ...prev, goals: newGoals }));
                              }}
                              className={`p-3 rounded-xl border transition-all duration-300 ${
                                profile.goals.includes(goal)
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="text-white font-medium text-sm">{goal}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerateStrategy}
                        disabled={isGenerating}
                        className="w-full btn-modern text-lg py-4 h-auto"
                      >
                        {isGenerating ? (
                          <>
                            <div className="spinner-modern mr-3"></div>
                            Generating AI Strategy...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-5 w-5" />
                            Generate Investment Strategy
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'strategy' && strategyResult && (
                <motion.div
                  key="strategy"
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
                      <h3 className="text-2xl font-bold text-white mb-2">AI Investment Strategy</h3>
                      <p className="text-white/70">Personalized strategy based on your profile and market conditions</p>
                    </div>

                    {/* Risk Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{strategyResult.riskMetrics.totalRisk}/100</div>
                        <div className="text-white/70 text-sm">Total Risk Score</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{strategyResult.riskMetrics.expectedReturn}%</div>
                        <div className="text-white/70 text-sm">Expected Return</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{strategyResult.riskMetrics.sharpeRatio}</div>
                        <div className="text-white/70 text-sm">Sharpe Ratio</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{strategyResult.riskMetrics.maxDrawdown}%</div>
                        <div className="text-white/70 text-sm">Max Drawdown</div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-white mb-6 text-center">AI Recommendations</h4>
                      <div className="space-y-4">
                        {strategyResult.recommendations.map((rec, index) => (
                          <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`inline-block px-3 py-1 rounded-full ${getPriorityColor(rec.priority)} text-white text-xs font-semibold`}>
                                  {rec.priority.toUpperCase()}
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold`}>
                                  {rec.confidence}% Confidence
                                </div>
                              </div>
                              <div className="text-white/60 text-sm">{rec.timeline}</div>
                            </div>
                            <h5 className="text-white font-semibold mb-2">{rec.action}</h5>
                            <p className="text-white/80 text-sm">{rec.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'portfolio' && strategyResult && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                        <PieChart className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Portfolio Allocation</h3>
                      <p className="text-white/70">Optimized asset allocation based on your risk profile</p>
                    </div>

                    <div className="space-y-4">
                      {strategyResult.portfolio.map((asset, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h5 className="text-white font-semibold">{asset.asset}</h5>
                                <p className="text-white/60 text-sm">{asset.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{asset.allocation}%</div>
                              <div className={`text-sm font-medium ${getRiskColor(asset.risk)} capitalize`}>
                                {asset.risk} Risk
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-white/70 text-sm">Expected Return: <span className="text-green-400 font-semibold">{asset.expectedReturn}%</span></div>
                            <div className="w-32 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${asset.allocation}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'insights' && strategyResult && (
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
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Strategy Insights</h3>
                      <p className="text-white/70">Key insights and analysis from our AI strategy engine</p>
                    </div>

                    <div className="space-y-4">
                      {strategyResult.insights.map((insight, index) => (
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
                        onClick={() => setActiveTab('profile')}
                        className="btn-modern text-lg px-8 py-4 h-auto"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Create New Strategy
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
