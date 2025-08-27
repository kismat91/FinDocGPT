import { NextResponse } from 'next/server';

interface RiskProfile {
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number; // 1-10
  riskCategory: 'Market' | 'Credit' | 'Operational' | 'Liquidity' | 'Compliance';
  probability: number; // 0-100%
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationStrategies: string[];
}

interface ComplianceCheck {
  status: 'Compliant' | 'Non-Compliant' | 'Requires Review';
  regulations: string[];
  violations: string[];
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface AnomalyDetection {
  anomalies: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number; // 0-100%
  explanation: string;
  recommendedActions: string[];
}

interface RiskAssessment {
  portfolioRisk: RiskProfile;
  complianceStatus: ComplianceCheck;
  anomalies: AnomalyDetection;
  overallRiskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number; // 1-10
  recommendations: string[];
  nextReviewDate: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      portfolioData, 
      investmentType, 
      marketConditions,
      complianceRequirements,
      riskTolerance 
    } = body;

    if (!portfolioData) {
      return NextResponse.json(
        { error: 'Portfolio data is required' },
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

    // Create comprehensive risk assessment prompt
    const prompt = createRiskAssessmentPrompt(portfolioData, investmentType, marketConditions, complianceRequirements, riskTolerance);
    
    // Call Groq AI for risk assessment
    const riskAnalysis = await generateRiskAssessmentWithGroq(prompt, groqApiKey);
    
    // Parse the AI response to extract structured data
    const structuredRiskAssessment = parseRiskResponse(riskAnalysis);
    
    return NextResponse.json({
      success: true,
      riskAnalysis: riskAnalysis,
      structuredRiskAssessment: structuredRiskAssessment,
      timestamp: new Date().toISOString(),
      nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });

  } catch (error) {
    console.error('Error generating risk assessment:', error);
    return NextResponse.json(
      { error: 'Failed to generate risk assessment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function createRiskAssessmentPrompt(portfolioData: any, investmentType: string, marketConditions: string, complianceRequirements: string[], riskTolerance: string): string {
  return `As a certified risk management and compliance expert, perform a comprehensive risk assessment for the following investment portfolio:

Portfolio Data: ${JSON.stringify(portfolioData, null, 2)}
Investment Type: ${investmentType}
Market Conditions: ${marketConditions}
Compliance Requirements: ${complianceRequirements.join(', ')}
Risk Tolerance: ${riskTolerance}

Please provide a structured risk assessment in the following JSON format:

{
  "portfolioRisk": {
    "overallRisk": "Low|Medium|High|Critical",
    "riskScore": number (1-10),
    "riskCategory": "Market|Credit|Operational|Liquidity|Compliance",
    "probability": number (0-100),
    "impact": "Low|Medium|High|Critical",
    "mitigationStrategies": ["strategy1", "strategy2"]
  },
  "complianceStatus": {
    "status": "Compliant|Non-Compliant|Requires Review",
    "regulations": ["regulation1", "regulation2"],
    "violations": ["violation1", "violation2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "riskLevel": "Low|Medium|High"
  },
  "anomalies": {
    "anomalies": ["anomaly1", "anomaly2"],
    "severity": "Low|Medium|High|Critical",
    "confidence": number (0-100),
    "explanation": "string",
    "recommendedActions": ["action1", "action2"]
  },
  "overallRiskRating": "Low|Medium|High|Critical",
  "riskScore": number (1-10),
  "recommendations": ["recommendation1", "recommendation2"]
}

Focus on:
1. Portfolio risk assessment and scoring
2. Compliance with regulatory requirements
3. Anomaly detection and investigation
4. Risk mitigation strategies
5. Compliance recommendations
6. Overall risk rating and next steps

Provide comprehensive, actionable risk management insights.`;
}

function parseRiskResponse(aiResponse: string): RiskAssessment {
  try {
    // Try to extract JSON from the AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        portfolioRisk: parsed.portfolioRisk || {
          overallRisk: 'Medium',
          riskScore: 5,
          riskCategory: 'Market',
          probability: 50,
          impact: 'Medium',
          mitigationStrategies: ['Standard risk management practices']
        },
        complianceStatus: parsed.complianceStatus || {
          status: 'Requires Review',
          regulations: ['General compliance requirements'],
          violations: ['No specific violations identified'],
          recommendations: ['Conduct detailed compliance review'],
          riskLevel: 'Medium'
        },
        anomalies: parsed.anomalies || {
          anomalies: ['No specific anomalies detected'],
          severity: 'Low',
          confidence: 50,
          explanation: 'Analysis incomplete',
          recommendedActions: ['Continue monitoring']
        },
        overallRiskRating: parsed.overallRiskRating || 'Medium',
        riskScore: parsed.riskScore || 5,
        recommendations: parsed.recommendations || ['Further risk assessment recommended'],
        nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  } catch (error) {
    console.log('Failed to parse AI risk response as JSON, using fallback parsing');
  }

  // Fallback parsing if JSON extraction fails
  return {
    portfolioRisk: {
      overallRisk: 'Medium',
      riskScore: 5,
      riskCategory: 'Market',
      probability: 50,
      impact: 'Medium',
      mitigationStrategies: ['Standard risk management practices']
    },
    complianceStatus: {
      status: 'Requires Review',
      regulations: ['General compliance requirements'],
      violations: ['No specific violations identified'],
      recommendations: ['Conduct detailed compliance review'],
      riskLevel: 'Medium'
    },
    anomalies: {
      anomalies: ['No specific anomalies detected'],
      severity: 'Low',
      confidence: 50,
      explanation: 'Analysis incomplete',
      recommendedActions: ['Continue monitoring']
    },
    overallRiskRating: 'Medium',
    riskScore: 5,
    recommendations: ['Further risk assessment recommended'],
    nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };
}

async function generateRiskAssessmentWithGroq(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a certified risk management and compliance expert specializing in financial risk assessment, regulatory compliance, and anomaly detection. Provide structured, actionable risk management insights with clear compliance recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Risk assessment failed';
    
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to generate risk assessment with AI');
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Risk Management and Compliance API is ready',
    features: [
      'Portfolio Risk Assessment',
      'Compliance Checking',
      'Anomaly Detection',
      'Risk Scoring & Rating',
      'Mitigation Strategies',
      'Regulatory Compliance',
      'Risk Monitoring',
      'Compliance Reporting'
    ],
    supportedRiskCategories: ['Market', 'Credit', 'Operational', 'Liquidity', 'Compliance'],
    riskLevels: ['Low', 'Medium', 'High', 'Critical'],
    complianceStatuses: ['Compliant', 'Non-Compliant', 'Requires Review'],
    supportedInvestmentTypes: ['Stocks', 'Bonds', 'ETFs', 'Mutual Funds', 'Real Estate', 'Commodities', 'Cryptocurrencies']
  });
}
