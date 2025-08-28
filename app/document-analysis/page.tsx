"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface AnalysisResult {
  success: boolean;
  analysis: string;
  fileName: string;
  fileSize: number;
  analysisType: string;
  timestamp: string;
  note?: string;
}

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('general');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisTypes = [
    { value: 'enhanced-document-analysis', label: 'Enhanced Analysis', description: 'AI-powered comprehensive document review' },
    { value: 'financial-analysis', label: 'Financial Analysis', description: 'Deep financial metrics and performance analysis' },
    { value: 'risk-assessment', label: 'Risk Assessment', description: 'Comprehensive risk evaluation and scoring' },
    { value: 'compliance-check', label: 'Compliance Check', description: 'Regulatory compliance verification' },
    { value: 'forecasting', label: 'Forecasting', description: 'AI-powered financial forecasting and predictions' },
    { value: 'multi-agent-analysis', label: 'Multi-Agent Analysis', description: 'Coordinated AI agents for comprehensive insights' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file size (4MB limit for Groq API)
      if (selectedFile.size > 4 * 1024 * 1024) {
        setError('File size must be less than 4MB. Large documents will be truncated for analysis.');
        return;
      }
      
      // Check file type
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a valid file type (TXT, PDF, DOC, DOCX)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysisType', analysisType);

      const response = await fetch('/api/document-analysis', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (error) {
      setError('Failed to analyze document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !analysisResult) {
      setError('Please enter a question and ensure document is analyzed first');
      return;
    }

    setIsAskingQuestion(true);
    setError(null);

    try {
      const response = await fetch('/api/document-analysis/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          documentAnalysis: analysisResult.analysis,
          fileName: analysisResult.fileName
        }),
      });

      const result = await response.json();

      if (result.success) {
        setQuestionAnswer(result.answer);
      } else {
        setError(result.error || 'Failed to get answer');
      }
    } catch (error) {
      setError('Failed to get answer. Please try again.');
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
    setQuestion('');
    setQuestionAnswer('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
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
              <Link href="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
              <Link href="/document-analysis" className="text-white font-semibold">Documents</Link>
              <Link href="/forecasting" className="text-white/80 hover:text-white transition-colors">Forecasting</Link>
              <Link href="/strategy" className="text-white/80 hover:text-white transition-colors">Strategy</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">📄 Document AI Analysis</h1>
          <p className="text-xl text-white/80">AI-powered financial document analysis with Q&A capabilities</p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">📤 Upload Document</h2>
          
          {/* Drag & Drop Zone */}
          <div
            className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl mb-4">📁</div>
            <p className="text-white/80 mb-2">
              {file ? `Selected: ${file.name}` : 'Drag & drop your document here or click to browse'}
            </p>
            <p className="text-white/60 text-sm">Supports: TXT, PDF, DOC, DOCX (Max 4MB, content truncated to 5,000 characters)</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
            />
          </div>

            {/* File Processing Note */}
            <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 <strong>Note:</strong> Due to AI API limits, documents are processed using the first 5,000 characters. 
                For comprehensive analysis of longer documents, consider splitting them into smaller sections or focusing on key excerpts.
              </p>
            </div>

            {/* Analysis Type Selection */}
          <div className="mt-6">
            <label className="block text-white font-medium mb-3">Analysis Type:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {analysisTypes.map((type) => (
                <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="analysisType"
                    value={type.value}
                    checked={analysisType === type.value}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <div className="text-white font-medium">{type.label}</div>
                    <div className="text-white/60 text-xs">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg transition-colors duration-300"
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner inline-block mr-2"></div>
                  Analyzing...
                </>
              ) : (
                '🔍 Analyze Document'
              )}
            </button>
            
            {file && (
              <button
                onClick={resetAnalysis}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Reset
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">📊 Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Document Info</h3>
                <p className="text-white/70 text-sm">File: {analysisResult.fileName}</p>
                <p className="text-white/70 text-sm">Size: {(analysisResult.fileSize / 1024).toFixed(1)} KB</p>
                <p className="text-white/70 text-sm">Type: {analysisResult.analysisType}</p>
                <p className="text-white/70 text-sm">Analyzed: {new Date(analysisResult.timestamp).toLocaleString()}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Analysis Type</h3>
                <p className="text-white/70 text-sm">{analysisTypes.find(t => t.value === analysisResult.analysisType)?.label}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">AI Analysis Report</h3>
              <div className="prose prose-invert max-w-none">
                <div className="text-white/90 whitespace-pre-wrap">{analysisResult.analysis}</div>
              </div>
            </div>
            
            {/* Note Display */}
            {analysisResult.note && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">⚠️ {analysisResult.note}</p>
              </div>
            )}
          </div>
        )}

        {/* Q&A Section */}
        {analysisResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">❓ Ask Questions About Your Document</h2>
            
            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your document..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleAskQuestion}
                disabled={!question.trim() || isAskingQuestion}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {isAskingQuestion ? (
                  <>
                    <div className="spinner inline-block mr-2"></div>
                    Asking...
                  </>
                ) : (
                  'Ask'
                )}
              </button>
            </div>

            {questionAnswer && (
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">🤖 AI Answer</h3>
                <div className="prose prose-invert max-w-none">
                  <div className="text-white/90 whitespace-pre-wrap">{questionAnswer}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
