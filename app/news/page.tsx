"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["all", "Technology", "Markets", "Monetary Policy", "Commodities", "Cryptocurrency"];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Link href="/stocks" className="text-white/80 hover:text-white transition-colors">Stocks</Link>
              <Link href="/forexs" className="text-white/80 hover:text-white transition-colors">Forex</Link>
              <Link href="/cryptos" className="text-white/80 hover:text-white transition-colors">Crypto</Link>
              <Link href="/news" className="text-white font-semibold">News</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📰 Market News</h1>
          <p className="text-xl text-white/80">Real-time financial news and market updates</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 block"
          />
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-white/70">Loading news...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-3">{item.description}</p>
                </div>
                
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-white/60">{item.source}</span>
                  <span className="text-white/60">{formatDate(item.publishedAt)}</span>
                </div>
                
                <div className="pt-4 border-t border-white/20">
                  <button 
                    onClick={() => handleViewDetails(item)}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">No news articles found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* News Details Modal */}
      {showModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-3">
                  {selectedNews.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedNews.title}</h2>
                <div className="flex items-center space-x-4 text-white/70">
                  <span>{selectedNews.source}</span>
                  <span>•</span>
                  <span>{formatDate(selectedNews.publishedAt)}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-white/90 text-lg leading-relaxed mb-6">{selectedNews.description}</p>
              
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Market Impact Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white/80 font-medium mb-2">Potential Impact</h4>
                    <p className="text-white/70 text-sm">This news may influence market sentiment and trading decisions in the short term.</p>
                  </div>
                  <div>
                    <h4 className="text-white/80 font-medium mb-2">Related Assets</h4>
                    <p className="text-white/70 text-sm">Stocks, currencies, and commodities that may be affected by this development.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-300">
                  Share Article
                </button>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-300">
                  Save to Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
