"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Newspaper, Brain, BarChart3, DollarSign, Bitcoin, ArrowRight, ChevronRight, Sparkles, Zap, LineChart, Globe, Play, Shield, Target, Users, Rocket, Star, Zap as Lightning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface MarketAsset {
  symbol: string;
  name: string;
  exchange: string;
  status: string;
}

interface CurrencyPair {
  symbol: string;
  name: string;
  exchange: string;
  status: string;
  base_currency?: string;
  quote_currency?: string;
}

interface DigitalAsset {
  symbol: string;
  currency_base: string;
  currency_quote: string;
  available_exchanges: string[];
}

const FeatureCard = ({ icon: Icon, title, description, link, delay, gradient }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group cursor-pointer"
  >
    <Link href={link}>
      <div className={`relative overflow-hidden rounded-3xl p-8 h-full ${gradient} shadow-modern hover:shadow-glow transition-all duration-500`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-white/90 text-lg leading-relaxed mb-6">{description}</p>
          <div className="flex items-center text-white/90 group-hover:text-white transition-colors duration-300">
            <span className="font-semibold">Explore Now</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const StatCard = ({ value, label, icon: Icon, gradient }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className={`${gradient} rounded-3xl p-8 shadow-modern hover:shadow-glow transition-all duration-300`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-4xl font-bold text-white">{value}+</span>
    </div>
    <p className="text-white/90 text-lg font-medium">{label}</p>
  </motion.div>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>

    <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Rocket className="h-5 w-5 text-purple-300 mr-3" />
          <span className="text-purple-300 font-medium">Next-Gen Trading Intelligence</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="gradient-text">Revolutionary</span>
          <br />
          <span className="text-white">Trading Platform</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
          Experience the future of trading with AI-powered insights, real-time data, and intelligent 
          market predictions that transform how you make investment decisions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/choose-advisor">
            <Button className="btn-modern text-lg px-8 py-4 h-auto">
              <Lightning className="mr-3 h-5 w-5" />
              Start Trading
            </Button>
          </Link>
          <Link href="/choose-market">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
              Explore Markets
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Floating Elements */}
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
    />
    <motion.div
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl"
    />
  </section>
);

const FeaturesSection = () => (
  <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <Target className="h-5 w-5 text-purple-300 mr-3" />
          <span className="text-purple-300 font-medium">Advanced Trading Features</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Everything You Need to
          <br />
          <span className="gradient-text">Succeed</span>
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          From real-time market data to AI-powered insights, we provide the tools and intelligence 
          you need to make informed trading decisions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={BarChart3}
          title="Real-Time Market Data"
          description="Access live market data from global exchanges with millisecond precision and comprehensive analytics."
          link="/stocks"
          delay={0.1}
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
        />
        <FeatureCard
          icon={DollarSign}
          title="Forex Trading"
          description="Advanced forex analysis with real-time rates, technical indicators, and market sentiment."
          link="/forexs"
          delay={0.2}
          gradient="bg-gradient-to-br from-green-600 to-green-800"
        />
        <FeatureCard
          icon={Bitcoin}
          title="Crypto Trading"
          description="Comprehensive cryptocurrency analysis with market trends, exchange data, and portfolio tracking."
          link="/cryptos"
          delay={0.3}
          gradient="bg-gradient-to-br from-orange-600 to-orange-800"
        />
        <FeatureCard
          icon={Brain}
          title="AI Trading Assistant"
          description="Intelligent market analysis powered by advanced machine learning and natural language processing."
          link="/choose-advisor"
          delay={0.4}
          gradient="bg-gradient-to-br from-purple-600 to-purple-800"
        />
        <FeatureCard
          icon={Newspaper}
          title="Market Intelligence"
          description="Stay ahead with real-time financial news, market analysis, and expert insights from around the world."
          link="/news"
          delay={0.5}
          gradient="bg-gradient-to-br from-pink-600 to-pink-800"
        />
        <FeatureCard
          icon={Shield}
          title="Risk Management"
          description="Advanced risk assessment tools and portfolio optimization strategies for informed decision-making."
          link="/choose-market"
          delay={0.6}
          gradient="bg-gradient-to-br from-indigo-600 to-indigo-800"
        />
        <FeatureCard
          icon={Brain}
          title="Document Intelligence"
          description="AI-powered analysis of financial documents, earnings reports, and filings with instant insights."
          link="/document-analysis"
          delay={0.7}
          gradient="bg-gradient-to-br from-purple-600 to-purple-800"
        />
        <FeatureCard
          icon={TrendingUp}
          title="Financial Forecasting"
          description="ML-powered earnings predictions, price targets, and market trend analysis with confidence scores."
          link="/forecasting"
          delay={0.8}
          gradient="bg-gradient-to-br from-pink-600 to-pink-800"
        />
        <FeatureCard
          icon={Target}
          title="Investment Strategy"
          description="AI-powered portfolio optimization, risk assessment, and personalized investment recommendations."
          link="/strategy"
          delay={0.9}
          gradient="bg-gradient-to-br from-indigo-600 to-indigo-800"
        />
      </div>
    </div>
  </section>
);

const StatsSection = ({ stocks, forexPairs, cryptoPairs }: any) => (
  <section className="py-24 px-6 bg-gradient-to-b from-slate-800 to-slate-900">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Trusted by
          <span className="gradient-text"> Millions</span>
        </h2>
        <p className="text-xl text-white/70">
          Join a growing community of traders and investors who trust our platform
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          value={stocks.length || 0}
          label="Global Assets"
          icon={LineChart}
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
        />
        <StatCard
          value={forexPairs.length || 0}
          label="Currency Pairs"
          icon={Globe}
          gradient="bg-gradient-to-br from-green-600 to-green-800"
        />
        <StatCard
          value={cryptoPairs.length || 0}
          label="Digital Assets"
          icon={Bitcoin}
          gradient="bg-gradient-to-br from-orange-600 to-orange-800"
        />
      </div>
    </div>
  </section>
);

const CTA_Section = () => (
  <section className="py-24 px-6 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
          Ready to Transform Your
          <br />
          <span className="gradient-text-alt">Trading Strategy?</span>
        </h2>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Join millions of traders who are already using our platform to make smarter, 
          data-driven trading decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/choose-advisor">
            <Button className="btn-modern text-lg px-10 py-5 h-auto">
              <Zap className="mr-3 h-5 w-5" />
              Start Trading Free
            </Button>
          </Link>
          <Link href="/choose-market">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-5 h-auto backdrop-blur-sm">
              Explore Markets
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function TradingPlatform() {
  const [stocks, setStocks] = useState<MarketAsset[]>([]);
  const [forexPairs, setForexPairs] = useState<CurrencyPair[]>([]);
  const [cryptoPairs, setCryptoPairs] = useState<DigitalAsset[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarketData();
    fetchForexData();
    fetchCryptoData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch("/api/stocks");
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch market data",
        variant: "destructive",
      });
    }
  };

  const fetchForexData = async () => {
    try {
      const response = await fetch("/api/forexs?page=1&perPage=1000");
      const data = await response.json();
      setForexPairs(data.pairs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch forex data",
        variant: "destructive",
      });
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch("/api/cryptos");
      const data = await response.json();
      setCryptoPairs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch crypto data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">TradePro</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/choose-market">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">Markets</Button>
              </Link>
              <Link href="/choose-advisor">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">AI Assistant</Button>
              </Link>
              <Link href="/document-analysis">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">Document Analysis</Button>
              </Link>
              <Link href="/forecasting">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">Forecasting</Button>
              </Link>
              <Link href="/strategy">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">Strategy</Button>
              </Link>
              <Link href="/news">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">News</Button>
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/choose-market">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        <HeroSection />
        <FeaturesSection />
        <StatsSection stocks={stocks} forexPairs={forexPairs} cryptoPairs={cryptoPairs} />
        <CTA_Section />
      </main>
    </div>
  );
}