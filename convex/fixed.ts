import RateLimiter, { SECOND } from "@convex-dev/rate-limiter";
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";

const limiter = new RateLimiter(components.rateLimiter, {
  fixed: { kind: "fixed window", rate: 3, period: 10 * SECOND },
});

export const { getRateLimit, getServerTime } = limiter.hookAPI("fixed");

export const getState = query({
  args: {},
  handler: async (ctx) => limiter.getValue(ctx, "fixed"),
});

export const limit = mutation({
  args: {},
  handler: async (ctx) => limiter.limit(ctx, "fixed"),
});
