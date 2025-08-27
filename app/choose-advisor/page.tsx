"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, DollarSign, Bitcoin, ArrowRight, ChevronRight, Brain, ArrowLeft, Search, Filter, Sliders, Target, TrendingUp, Shield, Users, Star, Zap, Rocket, Globe, Target as TargetIcon } from "lucide-react";
import Link from "next/link";

// Trading advisor data for the cards
const tradingAdvisors = [
  {
    icon: BarChart3,
    title: "Stock Trading Expert",
    description: "Get expert insights on stocks with real-time data and technical analysis from global exchanges.",
    link: "/stockadvisor",
    color: "blue",
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    features: ["Technical analysis", "Market trends", "Trading strategies", "Risk assessment"],
    expertise: "Stock trading expert with deep knowledge of global exchanges and market dynamics.",
    accuracy: "95%",
    experience: "15+ years",
    specialties: ["US Markets", "Technical Analysis", "Fundamental Analysis"],
    successRate: "87%",
    totalTrades: "10,000+"
  },
  {
    icon: DollarSign,
    title: "Forex Trading Specialist",
    description: "Your guide to forex markets, offering real-time analysis on currency pairs and trading strategies.",
    link: "/forexadvisor",
    color: "green",
    gradient: "from-green-600 via-green-700 to-emerald-800",
    features: ["Currency analysis", "Exchange rate predictions", "Trading strategies", "Market sentiment"],
    expertise: "Forex specialist with expertise in currency markets and international finance.",
    accuracy: "92%",
    experience: "12+ years",
    specialties: ["Major Pairs", "Currency Analysis", "Risk Management"],
    successRate: "84%",
    totalTrades: "8,500+"
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency Trading Analyst",
    description: "Navigate the crypto world with detailed market data and insights on cryptocurrency pairs.",
    link: "/cryptoadvisor",
    color: "orange",
    gradient: "from-orange-600 via-orange-700 to-yellow-700",
    features: ["Crypto analysis", "Blockchain insights", "Trading strategies", "Market trends"],
    expertise: "Cryptocurrency expert with deep understanding of blockchain technology and digital assets.",
    accuracy: "88%",
    experience: "8+ years",
    specialties: ["DeFi", "NFTs", "Blockchain Analysis"],
    successRate: "79%",
    totalTrades: "6,200+"
  },
];

// Trading Advisor Card Component
const TradingAdvisorCard = ({ icon: Icon, title, description, link, gradient, features, accuracy, experience, specialties, successRate, totalTrades, isActive, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className={`relative group cursor-pointer ${isActive ? 'z-10' : 'z-0'}`}
    onClick={onClick}
  >
    <div className={`relative overflow-hidden rounded-3xl h-full ${gradient} shadow-modern hover:shadow-glow transition-all duration-500`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <span className="text-white text-sm font-medium">{accuracy}</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
              {experience}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/90 text-lg leading-relaxed mb-6">{description}</p>
          
          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 rounded-xl bg-white/10">
              <div className="text-2xl font-bold text-white">{successRate}</div>
              <div className="text-white/70 text-xs">Success Rate</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10">
              <div className="text-2xl font-bold text-white">{totalTrades}</div>
              <div className="text-white/70 text-xs">Total Trades</div>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-white/90">
                <div className="w-2 h-2 rounded-full bg-white mr-3 flex-shrink-0"></div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Specialties */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-2">Specialties:</h4>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty: string, index: number) => (
                <span key={index} className="px-2 py-1 rounded-full bg-white/20 text-white text-xs">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center text-white/90 group-hover:text-white transition-colors duration-300">
          <span className="font-semibold">Start Consultation</span>
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </motion.div>
);

// Trading Advisor Detail Component
const TradingAdvisorDetail = ({ advisor, onBack }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4 }}
    className="relative"
  >
    <div className={`absolute -inset-6 ${advisor.gradient} rounded-3xl blur-2xl opacity-30`}></div>
    <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 hover:bg-white/10 text-white/80 hover:text-white"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to advisors
        </Button>
        
        <div className="flex items-center space-x-6">
          <div className={`w-20 h-20 rounded-2xl ${advisor.gradient} flex items-center justify-center shadow-lg`}>
            <advisor.icon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{advisor.title}</h2>
            <p className="text-white/70 text-lg max-w-2xl">{advisor.description}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Metrics */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{advisor.accuracy}</div>
                <div className="text-white/70 text-sm">Prediction accuracy</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{advisor.successRate}</div>
                <div className="text-white/70 text-sm">Trade success rate</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{advisor.totalTrades}</div>
                <div className="text-white/70 text-sm">Total trades executed</div>
              </div>
            </div>
          </div>
          
          {/* Trading Features */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TargetIcon className="h-5 w-5 mr-2 text-blue-400" />
              Trading Capabilities
            </h3>
            <div className="space-y-3">
              {advisor.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-4"></div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expertise & Specialties */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            Expertise & Specialties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white/80 font-medium mb-3">Expertise</h4>
              <p className="text-white/70 text-sm leading-relaxed">{advisor.expertise}</p>
            </div>
            <div>
              <h4 className="text-white/80 font-medium mb-3">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {advisor.specialties.map((specialty: string, index: number) => (
                  <span key={index} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Benefits */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-400" />
            Trading Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <span className="text-white font-medium">Fast Execution</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <span className="text-white font-medium">Global Access</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <span className="text-white font-medium">AI Insights</span>
            </div>
          </div>
        </div>
        
        {/* Action */}
        <div className="text-center">
          <Link href={advisor.link}>
            <Button className={`${advisor.gradient} hover:opacity-90 transition-opacity text-lg px-8 py-4 h-auto rounded-xl shadow-lg`}>
              <span className="flex items-center">
                Start Trading with {advisor.title}
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function TradingAdvisors() {
  const [activeAdvisor, setActiveAdvisor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAdvisors, setFilteredAdvisors] = useState(tradingAdvisors);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tradingAdvisors.filter(advisor => 
        advisor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advisor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advisor.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAdvisors(filtered);
    } else {
      setFilteredAdvisors(tradingAdvisors);
    }
  }, [searchTerm]);

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
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">TradePro</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/news">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  News
                </Button>
              </Link>
              <Link href="/choose-market">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Markets
                </Button>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Brain className="h-5 w-5 text-purple-300 mr-3" />
                <span className="text-purple-300 font-medium">AI-Powered Trading Advisors</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Choose Your
                <br />
                <span className="gradient-text">Trading Advisor</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Get personalized trading insights and strategies from our AI-powered advisors, 
                each specializing in different market segments and analysis approaches.
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search advisors by expertise, specialty, or market..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Advisor Selection or Detail View */}
            <AnimatePresence mode="wait">
              {activeAdvisor === null ? (
                <motion.div
                  key="advisor-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                >
                  {filteredAdvisors.map((advisor, index) => (
                    <TradingAdvisorCard 
                      key={index} 
                      {...advisor} 
                      isActive={false}
                      onClick={() => setActiveAdvisor(index)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="advisor-detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-6xl mx-auto"
                >
                  <TradingAdvisorDetail 
                    advisor={tradingAdvisors[activeAdvisor]} 
                    onBack={() => setActiveAdvisor(null)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-20 px-6 bg-gradient-to-t from-slate-800/50 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Users className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-green-400 font-medium">Why Choose AI Trading Advisors?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Intelligent Insights for
                <br />
                <span className="gradient-text">Smart Trading</span>
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Our AI advisors combine deep market knowledge with real-time data analysis to provide 
                you with actionable trading insights and strategic recommendations.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}