import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";
import { getAuthCookie } from "./utils/cookie";
import { userService } from "./services";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;
export const authenticatedProcedure = tRPCContext.procedure.use(async (opts) => {
  const { ctx } = opts;
  const userToken = getAuthCookie(ctx);
  if (!userToken) throw new Error("User is not authenticated");

  const { id } = await userService.verifyAndDecodeUserToken(userToken);

  return opts.next({
    ctx: {
      ...ctx,
      user: { id },
    },
  });
});
