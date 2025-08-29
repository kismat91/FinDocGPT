"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      console.log('🚀 Fetching stocks from TEST API...');
      const response = await fetch("/api/stocks-test");
      console.log('📡 API response status:', response.status);
      console.log('📡 API response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawText = await response.text();
      console.log('📄 Raw response text:', rawText);
      
      const data = JSON.parse(rawText);
      console.log('📊 API response data:', data);
      console.log('📈 Number of stocks received:', data.length);
      console.log('🔍 Data type:', typeof data, Array.isArray(data));
      console.log('🎯 First stock:', data[0]);
      
      if (Array.isArray(data) && data.length > 0) {
        setStocks(data);
        console.log('✅ Successfully set stocks:', data.length);
      } else {
        console.warn('⚠️ No stocks in response or not an array');
        setStocks([]);
      }
    } catch (error) {
      console.error("❌ Error fetching stocks:", error);
      setStocks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Show all stocks without filtering for now to debug
  const filteredStocks = stocks;
  
  console.log('🏁 Final render - All stocks:', stocks);
  console.log('🎯 Final render - Filtered stocks:', filteredStocks);
  console.log('🔍 Final render - Search term:', searchTerm);

  const handleViewDetails = (stock: Stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStock(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
              <Link href="/stocks" className="text-white font-semibold">Stocks</Link>
              <Link href="/forexs" className="text-white/80 hover:text-white transition-colors">Forex</Link>
              <Link href="/cryptos" className="text-white/80 hover:text-white transition-colors">Crypto</Link>
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Stock Market Analysis</h1>
          <p className="text-xl text-white/80">Real-time stock data and market insights</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search stocks by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Stocks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading stock data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks
              .filter(stock => stock.symbol && stock.name) // Additional safety check
              .map((stock) => (
              <div
                key={stock.symbol}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                    <p className="text-white/70 text-sm">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</div>
                    <div className={`text-sm font-semibold ${
                      stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70 text-sm">Market Cap</span>
                  <span className="text-white text-sm">$1.2T</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button 
                    onClick={() => handleViewDetails(stock)}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No stocks found matching your search.</p>
          </div>
        )}
      </div>

      {/* Stock Details Modal */}
      {showModal && selectedStock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedStock.symbol}</h2>
                <p className="text-white/70 text-lg">{selectedStock.name}</p>
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
                <h3 className="text-white/70 text-sm mb-2">Current Price</h3>
                <p className="text-3xl font-bold text-white">${selectedStock.price.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white/70 text-sm mb-2">Change</h3>
                <p className={`text-2xl font-bold ${
                  selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}
                </p>
                <p className={`text-sm ${
                  selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ({selectedStock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white/70">Market Cap</span>
                <span className="text-white">$1.2T</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Volume</span>
                <span className="text-white">45.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">P/E Ratio</span>
                <span className="text-white">25.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W High</span>
                <span className="text-white">${(selectedStock.price * 1.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W Low</span>
                <span className="text-white">${(selectedStock.price * 0.85).toFixed(2)}</span>
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
