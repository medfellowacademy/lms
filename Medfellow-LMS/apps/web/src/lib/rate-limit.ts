// Simple in-memory rate limiter for API routes
// For production, use Redis-based rate limiting (e.g., @upstash/ratelimit)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // Standard API endpoints
  default: { interval: 60 * 1000, maxRequests: 60 },
  
  // AI endpoints (more restrictive)
  ai: { interval: 60 * 1000, maxRequests: 20 },
  
  // Auth endpoints (very restrictive)
  auth: { interval: 15 * 60 * 1000, maxRequests: 10 },
  
  // Upload endpoints
  upload: { interval: 60 * 1000, maxRequests: 10 },
  
  // Webhook endpoints (generous)
  webhook: { interval: 60 * 1000, maxRequests: 1000 },
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const key = identifier;
  
  const entry = rateLimitStore.get(key);
  
  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }
  
  if (!entry || now > entry.resetTime) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.interval,
    });
    
    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: Math.ceil((now + config.interval) / 1000),
    };
  }
  
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(entry.resetTime / 1000),
    };
  }
  
  entry.count++;
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    reset: Math.ceil(entry.resetTime / 1000),
  };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Rate limit response helper
export function rateLimitResponse(remaining: number, reset: number) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset * 1000 - Date.now()) / 1000).toString(),
      },
    }
  );
}

