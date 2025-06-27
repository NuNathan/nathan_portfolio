import axios, { AxiosRequestConfig } from 'axios';
import { apiMonitor } from './api-monitor';

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Default axios configuration with timeout and headers
const defaultAxiosConfig: AxiosRequestConfig = {
  timeout: 15000, // 15 second timeout
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
};

// Retry function for failed requests with exponential backoff
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000,
  url?: string
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();

      // Log successful retry if this wasn't the first attempt
      if (attempt > 0 && url) {
        console.log(`API request succeeded on attempt ${attempt + 1}: ${url}`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`API request attempt ${attempt + 1} failed${url ? ` for ${url}` : ''}:`, error);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = delay * Math.pow(2, attempt);
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}

// Enhanced axios client with retry logic
export async function apiGet(url: string, config?: AxiosRequestConfig) {
  const mergedConfig = { ...defaultAxiosConfig, ...config };

  // Start monitoring
  const callId = apiMonitor.startCall(url, 'GET');

  try {
    const result = await retryRequest(() => axios.get(url, mergedConfig), 2, 1000, url);
    apiMonitor.endCall(url, result.status);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    apiMonitor.endCall(url, undefined, errorMessage);
    throw error;
  }
}

// Specific function for Strapi API calls
export async function strapiGet(endpoint: string, config?: AxiosRequestConfig) {
  const STRAPI_URL = process.env.STRAPI_API_URL;
  
  if (!STRAPI_URL) {
    throw new Error('STRAPI_API_URL environment variable is not set');
  }
  
  const url = `${STRAPI_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  return apiGet(url, config);
}

// Helper function to check if error is a timeout
export function isTimeoutError(error: any): boolean {
  return error?.code === 'ECONNABORTED' || 
         error?.message?.includes('timeout') ||
         error?.response?.status === 408;
}

// Helper function to check if error is a network error
export function isNetworkError(error: any): boolean {
  return error?.code === 'ENOTFOUND' || 
         error?.code === 'ECONNREFUSED' ||
         error?.code === 'ECONNRESET' ||
         !error?.response;
}
