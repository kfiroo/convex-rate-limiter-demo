import RateLimiter, { SECOND } from "@convex-dev/rate-limiter";
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";

const limiter = new RateLimiter(components.rateLimiter, {
  bucket: { kind: "token bucket", rate: 3, period: 10 * SECOND },
});

export const { getRateLimit, getServerTime } = limiter.hookAPI("bucket");

export const getState = query({
  args: {},
  handler: async (ctx) => limiter.getValue(ctx, "bucket"),
});

export const limit = mutation({
  args: {},
  handler: async (ctx) => limiter.limit(ctx, "bucket"),
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => limiter.reset(ctx, "bucket"),
});
