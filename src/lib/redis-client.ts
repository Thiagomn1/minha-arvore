import { Redis } from "@upstash/redis";

/**
 * Cliente Redis configurável para usar Upstash Redis (produção) ou Redis local (desenvolvimento/Docker)
 */

function createRedisClient() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  if (process.env.REDIS_URL) {
    const redisUrl = process.env.REDIS_URL;
    const url = new URL(redisUrl);

    return new Redis({
      url: `https://${url.hostname}:${url.port || 6379}`,
      token: "",
    });
  }

  return undefined;
}

export const redis = createRedisClient();
