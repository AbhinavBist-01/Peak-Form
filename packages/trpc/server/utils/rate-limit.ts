import { TRPCError } from "@trpc/server";
import { tRPCContext } from "../trpc";

const ipCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware({ max, windowMs }: { max: number; windowMs: number }) {
  return tRPCContext.middleware(async (opts) => {
    const { ctx } = opts;
    const ip = ctx.ip;
    const now = Date.now();
    const record = ipCounts.get(ip);

    if (!record || now > record.resetAt) {
      ipCounts.set(ip, { count: 1, resetAt: now + windowMs });
      return opts.next();
    }

    if (record.count >= max) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Try again later.`,
      });
    }

    record.count++;
    return opts.next();
  });
}
