"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ForexPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function ForexsPage() {
  console.log("🚀 ForexsPage component rendering");
  
  const [forexPairs, setForexPairs] = useState<ForexPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPair, setSelectedPair] = useState<ForexPair | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch data from API on component mount
  useEffect(() => {
    console.log("🔥 useEffect triggered - fetching forex data from API");
    fetchForexData();
  }, []);

  console.log("� Direct State - forexPairs length:", forexPairs.length);
  console.log("� Direct State - loading:", loading);

  const fetchForexData = async () => {
    try {
      console.log("🚀 Starting forex API call...");
      const response = await fetch("/api/forexs");
      console.log("🔍 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🔍 Forex API Response:", data);
      console.log("🔍 Data.pairs:", data.pairs);
      console.log("🔍 Array.isArray(data.pairs):", Array.isArray(data.pairs));
      
      if (data.pairs && Array.isArray(data.pairs)) {
        console.log("✅ Setting forex pairs:", data.pairs.length, "pairs");
        setForexPairs(data.pairs);
      } else {
        console.log("❌ No valid pairs data found");
        setForexPairs([]);
      }
    } catch (error) {
      console.error("❌ Error fetching forex data:", error);
      setForexPairs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPairs = forexPairs.filter(pair =>
    pair.symbol && pair.name && (
      pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  console.log("📊 Forex State Debug:");
  console.log("📊 forexPairs length:", forexPairs.length);
  console.log("📊 filteredPairs length:", filteredPairs.length);
  console.log("📊 searchTerm:", searchTerm);
  console.log("📊 loading:", loading);

  const handleViewDetails = (pair: ForexPair) => {
    setSelectedPair(pair);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPair(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
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
              <Link href="/forexs" className="text-white font-semibold">Forex</Link>
              <Link href="/cryptos" className="text-white/80 hover:text-white transition-colors">Crypto</Link>
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">💱 Forex Trading</h1>
          <p className="text-xl text-white/80">Currency pair analysis and market sentiment</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search currency pairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Forex Pairs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading forex data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPairs
              .filter(pair => pair.symbol && pair.name) // Additional safety check
              .map((pair) => (
              <div
                key={pair.symbol}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{pair.symbol}</h3>
                    <p className="text-white/70 text-sm">{pair.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{pair.price.toFixed(4)}</div>
                    <div className={`text-sm font-semibold ${
                      pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(4)} ({pair.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70 text-sm">Spread</span>
                  <span className="text-white text-sm">0.0002</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button 
                    onClick={() => handleViewDetails(pair)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredPairs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No currency pairs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Forex Pair Details Modal */}
      {showModal && selectedPair && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedPair.symbol}</h2>
                <p className="text-white/70 text-lg">{selectedPair.name}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white/70 text-sm mb-2">Current Rate</h3>
                <p className="text-3xl font-bold text-white">{selectedPair.price.toFixed(4)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white/70 text-sm mb-2">Change</h3>
                <p className={`text-2xl font-bold ${
                  selectedPair.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedPair.change >= 0 ? '+' : ''}{selectedPair.change.toFixed(4)}
                </p>
                <p className={`text-sm ${
                  selectedPair.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ({selectedPair.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white/70">Spread</span>
                <span className="text-white">0.0002</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Daily Range</span>
                <span className="text-white">{(selectedPair.price * 0.02).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W High</span>
                <span className="text-white">{(selectedPair.price * 1.08).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W Low</span>
                <span className="text-white">{(selectedPair.price * 0.92).toFixed(4)}</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-300">
                Buy
              </button>
              <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg transition-colors duration-300">
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
