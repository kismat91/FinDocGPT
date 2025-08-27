import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Test API is working',
    timestamp: new Date().toISOString(),
    env: {
      TWELVE_DATA_API_KEY: process.env.TWELVE_DATA_API_KEY ? 'SET' : 'NOT SET'
    }
  });
}
