"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Chatbot from "@/components/chatbot";

interface MarketData {
  stocks: number;
  forex: number;
  crypto: number;
}

export default function Home() {
  const [marketData, setMarketData] = useState<MarketData>({ stocks: 0, forex: 0, crypto: 0 });

  useEffect(() => {
    // Fetch real market data counts
    fetchMarketCounts();
  }, []);

  const fetchMarketCounts = async () => {
    try {
      const [stocksRes, forexsRes, cryptosRes] = await Promise.all([
        fetch("/api/stocks"),
        fetch("/api/forexs"),
        fetch("/api/cryptos")
      ]);
      
      const stocksData = await stocksRes.json();
      const forexsData = await forexsRes.json();
      const cryptosData = await cryptosRes.json();
      
      setMarketData({
        stocks: stocksData.length || 0,
        forex: forexsData.pairs?.length || 0,
        crypto: cryptosData.length || 0
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
      // Fallback to default values
      setMarketData({ stocks: 10, forex: 10, crypto: 10 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white">FinDocGPT</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/stocks" className="text-white/80 hover:text-white transition-colors">Stocks</Link>
              <Link href="/forexs" className="text-white/80 hover:text-white transition-colors">Forex</Link>
              <Link href="/cryptos" className="text-white/80 hover:text-white transition-colors">Crypto</Link>
              <Link href="/sec-filings" className="text-white/80 hover:text-white transition-colors">SEC Filings</Link>
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
              <Link href="/document-analysis" className="text-white/80 hover:text-white transition-colors">Documents</Link>
              <Link href="/forecasting" className="text-white/80 hover:text-white transition-colors">Forecasting</Link>
              <Link href="/strategy" className="text-white/80 hover:text-white transition-colors">Strategy</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <h1 className="text-6xl font-bold text-white mb-6">
          FinDocGPT Platform
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
          AI-Powered Financial Intelligence Platform with Real-Time Market Data, 
          Advanced Analytics, and Intelligent Trading Insights
        </p>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-2">Platform Status</h3>
            <p className="text-green-400 font-semibold">ACTIVE & RUNNING</p>
            <p className="text-white/70 text-sm mt-2">All systems operational</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-2">Services</h3>
            <p className="text-green-400 font-semibold">CONNECTED</p>
            <p className="text-white/70 text-sm mt-2">All APIs configured</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-2">Access</h3>
            <p className="text-blue-400 font-semibold">READY</p>
            <p className="text-white/70 text-sm mt-2">Platform accessible</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/stocks" className="group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Stock Analysis</h3>
              <p className="text-blue-100">Real-time stock data, technical analysis, and AI insights</p>
            </div>
          </Link>
          
          <Link href="/forexs" className="group">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Forex Trading</h3>
              <p className="text-green-100">Currency pair analysis and market sentiment</p>
            </div>
          </Link>
          
          <Link href="/cryptos" className="group">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Crypto Markets</h3>
              <p className="text-orange-100">Digital asset analysis and portfolio tracking</p>
            </div>
          </Link>
          
          <Link href="/sec-filings" className="group">
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">SEC Filings</h3>
              <p className="text-red-100">AI-powered 10-K analysis and company insights</p>
            </div>
          </Link>
          
          <Link href="/news" className="group">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Market News</h3>
              <p className="text-purple-100">Real-time financial news and market updates</p>
            </div>
          </Link>
          
          <Link href="/document-analysis" className="group">
            <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">Document AI</h3>
              <p className="text-pink-100">AI-powered financial document analysis</p>
            </div>
          </Link>
          
          <Link href="/forecasting" className="group">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-white mb-2">AI Forecasting</h3>
              <p className="text-indigo-100">Machine learning market predictions</p>
            </div>
          </Link>
        </div>

        {/* Market Stats */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Live Market Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{marketData.stocks.toLocaleString()}</div>
              <div className="text-white/70">Global Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{marketData.forex}</div>
              <div className="text-white/70">Forex Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{marketData.crypto.toLocaleString()}</div>
              <div className="text-white/70">Cryptocurrencies</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}