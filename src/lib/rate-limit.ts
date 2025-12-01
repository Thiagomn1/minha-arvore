import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedisClient() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  if (process.env.REDIS_URL) {
    return Redis.fromEnv();
  }

  return undefined;
}

const redis = createRedisClient();

export const loginRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:login",
    })
  : new Ratelimit({
      redis: new Map() as any,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: false,
      prefix: "ratelimit:login",
    });

export const registerRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit:register",
    })
  : new Ratelimit({
      redis: new Map() as any,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: false,
      prefix: "ratelimit:register",
    });

export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:api",
    })
  : new Ratelimit({
      redis: new Map() as any,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: false,
      prefix: "ratelimit:api",
    });

/**
 * Obtém o identificador único para rate limiting
 * Usa IP se disponível, caso contrário usa um identificador genérico
 */
export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}
