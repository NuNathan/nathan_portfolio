import axios from 'axios';

export interface ApiError {
  type: 'network' | 'timeout' | 'server' | 'unknown';
  message: string;
  originalError: any;
}

/**
 * Analyzes an error to determine its type and provide user-friendly messaging
 */
export function analyzeError(error: any): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'The request timed out. Please check your connection and try again.',
        originalError: error
      };
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !error.response) {
      return {
        type: 'network',
        message: 'Unable to connect to the server. Please check your internet connection.',
        originalError: error
      };
    }
    
    if (error.response) {
      const status = error.response.status;
      if (status >= 500) {
        return {
          type: 'server',
          message: 'The server is experiencing issues. Please try again later.',
          originalError: error
        };
      }
      
      if (status === 404) {
        return {
          type: 'server',
          message: 'The requested resource was not found.',
          originalError: error
        };
      }
      
      if (status === 401 || status === 403) {
        return {
          type: 'server',
          message: 'Authentication failed. Please contact support.',
          originalError: error
        };
      }
    }
  }
  
  // Check for common error patterns
  const errorMessage = error?.message || String(error);
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return {
      type: 'network',
      message: 'Network connection failed. Please check your internet connection.',
      originalError: error
    };
  }
  
  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error
  };
}

/**
 * Checks if an error indicates the API is likely down
 */
export function isApiDownError(error: any): boolean {
  const analyzed = analyzeError(error);
  return analyzed.type === 'network' || analyzed.type === 'timeout';
}

/**
 * Creates a standardized error response for API failures
 */
export function createErrorResponse(error: any, fallbackData?: any) {
  const analyzed = analyzeError(error);
  
  console.error(`API Error (${analyzed.type}):`, analyzed.message, analyzed.originalError);
  
  return {
    success: false,
    error: analyzed,
    data: fallbackData || null
  };
}

/**
 * Wraps an API call with standardized error handling
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  fallbackData?: T
): Promise<{ success: boolean; data: T | null; error?: ApiError }> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    const analyzed = analyzeError(error);
    
    console.error(`API call failed (${analyzed.type}):`, analyzed.message);
    
    return {
      success: false,
      data: fallbackData || null,
      error: analyzed
    };
  }
}

/**
 * Simple health check for the Strapi API
 */
export async function checkStrapiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.STRAPI_API_URL}/posts?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
