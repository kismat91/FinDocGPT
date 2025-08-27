import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      riskProfile, 
      investmentGoals, 
      timeHorizon, 
      currentPortfolio, 
      targetAmount,
      monthlyContribution 
    } = body;

    // Check if Groq API key is configured
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    // Create comprehensive strategy prompt
    const prompt = createStrategyPrompt({
      riskProfile,
      investmentGoals,
      timeHorizon,
      currentPortfolio,
      targetAmount,
      monthlyContribution
    });

    // Call Groq AI for strategy generation
    const strategy = await generateStrategyWithGroq(prompt, groqApiKey);

    return NextResponse.json({
      success: true,
      strategy: strategy,
      timestamp: new Date().toISOString(),
      riskProfile,
      investmentGoals,
      timeHorizon
    });

  } catch (error) {
    console.error('Error generating strategy:', error);
    return NextResponse.json(
      { error: 'Failed to generate investment strategy', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function createStrategyPrompt(data: any): string {
  return `As a certified financial advisor and investment strategist, create a comprehensive investment strategy for the following profile:

RISK PROFILE: ${data.riskProfile || 'Moderate'}
INVESTMENT GOALS: ${data.investmentGoals || 'Long-term wealth building'}
TIME HORIZON: ${data.timeHorizon || '10+ years'}
CURRENT PORTFOLIO: ${data.currentPortfolio || 'Starting fresh'}
TARGET AMOUNT: $${data.targetAmount || '100,000'}
MONTHLY CONTRIBUTION: $${data.monthlyContribution || '500'}

Please provide a detailed analysis including:

1. PORTFOLIO ALLOCATION STRATEGY:
   - Asset allocation breakdown (stocks, bonds, ETFs, etc.)
   - Sector diversification recommendations
   - Geographic diversification

2. RISK MANAGEMENT:
   - Risk assessment for the given profile
   - Hedging strategies
   - Stop-loss recommendations

3. INVESTMENT RECOMMENDATIONS:
   - Specific asset classes to focus on
   - Rebalancing frequency
   - Tax optimization strategies

4. TIMELINE & MILESTONES:
   - Short-term (1-2 years) goals
   - Medium-term (3-7 years) objectives
   - Long-term (8+ years) vision

5. ACTION PLAN:
   - Immediate next steps
   - Monthly/quarterly review points
   - When to adjust strategy

Format the response in clear sections with actionable insights.`;
}

async function generateStrategyWithGroq(prompt: string, apiKey: string): Promise<string> {
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
            content: 'You are a certified financial advisor with expertise in portfolio optimization, risk management, and investment strategy. Provide clear, actionable, and professional financial advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Strategy generation failed';
    
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to generate strategy with AI');
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Investment Strategy API is ready',
    features: [
      'Portfolio Analysis',
      'AI Recommendations', 
      'Risk Management',
      'Asset Allocation',
      'Timeline Planning'
    ],
    supportedProfiles: ['Conservative', 'Moderate', 'Aggressive'],
    supportedGoals: ['Retirement', 'Wealth Building', 'Income Generation', 'Tax Optimization', 'Education Funding']
  });
}
