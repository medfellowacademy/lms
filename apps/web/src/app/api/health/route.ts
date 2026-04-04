import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/health - Health check endpoint for production monitoring
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    let dbStatus = 'healthy';
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      // Mock database health check
      await prisma.user.findFirst();
      dbLatency = Date.now() - dbStart;
    } catch {
      dbStatus = 'unhealthy';
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    // Overall status
    const healthy = dbStatus === 'healthy';
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
        api: {
          status: 'healthy',
          responseTime: `${responseTime}ms`,
        },
      },
      system: {
        memory: {
          used: `${heapUsedMB}MB`,
          total: `${heapTotalMB}MB`,
          percentage: `${memoryPercentage}%`,
        },
        nodejs: process.version,
        platform: process.platform,
      },
    }, {
      status: healthy ? 200 : 503,
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    }, {
      status: 503,
    });
  }
}

