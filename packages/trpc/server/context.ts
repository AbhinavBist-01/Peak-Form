import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createCookieFactory, getCookieFactory, deleteCookieFactory } from "./utils/cookie";

export interface tRPCCtsUser {
  id: string;
}

export interface TRPCContext {
  createCookie: ReturnType<typeof createCookieFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
  deleteCookie: ReturnType<typeof deleteCookieFactory>;
  ip: string;

  user?: tRPCCtsUser;
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
  const ctx: TRPCContext = {
    createCookie: createCookieFactory(res),
    getCookie: getCookieFactory(req),
    deleteCookie: deleteCookieFactory(res),
    ip: req.ip ?? req.socket.remoteAddress ?? "unknown",
    user: undefined,
  };
  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
