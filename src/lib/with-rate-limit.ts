import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { getRateLimitIdentifier } from "./rate-limit";

/**
 * Higher-order function que adiciona rate limiting a uma API route
 */
export function withRateLimit(
  handler: (req: Request, context?: any) => Promise<Response>,
  rateLimiter: Ratelimit
) {
  return async (req: Request, context?: any) => {
    const identifier = getRateLimitIdentifier(req);

    const { success, limit, reset, remaining } = await rateLimiter.limit(
      identifier
    );

    const headers = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(reset).toISOString(),
    };

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        },
        {
          status: 429,
          headers,
        }
      );
    }

    const response = await handler(req, context);

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
