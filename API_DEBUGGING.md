# API Debugging Guide

## Overview
This guide helps debug API timeout issues in production environments.

## Changes Made

### 1. Timeout Configuration
- **Axios calls**: 15-second timeout with retry logic (2 retries with exponential backoff)
- **Client-side fetch**: 20-second timeout using AbortSignal
- **Server-side fetch**: 20-second timeout using AbortSignal
- **Vercel functions**: 30-second maximum duration

### 2. Retry Logic
- Automatic retry on failed requests (up to 2 retries)
- Exponential backoff (1s, 2s, 4s delays)
- Detailed logging of retry attempts

### 3. Enhanced Error Handling
- Specific error type detection (timeout vs network errors)
- Detailed error logging for production debugging
- Graceful fallbacks when APIs fail

### 4. Monitoring & Debugging
- API call monitoring with performance metrics
- Debug endpoint for production troubleshooting
- Environment health checks

## Debug Endpoints

### Check API Status
```
GET /api/debug?action=status
```
Returns environment health, recent API calls, and performance summary.

### Test Strapi Connection
```
GET /api/debug?action=test-strapi
```
Tests direct connection to Strapi and measures response time.

### Get Detailed Metrics
```
GET /api/debug?action=metrics
```
Returns all API call metrics, failed calls, and slow calls.

## Common Issues & Solutions

### 1. Timeout Errors
**Symptoms**: API calls taking forever, eventual timeout
**Causes**: 
- Slow Strapi server response
- Network connectivity issues
- Complex database queries in Strapi

**Solutions**:
- Check Strapi server performance
- Optimize database queries
- Consider caching strategies

### 2. Network Errors
**Symptoms**: Connection refused, DNS resolution failures
**Causes**:
- Strapi server down
- Incorrect environment variables
- Network connectivity issues

**Solutions**:
- Verify Strapi server is running
- Check environment variables
- Test network connectivity

### 3. Environment Variable Issues
**Symptoms**: Authentication errors, incorrect URLs
**Causes**:
- Missing or incorrect environment variables
- Different values between local and production

**Solutions**:
- Verify all required environment variables are set
- Check values match between environments

## Environment Variables Required
```
STRAPI_API_URL=https://your-strapi-api.com/api
STRAPI_URL=https://your-strapi-api.com
STRAPI_TOKEN=your-strapi-token
NEXT_PUBLIC_BASE_URL=https://your-nextjs-app.com
```

## Monitoring in Production

### 1. Check Debug Status
Visit: `https://your-domain.com/api/debug?action=status`

### 2. Test Strapi Connection
Visit: `https://your-domain.com/api/debug?action=test-strapi`

### 3. View Performance Metrics
Visit: `https://your-domain.com/api/debug?action=metrics`

## Performance Optimizations

### 1. Query Optimization
- Limit populate parameters to only needed fields
- Use pagination to reduce response size
- Consider server-side filtering vs client-side

### 2. Caching Strategy
- Implement Redis caching for frequently accessed data
- Use Next.js ISR (Incremental Static Regeneration)
- Cache API responses at CDN level

### 3. Connection Pooling
- Configure axios with connection pooling
- Reuse connections where possible
- Monitor connection limits

## Troubleshooting Steps

1. **Check Environment Health**
   ```bash
   curl https://your-domain.com/api/debug?action=status
   ```

2. **Test Strapi Connection**
   ```bash
   curl https://your-domain.com/api/debug?action=test-strapi
   ```

3. **Monitor API Performance**
   ```bash
   curl https://your-domain.com/api/debug?action=metrics
   ```

4. **Check Vercel Function Logs**
   - Go to Vercel dashboard
   - Check function logs for errors
   - Look for timeout patterns

5. **Verify Environment Variables**
   - Check Vercel environment variables
   - Ensure they match local development

## Next Steps

If issues persist:
1. Enable more detailed logging
2. Consider implementing Redis caching
3. Optimize Strapi database queries
4. Consider using a CDN for static assets
5. Implement health checks for Strapi server
