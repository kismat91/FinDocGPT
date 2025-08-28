'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ExternalLink,
  MessageCircle,
  BarChart3,
  FileText,
  Shield,
  DollarSign
} from 'lucide-react';

interface CompanyData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: string;
  executiveSummary: string;
  financialSnapshot: {
    revenue: string;
    netIncome: string;
    totalAssets: string;
    totalDebt: string;
    peRatio: string;
    roe: string;
    debtToEquity: string;
    currentRatio: string;
  };
  bullCase: string[];
  bearCase: string[];
  keyRisks: string[];
  sourceLinks: string[];
  filingDate: string;
  quarter: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SECFilingsPage() {
  const [searchTicker, setSearchTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTicker.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/sec-filings/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: searchTicker.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }

      const data = await response.json();
      setCompanyData(data);
      
      // Initialize chat with company context
      setChatMessages([{
        role: 'assistant',
        content: `Hi! I've loaded the SEC filing analysis for ${data.name} (${data.symbol}). What would you like to know about their financials, risks, or business operations?`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error fetching company data:', error);
      // For demo purposes, show mock data if API fails
      setCompanyData(getMockCompanyData(searchTicker.toUpperCase()));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !companyData) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/sec-filings/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          companySymbol: companyData.symbol,
          context: companyData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble accessing the detailed financial data right now. Please try your question again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getMockCompanyData = (ticker: string): CompanyData => {
    // Mock data for demonstration
    return {
      symbol: ticker,
      name: ticker === 'AAPL' ? 'Apple Inc.' : `${ticker} Corporation`,
      sector: 'Technology',
      industry: 'Consumer Electronics',
      marketCap: '$3.2T',
      executiveSummary: `${ticker === 'AAPL' ? 'Apple Inc.' : `${ticker} Corporation`} is a leading technology company that designs, manufactures, and markets consumer electronics, computer software, and online services. The company has demonstrated strong financial performance with consistent revenue growth and robust profit margins.`,
      financialSnapshot: {
        revenue: '$394.3B',
        netIncome: '$97.0B',
        totalAssets: '$352.8B',
        totalDebt: '$123.9B',
        peRatio: '28.5',
        roe: '26.4%',
        debtToEquity: '1.73',
        currentRatio: '1.07'
      },
      bullCase: [
        'Strong ecosystem and brand loyalty',
        'Consistent innovation in products and services',
        'Growing services revenue with high margins',
        'Strong cash generation and shareholder returns',
        'Leadership in premium consumer electronics market'
      ],
      bearCase: [
        'High dependence on iPhone sales',
        'Increasing competition in key markets',
        'Regulatory scrutiny and potential antitrust action',
        'Slowing growth in mature markets',
        'Supply chain vulnerabilities'
      ],
      keyRisks: [
        'Economic downturn affecting consumer spending',
        'Geopolitical tensions impacting supply chain',
        'Technology disruption and changing consumer preferences',
        'Regulatory and legal challenges',
        'Currency exchange rate fluctuations'
      ],
      sourceLinks: [
        'https://www.sec.gov/edgar/browse/?CIK=320193',
        'https://investor.apple.com/sec-filings/',
      ],
      filingDate: '2024-01-15',
      quarter: 'Q1 2024'
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <FileText className="h-10 w-10 text-blue-600" />
          SEC 10-K Filings AI Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Instant AI-powered analysis of company SEC filings with interactive Q&A
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Company Search
          </CardTitle>
          <CardDescription>
            Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL) to get instant SEC filing analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter ticker symbol (e.g., AAPL)"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze SEC Filing'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Analysis Results */}
      {companyData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {companyData.name} ({companyData.symbol})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{companyData.sector}</Badge>
                      <Badge variant="outline">{companyData.industry}</Badge>
                      <Badge variant="default">Market Cap: {companyData.marketCap}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Executive Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {companyData.executiveSummary}
                    </p>
                    <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
                      <span>Filing Date: {companyData.filingDate}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>Period: {companyData.quarter}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Source Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {companyData.sourceLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 underline"
                        >
                          SEC Filing #{index + 1}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Financial Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {companyData.financialSnapshot.revenue}
                        </div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {companyData.financialSnapshot.netIncome}
                        </div>
                        <div className="text-sm text-muted-foreground">Net Income</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {companyData.financialSnapshot.totalAssets}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Assets</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {companyData.financialSnapshot.totalDebt}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Debt</div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {companyData.financialSnapshot.peRatio}
                        </div>
                        <div className="text-sm text-muted-foreground">P/E Ratio</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {companyData.financialSnapshot.roe}
                        </div>
                        <div className="text-sm text-muted-foreground">ROE</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {companyData.financialSnapshot.debtToEquity}
                        </div>
                        <div className="text-sm text-muted-foreground">Debt/Equity</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {companyData.financialSnapshot.currentRatio}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Ratio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        Bull Case
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {companyData.bullCase.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <TrendingDown className="h-5 w-5" />
                        Bear Case
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {companyData.bearCase.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <Shield className="h-5 w-5" />
                      Key Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.keyRisks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Interactive Chat */}
          <div className="lg:col-span-1">
            <Card className="h-[800px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Interactive Q&A
                </CardTitle>
                <CardDescription>
                  Ask questions about {companyData.name}'s financials, risks, and operations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-4 space-y-2">
                  {/* Quick Questions */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      "What are the main risks?",
                      "P/E ratio analysis",
                      "Debt levels",
                      "Growth prospects"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput(question)}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about financials, risks, ratios..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                      className="flex-1"
                    />
                    <Button onClick={handleChatSubmit} disabled={isChatLoading || !chatInput.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
