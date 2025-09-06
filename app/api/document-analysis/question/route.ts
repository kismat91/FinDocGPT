import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, documentAnalysis, fileName } = body;
    
    if (!question || !documentAnalysis || !fileName) {
      return NextResponse.json(
        { error: 'Missing required parameters: question, documentAnalysis, fileName' },
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

    // Create Q&A prompt
    const prompt = `Based on the following document analysis, please answer this question:

Document: ${fileName}
Analysis: ${documentAnalysis}

Question: ${question}

Please provide a comprehensive, accurate answer based solely on the information in the document analysis. If the question cannot be answered from the available information, please state that clearly.`;

    // Get AI answer
    const answer = await getAIAnswer(prompt, groqApiKey);
    
    return NextResponse.json({
      success: true,
      question: question,
      answer: answer,
      fileName: fileName,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function getAIAnswer(prompt: string, apiKey: string): Promise<string> {
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
            content: 'You are a financial document analysis expert. Answer questions based only on the provided document analysis. Be precise, helpful, and professional. If you cannot answer a question based on the available information, clearly state that.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Failed to generate answer';
    
  } catch (error) {
    console.error('Groq API error:', error);
    throw new Error('Failed to get AI answer');
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Document Q&A API is ready',
    description: 'Ask questions about your analyzed documents',
    maxQuestionLength: 500,
    supportedFormats: ['text questions']
  });
}
