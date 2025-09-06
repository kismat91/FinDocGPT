import { NextResponse } from 'next/server';

interface StrategyRequest {
  strategyType?: string;
  riskLevel?: string;
  investmentAmount?: number;
  riskProfile?: string;
  investmentGoals?: string;
  timeHorizon?: string;
  currentPortfolio?: any;
  targetAmount?: number;
  monthlyContribution?: number;
}

export async function POST(request: Request) {
  try {
    const body: StrategyRequest = await request.json();
    const { 
      strategyType = "moderate",
      riskLevel = "medium",
      investmentAmount = 10000,
      riskProfile, 
      investmentGoals, 
      timeHorizon, 
      currentPortfolio, 
      targetAmount,
      monthlyContribution 
    } = body;

    // Map legacy parameters to new format if needed
    const mappedStrategyType = strategyType || (riskProfile?.toLowerCase() === 'conservative' ? 'conservative' : 
                                              riskProfile?.toLowerCase() === 'aggressive' ? 'aggressive' : 'moderate');
    const mappedRiskLevel = riskLevel || (riskProfile?.toLowerCase() || 'medium');
    const mappedAmount = investmentAmount || targetAmount || 10000;

    // Call the Python backend for strategy generation
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001';
    
    const response = await fetch(`${backendUrl}/api/strategy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategyType: mappedStrategyType,
        riskLevel: mappedRiskLevel,
        investmentAmount: mappedAmount
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Add legacy fields for backward compatibility
    return NextResponse.json({
      ...result,
      riskProfile: mappedRiskLevel,
      investmentGoals: investmentGoals || 'Growth and income',
      timeHorizon: timeHorizon || '5-10 years'
    });

  } catch (error) {
    console.error('Error generating strategy:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate investment strategy', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}


