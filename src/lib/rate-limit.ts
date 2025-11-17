import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Configuração do Redis (se disponível via env vars)
// Se não houver Redis configurado, usa Map em memória (apenas para desenvolvimento)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : undefined;

// Rate limiter para login (5 tentativas por 15 minutos)
export const loginRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:login",
    })
  : new Ratelimit({
      redis: new Map() as any, // Fallback para desenvolvimento sem Redis
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: false,
      prefix: "ratelimit:login",
    });

// Rate limiter para registro (3 registros por hora)
export const registerRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit:register",
    })
  : new Ratelimit({
      redis: new Map() as any, // Fallback para desenvolvimento sem Redis
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: false,
      prefix: "ratelimit:register",
    });

// Rate limiter geral para API (100 requests por 1 minuto)
export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:api",
    })
  : new Ratelimit({
      redis: new Map() as any, // Fallback para desenvolvimento sem Redis
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: false,
      prefix: "ratelimit:api",
    });

/**
 * Obtém o identificador único para rate limiting
 * Usa IP se disponível, caso contrário usa um identificador genérico
 */
export function getRateLimitIdentifier(request: Request): string {
  // Tenta pegar o IP real através dos headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback para desenvolvimento
  return "127.0.0.1";
}
