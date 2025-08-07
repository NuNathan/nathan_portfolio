'use client';

import React from 'react';

interface AnalyticsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AnalyticsErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class AnalyticsErrorBoundary extends React.Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AnalyticsErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log analytics errors but don't crash the app
    console.warn('Analytics error caught:', error, errorInfo);
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics Error Details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback UI or nothing to prevent crashes
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default AnalyticsErrorBoundary;
