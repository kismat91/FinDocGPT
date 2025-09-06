import { NextResponse } from 'next/server';

interface FinancialMetrics {
  revenue?: number;
  profit?: number;
  growthRate?: number;
  debtToEquity?: number;
  currentRatio?: number;
  totalAssets?: number;
  shareholdersEquity?: number;
  cashFlow?: number;
  marketCap?: number;
  peRatio?: number;
}

interface RiskAssessment {
  overallRisk: 'Low' | 'Medium' | 'High';
  riskScore: number; // 1-10
  riskFactors: string[];
  complianceIssues: string[];
  anomalies: string[];
}

interface StructuredAnalysis {
  documentType: string;
  extractedMetrics: FinancialMetrics;
  riskAssessment: RiskAssessment;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Requires Review';
  investmentRecommendation: 'Buy' | 'Hold' | 'Sell' | 'Research';
  confidence: number; // 0-100%
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const analysisType = formData.get('analysisType') as string || 'general';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size (Groq API has a limit of ~4MB for llama3-8b-8192)
    const maxFileSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { 
          error: 'File too large', 
          details: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size of 4MB. Please upload a smaller file or split your document.`,
          maxFileSize: '4MB'
        },
        { status: 400 }
      );
    }

    // Check if Groq API key is configured
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // More aggressive content truncation for Groq API (total request must be under ~8KB)
    const maxContentLength = 5000; // Very conservative limit for Groq API
    const truncatedContent = fileContent.length > maxContentLength 
      ? fileContent.substring(0, maxContentLength) + '\n\n[Content truncated due to API limits - showing first 5000 characters]'
      : fileContent;
    
    // Create comprehensive analysis prompt
    const prompt = createComprehensiveAnalysisPrompt(truncatedContent, analysisType, file.name);
    
    // Call Groq AI for comprehensive analysis
    const analysis = await analyzeWithGroq(prompt, groqApiKey);
    
    // Parse the AI response to extract structured data
    const structuredData = parseAIResponse(analysis, analysisType);
    
    return NextResponse.json({
      success: true,
      analysis: analysis,
      structuredData: structuredData,
      fileName: file.name,
      fileSize: file.size,
      analysisType: analysisType,
      timestamp: new Date().toISOString(),
      note: fileContent.length > maxContentLength ? 'Document was truncated to 5000 characters due to API limits' : undefined
    });
    
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function createComprehensiveAnalysisPrompt(content: string, analysisType: string, fileName: string): string {
  const basePrompt = `As a certified financial analyst and AI expert, perform a comprehensive analysis of this financial document: "${fileName}"

Document Content:
${content}

Please provide a structured analysis in the following JSON format:

{
  "documentType": "earnings_report|balance_sheet|cash_flow|press_release|annual_report|other",
  "extractedMetrics": {
    "revenue": number or null,
    "profit": number or null,
    "growthRate": number or null,
    "debtToEquity": number or null,
    "currentRatio": number or null,
    "totalAssets": number or null,
    "shareholdersEquity": number or null,
    "cashFlow": number or null,
    "marketCap": number or null,
    "peRatio": number or null
  },
  "riskAssessment": {
    "overallRisk": "Low|Medium|High",
    "riskScore": number (1-10),
    "riskFactors": ["factor1", "factor2"],
    "complianceIssues": ["issue1", "issue2"],
    "anomalies": ["anomaly1", "anomaly2"]
  },
  "complianceStatus": "Compliant|Non-Compliant|Requires Review",
  "investmentRecommendation": "Buy|Hold|Sell|Research",
  "confidence": number (0-100),
  "detailedAnalysis": "Comprehensive analysis text",
  "keyInsights": ["insight1", "insight2", "insight3"],
  "actionItems": ["action1", "action2", "action3"]
}

Focus on:`;

  switch (analysisType) {
    case 'earnings':
      return `${basePrompt}
1. Revenue trends and profitability analysis
2. Growth metrics and sustainability
3. Earnings quality and cash flow
4. Risk factors and compliance issues
5. Investment implications and recommendations`;
    
    case 'balance_sheet':
      return `${basePrompt}
1. Asset and liability structure analysis
2. Financial health and solvency ratios
3. Liquidity and working capital assessment
4. Debt levels and capital structure
5. Compliance with accounting standards`;
    
    case 'cash_flow':
      return `${basePrompt}
1. Operating cash flow sustainability
2. Investing and financing activities
3. Cash flow quality and trends
4. Working capital management
5. Financial flexibility and risk assessment`;
    
    default:
      return `${basePrompt}
1. Key financial metrics extraction
2. Risk factor identification and scoring
3. Compliance and regulatory analysis
4. Anomaly detection and investigation
5. Investment decision support`;
  }
}

function parseAIResponse(aiResponse: string, analysisType: string): StructuredAnalysis {
  try {
    // Try to extract JSON from the AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        documentType: parsed.documentType || 'unknown',
        extractedMetrics: parsed.extractedMetrics || {},
        riskAssessment: parsed.riskAssessment || {
          overallRisk: 'Medium',
          riskScore: 5,
          riskFactors: [],
          complianceIssues: [],
          anomalies: []
        },
        complianceStatus: parsed.complianceStatus || 'Requires Review',
        investmentRecommendation: parsed.investmentRecommendation || 'Research',
        confidence: parsed.confidence || 50
      };
    }
  } catch (error) {
    console.log('Failed to parse AI response as JSON, using fallback parsing');
  }

  // Fallback parsing if JSON extraction fails
  return {
    documentType: analysisType,
    extractedMetrics: {},
    riskAssessment: {
      overallRisk: 'Medium',
      riskScore: 5,
      riskFactors: ['Unable to extract specific risk factors'],
      complianceIssues: ['Analysis incomplete'],
      anomalies: ['Unable to detect anomalies']
    },
    complianceStatus: 'Requires Review',
    investmentRecommendation: 'Research',
    confidence: 30
  };
}

async function analyzeWithGroq(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a certified financial analyst and AI expert specializing in financial document analysis, risk assessment, compliance checking, and investment recommendations. Always respond with structured data when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Analysis failed';
    
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to analyze with AI');
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Document AI API is ready',
    features: [
      'Financial Document Extraction',
      'Structured Data Analysis',
      'Risk Assessment & Scoring',
      'Compliance Checking',
      'Anomaly Detection',
      'Investment Recommendations'
    ],
    supportedTypes: ['earnings', 'balance_sheet', 'cash_flow', 'general'],
    maxFileSize: '4MB',
    maxContentLength: '5,000 characters',
    note: 'Documents are processed using AI to extract structured financial data, assess risks, and provide investment insights.',
    supportedFormats: ['txt', 'pdf', 'doc', 'docx']
  });
}
