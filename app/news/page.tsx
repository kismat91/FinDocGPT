"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
}

interface FullArticle {
  success: boolean;
  content: string;
  title: string;
  metaDescription: string;
  publishDate: string;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  wordCount: number;
  readingTime: number;
  extractionQuality?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullArticle, setFullArticle] = useState<FullArticle | null>(null);
  const [loadingFullArticle, setLoadingFullArticle] = useState(false);
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>([]);

  const categories = ["all", "Technology", "Markets", "Monetary Policy", "Commodities", "Cryptocurrency"];

  useEffect(() => {
    fetchNews();
    // Load saved articles from localStorage
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
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

  const handleViewDetails = async (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setShowModal(true);
    setLoadingFullArticle(true);
    setFullArticle(null);

    try {
      const response = await fetch('/api/news/full-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newsItem.url }),
      });

      if (response.ok) {
        const articleData = await response.json();
        setFullArticle(articleData);
      } else {
        console.error('Failed to fetch full article');
      }
    } catch (error) {
      console.error('Error fetching full article:', error);
    } finally {
      setLoadingFullArticle(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
    setFullArticle(null);
    setLoadingFullArticle(false);
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

  const handleShareArticle = async () => {
    if (!selectedNews) return;

    const shareData = {
      title: selectedNews.title,
      text: selectedNews.description,
      url: selectedNews.url
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Article shared successfully!", {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${selectedNews.title}\n\n${selectedNews.description}\n\nRead more: ${selectedNews.url}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Article link copied to clipboard!", {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy to clipboard
      try {
        const shareText = `${selectedNews.title}\n\n${selectedNews.description}\n\nRead more: ${selectedNews.url}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Article link copied to clipboard!", {
          duration: 3000,
          position: 'top-center',
        });
      } catch (clipboardError) {
        toast.error("Unable to share article. Please try again.", {
          duration: 3000,
          position: 'top-center',
        });
      }
    }
  };

  const handleSaveToPortfolio = () => {
    if (!selectedNews) return;

    const isAlreadySaved = savedArticles.some(article => article.id === selectedNews.id);
    
    if (isAlreadySaved) {
      // Remove from saved articles
      const updatedSaved = savedArticles.filter(article => article.id !== selectedNews.id);
      setSavedArticles(updatedSaved);
      localStorage.setItem('savedArticles', JSON.stringify(updatedSaved));
      toast.success("Article removed from portfolio!", {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      // Add to saved articles
      const updatedSaved = [...savedArticles, selectedNews];
      setSavedArticles(updatedSaved);
      localStorage.setItem('savedArticles', JSON.stringify(updatedSaved));
      toast.success("Article saved to portfolio!", {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const isArticleSaved = (articleId: number) => {
    return savedArticles.some(article => article.id === articleId);
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
          <h1 className="text-4xl font-bold text-white mb-4">Market News</h1>
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
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      {item.category}
                    </span>
                    {isArticleSaved(item.id) && (
                      <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span>Saved</span>
                      </span>
                    )}
                  </div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-3">
                  {selectedNews.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedNews.title}</h2>
                <div className="flex items-center space-x-4 text-white/70 mb-4">
                  <span>{selectedNews.source}</span>
                  <span>•</span>
                  <span>{formatDate(selectedNews.publishedAt)}</span>
                  {fullArticle && (
                    <>
                      <span>•</span>
                      <span>{fullArticle.readingTime} min read</span>
                      <span>•</span>
                      <span>{fullArticle.wordCount} words</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white text-2xl font-bold ml-4"
              >
                ×
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              {/* Summary */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">📝 Summary</h3>
                <p className="text-white/90 leading-relaxed">{selectedNews.description}</p>
              </div>

              {/* Full Article Content */}
              {loadingFullArticle && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-white/70 mt-2">Loading full article...</p>
                </div>
              )}

              {fullArticle && fullArticle.success && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Full Article</h3>
                  
                  {/* Images */}
                  {fullArticle.images && fullArticle.images.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fullArticle.images.slice(0, 2).map((image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            <img 
                              src={image.src} 
                              alt={image.alt}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {image.caption && (
                              <p className="text-sm text-white/60 mt-2 px-2">{image.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="bg-white/5 rounded-lg p-6 mb-6">
                    <div className="text-white/90 leading-relaxed space-y-4">
                      {fullArticle.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-base leading-7">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                    
                    {fullArticle.extractionQuality === 'limited' && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-300 text-sm">
                          Limited content extracted. For the complete article, please visit the original source.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!loadingFullArticle && (!fullArticle || !fullArticle.success || !fullArticle.content) && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Full Content Not Available</h3>
                  <p className="text-white/70 mb-4">
                    We couldn't extract the full article content from this source. This might be due to the website's structure or content protection measures.
                  </p>
                  <a 
                    href={selectedNews.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Read Full Article on {selectedNews.source} ↗
                  </a>
                </div>
              )}
              
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
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleShareArticle}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2"
                >
                  Share Article
                </button>
                <button 
                  onClick={handleSaveToPortfolio}
                  className={`py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2 ${
                    selectedNews && isArticleSaved(selectedNews.id)
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  }`}
                >
                  {selectedNews && isArticleSaved(selectedNews.id) ? 'Remove from Portfolio' : 'Save to Portfolio'}
                </button>
                <a 
                  href={selectedNews.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg transition-colors duration-300 text-center flex items-center gap-2"
                >
                  <span>🔗</span>
                  View Original ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
