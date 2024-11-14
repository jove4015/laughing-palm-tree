import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";
import * as Sentry from "@sentry/node";
import transformer from "../utils/transformer";
import { ZodNumericId, ZodStringId } from "./utils";

export interface Metadata {
  requiredPerms?: string[];
}

const t = initTRPC
  .context<Context>()
  .meta<Metadata>()
  .create({
    // Optional:
    transformer,
    // Optional:
    errorFormatter(opts) {
      const { shape } = opts;
      return {
        ...shape,
        data: {
          ...shape.data,
        },
      };
    },
  });

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Login required" });
  }
  return next({ ctx });
});

// check if the user is authorized, otherwise throw a UNAUTHORIZED CODE
const isAuthorized = t.middleware(async ({ next, ctx, meta }) => {
  
  return next({ ctx });
});

const hasObjectPermissions = t.middleware(async (params) => {
  const { rawInput, ctx, meta, next } = params;
  return next({ ctx });
  
});

const sentryMiddleware = t.middleware(async (params) => {
  return Sentry.trpcMiddleware({
    attachRpcInput: true,
  })(params);
});

/**
 * We recommend only exporting the functionality that we
 * use so we can enforce which base procedures should be used
 **/
export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure
  .use(sentryMiddleware)
  .use(isAuthenticated)
  .use(isAuthorized);

export const objectProcedure = publicProcedure.use(hasObjectPermissions);
