"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
}

export default function CryptosPage() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch("/api/cryptos");
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.symbol && crypto.name && (
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCrypto(null);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(1)}T`;
    if (marketCap >= 1) return `$${marketCap.toFixed(1)}B`;
    return `$${(marketCap * 1000).toFixed(1)}M`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
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
              <Link href="/cryptos" className="text-white font-semibold">Crypto</Link>
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">₿ Crypto Markets</h1>
          <p className="text-xl text-white/80">Digital asset analysis and portfolio tracking</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Crypto Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading crypto data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCryptos
              .filter(crypto => crypto.symbol && crypto.name) // Additional safety check
              .map((crypto) => (
              <div
                key={crypto.symbol}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{crypto.symbol}</h3>
                    <p className="text-white/70 text-sm">{crypto.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${crypto.price.toFixed(2)}</div>
                    <div className={`text-sm font-semibold ${
                      crypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)} ({crypto.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70 text-sm">Market Cap</span>
                  <span className="text-white text-sm">{formatMarketCap(crypto.marketCap)}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button 
                    onClick={() => handleViewDetails(crypto)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCryptos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No cryptocurrencies found matching your search.</p>
          </div>
        )}
      </div>

      {/* Crypto Details Modal */}
      {showModal && selectedCrypto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedCrypto.symbol}</h2>
                <p className="text-white/70 text-lg">{selectedCrypto.name}</p>
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
                <p className="text-3xl font-bold text-white">${selectedCrypto.price.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white/70 text-sm mb-2">Change</h3>
                <p className={`text-2xl font-bold ${
                  selectedCrypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedCrypto.change >= 0 ? '+' : ''}{selectedCrypto.change.toFixed(2)}
                </p>
                <p className={`text-sm ${
                  selectedCrypto.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ({selectedCrypto.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white/70">Market Cap</span>
                <span className="text-white">{formatMarketCap(selectedCrypto.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">24h Volume</span>
                <span className="text-white">$2.1B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Circulating Supply</span>
                <span className="text-white">19.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">All Time High</span>
                <span className="text-white">${(selectedCrypto.price * 1.25).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">All Time Low</span>
                <span className="text-white">${(selectedCrypto.price * 0.75).toFixed(2)}</span>
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
