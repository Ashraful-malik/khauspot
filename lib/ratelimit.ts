import { redis } from "./redis";

export async function rateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowSecond: number,
) {
  const key = `ratelimit:${action}:${identifier}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSecond);
  }
  if (current > limit) {
    throw new Error("Rate limit exceeded");
  }
}
