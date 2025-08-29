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
  return `As a certified financial advisor and investment strategist, create a personalized investment strategy for the following profile:

RISK PROFILE: ${data.riskProfile || 'Moderate'}
INVESTMENT GOALS: ${data.investmentGoals || 'Long-term wealth building'}
TIME HORIZON: ${data.timeHorizon || '10+ years'}
CURRENT PORTFOLIO: ${data.currentPortfolio || 'Starting fresh'}
TARGET AMOUNT: $${data.targetAmount || '100,000'}
MONTHLY CONTRIBUTION: $${data.monthlyContribution || '500'}

IMPORTANT REQUIREMENTS:
- Provide SPECIFIC, PERSONALIZED recommendations based on the exact data provided
- NO repetitive sentences or generic advice
- Include actual calculations and projections based on the target amount and monthly contribution
- Give specific asset allocation percentages that add up to 100%
- Provide actionable, measurable steps

Please provide a detailed analysis in this EXACT format:

## PORTFOLIO ALLOCATION STRATEGY
- Total Portfolio Target: $${data.targetAmount}
- Monthly Contribution: $${data.monthlyContribution}
- Asset Allocation (must total 100%):
  * [Specific percentage]% [Specific asset class] - [Reasoning]
  * [Specific percentage]% [Specific asset class] - [Reasoning]
  * [Continue until 100%]

## SECTOR & GEOGRAPHIC DIVERSIFICATION
- Primary Sectors: [List 3-4 specific sectors with percentages]
- Geographic Allocation: [List specific regions with percentages]
- International Exposure: [Specific percentage and reasoning]

## RISK MANAGEMENT & TIMELINE
- Risk Level: [Specific assessment for ${data.riskProfile} profile]
- Volatility Expectation: [Specific percentage range]
- Rebalancing Schedule: [Specific frequency and triggers]
- Stop-Loss Strategy: [Specific percentages for different asset classes]

## INVESTMENT RECOMMENDATIONS
- Primary Focus: [3-4 specific investment types with reasoning]
- Tax Optimization: [2-3 specific strategies for the ${data.timeHorizon} timeframe]
- Liquidity Needs: [Specific recommendations based on time horizon]

## ACTION PLAN & MILESTONES
- Month 1-6: [3 specific actions focused on initial setup and portfolio establishment]
- Month 7-18: [3 specific actions focused on growth and optimization - DIFFERENT from Month 1-6]
- Month 19-${data.timeHorizon}: [3 specific actions focused on long-term maintenance and adjustment - DIFFERENT from previous periods]
- Success Metrics: [3 measurable indicators with specific targets]

## PROJECTED TIMELINE TO TARGET
- Current Monthly Contribution: $${data.monthlyContribution}
- Target Amount: $${data.targetAmount}
- Estimated Timeline: [Calculate and show specific years/months]
- Required Return Rate: [Calculate based on timeline and contributions]

Remember: Be specific, avoid repetition, and provide actionable advice tailored to this exact profile.`;
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
            content: 'You are a certified financial advisor with expertise in portfolio optimization, risk management, and investment strategy. Your responses must be: 1) SPECIFIC and personalized to the exact user data provided, 2) NON-REPETITIVE with unique content in each section, 3) ACTIONABLE with measurable steps, 4) CALCULATED using the actual numbers provided (target amount, monthly contribution, time horizon). Avoid generic advice and repetitive language. Each sentence should provide new, valuable information.'
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
