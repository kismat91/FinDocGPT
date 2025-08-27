import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY ? 'SET' : 'NOT SET',
    GROQ_API_KEY: process.env.GROQ_API_KEY ? 'SET' : 'NOT SET',
    NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWSAPI_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  };
  
  return NextResponse.json({
    message: 'Environment variables test',
    envVars,
    timestamp: new Date().toISOString()
  });
}
