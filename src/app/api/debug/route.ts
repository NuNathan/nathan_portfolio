import { NextRequest, NextResponse } from 'next/server';
import { apiMonitor, checkEnvironmentHealth } from '@/utils/api-monitor';
import { strapiGet } from '@/utils/api-client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';

  try {
    switch (action) {
      case 'status':
        return getStatus();
      case 'test-strapi':
        return testStrapiConnection();
      case 'metrics':
        return getMetrics();
      case 'clear-metrics':
        return clearMetrics();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getStatus() {
  const health = checkEnvironmentHealth();
  const metrics = apiMonitor.getMetrics();
  const recentMetrics = metrics.slice(-10); // Last 10 calls
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: health,
    recentApiCalls: recentMetrics,
    summary: {
      totalCalls: metrics.length,
      failedCalls: apiMonitor.getFailedCalls().length,
      slowCalls: apiMonitor.getSlowCalls().length,
      averageResponseTime: apiMonitor.getAverageResponseTime(),
    }
  });
}

async function testStrapiConnection() {
  const startTime = Date.now();
  
  try {
    // Test basic connection to Strapi
    const response = await strapiGet('/posts?pagination[page]=1&pagination[pageSize]=1');
    const endTime = Date.now();
    
    return NextResponse.json({
      success: true,
      responseTime: endTime - startTime,
      status: response.status,
      dataReceived: !!response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const endTime = Date.now();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      responseTime: endTime - startTime,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function getMetrics() {
  const metrics = apiMonitor.getMetrics();
  const failedCalls = apiMonitor.getFailedCalls();
  const slowCalls = apiMonitor.getSlowCalls();
  
  return NextResponse.json({
    allMetrics: metrics,
    failedCalls,
    slowCalls,
    summary: {
      total: metrics.length,
      failed: failedCalls.length,
      slow: slowCalls.length,
      averageResponseTime: apiMonitor.getAverageResponseTime(),
      successRate: metrics.length > 0 ? 
        ((metrics.length - failedCalls.length) / metrics.length * 100).toFixed(1) + '%' : 
        'N/A'
    }
  });
}

async function clearMetrics() {
  // Note: This would require adding a clear method to ApiMonitor
  // For now, just return a message
  return NextResponse.json({
    message: 'Metrics cleared (restart required for full reset)',
    timestamp: new Date().toISOString()
  });
}
