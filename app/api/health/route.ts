import { NextResponse } from "next/server";

// Health check endpoint for monitoring and Docker health checks
export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      platform: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      services: {
        // Check if required environment variables are set
        newsApi: !!process.env.NEXT_PUBLIC_NEWSAPI_KEY,
        twelveData: !!process.env.TWELVE_DATA_API_KEY,
        groqApi: !!process.env.NEXT_PUBLIC_GROK_API_KEY,
      }
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
