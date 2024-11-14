import type { Context } from "./context";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export function siteAdminGuard(ctx: Context) {
  if (!ctx.session?.isSiteAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Site Admin access required",
    });
  }
}


export type ErrorCode = TRPC_ERROR_CODE_KEY;

export class KiefaError extends Error {
  public readonly cause?: Error;
  public readonly code;

  constructor(opts: { code: ErrorCode; message?: string; cause?: Error }) {
    const message = opts.message ?? opts.cause?.message ?? opts.code;

    // @ts-ignore https://github.com/tc39/proposal-error-cause
    super(message, { cause: opts.cause });

    this.code = opts.code;
    this.name = "KiefaError";
  }
}

export function fromError(
  error: Error & { code?: TRPC_ERROR_CODE_KEY },
): TRPCError {
  const err = new TRPCError({
    code: error.code ?? "INTERNAL_SERVER_ERROR", // https://trpc.io/docs/server/error-handling#error-codes
    message: error.message,
    cause: error.cause,
  });

  err.stack = error.stack;
  return err;
}

export async function shrinkWrap<F extends () => any>(
  impl: () => ReturnType<F>,
) {
  try {
    return await impl();
  } catch (e: any) {
    if (e instanceof TRPCError) {
      throw e;
    }
    if (e instanceof KiefaError) {
      throw fromError(e);
    }
   
    if (e instanceof Error) {
      throw fromError(e);
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
      });
    }
  }
}

export const ZodNumericId = z.object({
  id: z.number(),
});

export const ZodStringId = z.object({
  id: z.string(),
});

export const ZodBigIntId = z.object({
  id: z.bigint(),
});
