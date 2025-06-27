// API monitoring and debugging utilities

interface ApiCallMetrics {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  error?: string;
  retryCount?: number;
}

class ApiMonitor {
  private static instance: ApiMonitor;
  private metrics: ApiCallMetrics[] = [];
  private maxMetrics = 100; // Keep last 100 API calls

  static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor();
    }
    return ApiMonitor.instance;
  }

  startCall(url: string, method: string = 'GET'): string {
    const callId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: ApiCallMetrics = {
      url,
      method,
      startTime: Date.now(),
    };
    
    this.metrics.push(metric);
    
    // Keep only the last maxMetrics entries
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    return callId;
  }

  endCall(url: string, status?: number, error?: string, retryCount?: number) {
    const metric = this.metrics.find(m => m.url === url && !m.endTime);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.status = status;
      metric.error = error;
      metric.retryCount = retryCount;
      
      // Log slow API calls (> 5 seconds)
      if (metric.duration > 5000) {
        console.warn(`Slow API call detected: ${url} took ${metric.duration}ms`);
      }
      
      // Log failed API calls
      if (error || (status && status >= 400)) {
        console.error(`API call failed: ${url}`, { status, error, duration: metric.duration });
      }
    }
  }

  getMetrics(): ApiCallMetrics[] {
    return [...this.metrics];
  }

  getSlowCalls(threshold: number = 3000): ApiCallMetrics[] {
    return this.metrics.filter(m => m.duration && m.duration > threshold);
  }

  getFailedCalls(): ApiCallMetrics[] {
    return this.metrics.filter(m => m.error || (m.status && m.status >= 400));
  }

  getAverageResponseTime(): number {
    const completedCalls = this.metrics.filter(m => m.duration);
    if (completedCalls.length === 0) return 0;
    
    const totalTime = completedCalls.reduce((sum, m) => sum + (m.duration || 0), 0);
    return totalTime / completedCalls.length;
  }

  logSummary() {
    const total = this.metrics.length;
    const completed = this.metrics.filter(m => m.endTime).length;
    const failed = this.getFailedCalls().length;
    const slow = this.getSlowCalls().length;
    const avgTime = this.getAverageResponseTime();

    console.log('API Call Summary:', {
      total,
      completed,
      failed,
      slow,
      averageResponseTime: `${avgTime.toFixed(2)}ms`,
      successRate: `${((completed - failed) / completed * 100).toFixed(1)}%`
    });
  }
}

// Enhanced fetch wrapper with monitoring
export async function monitoredFetch(
  url: string, 
  options?: RequestInit,
  retryCount: number = 0
): Promise<Response> {
  const monitor = ApiMonitor.getInstance();
  monitor.startCall(url, options?.method || 'GET');
  
  try {
    const response = await fetch(url, options);
    monitor.endCall(url, response.status, undefined, retryCount);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    monitor.endCall(url, undefined, errorMessage, retryCount);
    throw error;
  }
}

// Export the monitor instance for debugging
export const apiMonitor = ApiMonitor.getInstance();

// Helper function to log API performance in development
export function logApiPerformance() {
  if (process.env.NODE_ENV === 'development') {
    apiMonitor.logSummary();
  }
}

// Helper to check if we're in a problematic environment
export function checkEnvironmentHealth() {
  const issues: string[] = [];
  
  // Check required environment variables
  if (!process.env.STRAPI_API_URL) {
    issues.push('STRAPI_API_URL not set');
  }
  
  if (!process.env.STRAPI_TOKEN) {
    issues.push('STRAPI_TOKEN not set');
  }
  
  if (!process.env.STRAPI_URL) {
    issues.push('STRAPI_URL not set');
  }
  
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    isHealthy: issues.length === 0,
    issues,
    isProduction,
    environment: process.env.NODE_ENV || 'unknown'
  };
}
