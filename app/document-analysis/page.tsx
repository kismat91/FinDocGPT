"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { 
  FileText, 
  Upload, 
  Search, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Download, 
  Eye, 
  Brain, 
  FileSpreadsheet, 
  FilePdf,
  Rocket,
  Target,
  Shield,
  Zap,
  Globe,
  Star,
  ArrowLeft,
  ArrowRight,
  Filter,
  Sparkles
} from "lucide-react";

interface ParsedDocument {
  content: string;
  metadata: {
    type: string;
    pages?: number;
    extractedData?: any;
    timestamp: string;
  };
  financialMetrics?: {
    revenue?: number;
    profit?: number;
    expenses?: number;
    assets?: number;
    liabilities?: number;
  };
}

interface AnalysisResult {
  insights: {
    keyMetrics: string[];
    trends: string[];
    opportunities: string[];
    risks: string[];
  };
  recommendations: {
    action: string;
    confidence: number;
    reasoning: string;
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  riskScore: number;
  nextSteps: string[];
}

export default function DocumentAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<ParsedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ParsedDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'library'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'application/pdf' || 
          fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          fileType === 'text/csv') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF, Excel, or CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents/parse", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const document = result.document;
        
        // Generate AI analysis
        const analysis = await generateDocumentAnalysis(document);
        setAnalysisResult(analysis);
        
        // Add to library
        setUploadedDocuments(prev => [document, ...prev]);
        
        toast({
          title: "Document analyzed successfully!",
          description: "AI analysis complete with insights and recommendations",
        });
        
        setActiveTab('analysis');
      } else {
        throw new Error("Failed to parse document");
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Error processing document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateDocumentAnalysis = async (document: ParsedDocument): Promise<AnalysisResult> => {
    // Simulate AI analysis - replace with actual AI service call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      insights: {
        keyMetrics: [
          "Revenue growth shows 15% year-over-year increase",
          "Profit margins improved by 2.3% in Q4",
          "Operating expenses reduced by 8% through efficiency measures",
          "Strong cash flow position with 25% increase in operating cash"
        ],
        trends: [
          "Consistent growth in emerging markets",
          "Digital transformation initiatives showing positive ROI",
          "Supply chain optimization reducing costs",
          "Customer retention rates at all-time high"
        ],
        opportunities: [
          "Expand into Asian markets with current momentum",
          "Leverage AI for customer service automation",
          "Develop subscription-based revenue models",
          "Strategic partnerships in technology sector"
        ],
        risks: [
          "Regulatory changes in key markets",
          "Supply chain disruptions from geopolitical tensions",
          "Competition from new market entrants",
          "Technology dependency risks"
        ]
      },
      recommendations: [
        {
          action: "BUY",
          confidence: 85,
          reasoning: "Strong fundamentals with positive growth trajectory"
        },
        {
          action: "HOLD",
          confidence: 72,
          reasoning: "Monitor market conditions and competitive landscape"
        },
        {
          action: "INVEST",
          confidence: 91,
          reasoning: "Excellent opportunity for long-term portfolio growth"
        }
      ],
      sentiment: 'positive',
      riskScore: 28,
      nextSteps: [
        "Conduct deeper market analysis",
        "Review competitive positioning",
        "Assess regulatory compliance",
        "Plan strategic investments"
      ]
    };
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FilePdf;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet;
    return FileText;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-600';
      case 'SELL': return 'bg-red-600';
      case 'HOLD': return 'bg-yellow-600';
      case 'INVEST': return 'bg-blue-600';
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
                <Brain className="h-6 w-6 text-white" />
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
              <Link href="/news">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  News
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
                <span className="text-purple-300 font-medium">AI-Powered Document Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Financial Document
                <br />
                <span className="gradient-text">Analysis</span>
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Upload financial documents and get instant AI-powered insights, risk assessment, 
                and investment recommendations using advanced machine learning.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex space-x-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                {[
                  { id: 'upload', label: 'Upload Document', icon: Upload },
                  { id: 'analysis', label: 'AI Analysis', icon: Brain },
                  { id: 'library', label: 'Document Library', icon: FileText }
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
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Upload Financial Document</h3>
                      <p className="text-white/70">Upload PDF, Excel, or CSV files for AI analysis</p>
                    </div>

                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors duration-300">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.xlsx,.xls,.csv"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-modern text-lg px-8 py-4 h-auto mb-4"
                        >
                          <Upload className="mr-2 h-5 w-5" />
                          Choose File
                        </Button>
                        <p className="text-white/60 text-sm">
                          Supported formats: PDF, Excel (.xlsx, .xls), CSV
                        </p>
                      </div>

                      {selectedFile && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white/5 rounded-2xl p-6 border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                {(() => {
                                  const IconComponent = getFileIcon(selectedFile.type);
                                  return <IconComponent className="h-6 w-6 text-white" />;
                                })()}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{selectedFile.name}</h4>
                                <p className="text-white/60 text-sm">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedFile(null)}
                              className="text-white/60 hover:text-white hover:bg-white/10"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      <Button
                        onClick={handleFileUpload}
                        disabled={!selectedFile || isAnalyzing}
                        className="w-full btn-modern text-lg py-4 h-auto"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="spinner-modern mr-3"></div>
                            Analyzing Document...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-5 w-5" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'analysis' && analysisResult && (
                <motion.div
                  key="analysis"
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
                      <h3 className="text-2xl font-bold text-white mb-2">AI Analysis Complete</h3>
                      <p className="text-white/70">Comprehensive insights and recommendations generated</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Key Insights */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-blue-400" />
                            Key Insights
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.insights.keyMetrics.map((insight, index) => (
                              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                                  <span className="text-white/90 text-sm">{insight}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                            Market Trends
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.insights.trends.map((trend, index) => (
                              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                                  <span className="text-white/90 text-sm">{trend}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Opportunities & Risks */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                            Opportunities
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.insights.opportunities.map((opportunity, index) => (
                              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                                  <span className="text-white/90 text-sm">{opportunity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                            Risk Factors
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.insights.risks.map((risk, index) => (
                              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                                  <span className="text-white/90 text-sm">{risk}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-white mb-6 text-center">AI Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analysisResult.recommendations.map((rec, index) => (
                          <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <div className={`inline-block px-4 py-2 rounded-full ${getActionColor(rec.action)} text-white text-sm font-semibold mb-4`}>
                              {rec.action}
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{rec.confidence}%</div>
                            <div className="text-white/70 text-sm mb-4">Confidence</div>
                            <p className="text-white/80 text-sm">{rec.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          <span className={getSentimentColor(analysisResult.sentiment)}>
                            {analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)}
                          </span>
                        </div>
                        <div className="text-white/70 text-sm">Market Sentiment</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className={`text-3xl font-bold mb-2 ${getRiskColor(analysisResult.riskScore)}`}>
                          {analysisResult.riskScore}/100
                        </div>
                        <div className="text-white/70 text-sm">Risk Score</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          {analysisResult.nextSteps.length}
                        </div>
                        <div className="text-white/70 text-sm">Next Steps</div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4 text-center">Recommended Next Steps</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.nextSteps.map((step, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <span className="text-white/90">{step}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'library' && (
                <motion.div
                  key="library"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto"
                >
                  <Card className="modern-card p-8 border-0">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Document Library</h3>
                      <p className="text-white/70">Access and manage your analyzed documents</p>
                    </div>

                    {uploadedDocuments.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/60">No documents uploaded yet</p>
                        <p className="text-white/40 text-sm">Upload your first document to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {uploadedDocuments.map((doc, index) => (
                          <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                  {(() => {
                                    const IconComponent = getFileIcon(doc.metadata.type);
                                    return <IconComponent className="h-6 w-6 text-white" />;
                                  })()}
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">Document {index + 1}</h4>
                                  <p className="text-white/60 text-sm">
                                    {doc.metadata.type} • {new Date(doc.metadata.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedDocument(doc)}
                                  className="text-white/70 hover:text-white hover:bg-white/10"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white/70 hover:text-white hover:bg-white/10"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-3xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Document Details</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDocument(null)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Document Type</h4>
                    <p className="text-white/70">{selectedDocument.metadata.type}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Uploaded</h4>
                    <p className="text-white/70">
                      {new Date(selectedDocument.metadata.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {selectedDocument.financialMetrics && (
                    <div>
                      <h4 className="text-white font-semibold mb-4">Financial Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedDocument.financialMetrics).map(([key, value]) => (
                          <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-white/60 text-sm capitalize">{key}</div>
                            <div className="text-white font-semibold">
                              ${value?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Content Preview</h4>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-h-40 overflow-y-auto">
                      <p className="text-white/70 text-sm">
                        {selectedDocument.content.substring(0, 500)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
