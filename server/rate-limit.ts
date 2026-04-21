type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, maxRequests = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: current.expiresAt - now };
  }

  current.count += 1;
  buckets.set(key, current);

  return { allowed: true, remaining: maxRequests - current.count };
}
