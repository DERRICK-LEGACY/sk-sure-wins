/**
 * In-memory rate limiter for server-side protection.
 * Tracks attempts per key (IP, phone, etc.) within a sliding time window.
 * 
 * For production at scale, replace with Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  ADMIN_LOGIN: { maxAttempts: 5, windowSeconds: 15 * 60 } as RateLimitConfig,     // 5 attempts per 15 min
  VIP_LOGIN: { maxAttempts: 10, windowSeconds: 15 * 60 } as RateLimitConfig,      // 10 attempts per 15 min
  PAYMENT_REQUEST: { maxAttempts: 3, windowSeconds: 60 } as RateLimitConfig,       // 3 per minute
  API_GENERAL: { maxAttempts: 60, windowSeconds: 60 } as RateLimitConfig,          // 60 per minute
  SUBMIT_TESTIMONIAL: { maxAttempts: 5, windowSeconds: 60 * 60 } as RateLimitConfig, // 5 per hour
} as const;

export function checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First attempt or window expired — reset
    store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= config.maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
