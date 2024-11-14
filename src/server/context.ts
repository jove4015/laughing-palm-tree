import * as trpcNext from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { logger } from "~/utils/logger";
import { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/core";
import { kiefaCustomJWTTemplate } from "~/context/types";

export type contextSession = {
  userId: string;
  organizationId: string;
  sessionId: string;
  isSiteAdmin: boolean;
  facilities: number[];
  teamId?: number;
};

type WrappedLogger = ReturnType<typeof logger>;

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse<any>;
  splitLink: boolean;
  session?: contextSession;
  logger: WrappedLogger;
}

export async function createContextInner(
  _opts: trpcNext.CreateNextContextOptions & {
    splitLink?: boolean;
    session?: contextSession;
    logger: WrappedLogger;
  },
): Promise<Context> {

  return {
    req: _opts?.req,
    res: _opts?.res,
    splitLink: _opts?.splitLink || false,
    session: _opts.session,
    logger: _opts.logger,
  };
}

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const auth = getAuth(opts.req);
  const span = Sentry.getActiveTransaction()?.spanId;
  const contextLogger = logger(span);
  const user = auth.userId?.toString();
  const organization = auth.sessionClaims?.org_id;
  Sentry.configureScope((scope) => {
    scope.setTag("organization_id", organization);
    scope.setUser({ id: user, org: organization });
  });
  const claims = (auth.sessionClaims as kiefaCustomJWTTemplate) ?? undefined;

  const session: contextSession = {
    userId: user ?? "",
    organizationId: organization ?? "",
    sessionId: auth.sessionId || "", 
    isSiteAdmin: claims?.siteAdmin ?? false,
    facilities: claims?.facilities ?? [],
    teamId: claims?.teamId,
  };
  return await createContextInner({
    req: opts.req,
    res: opts.res,
    session,
    logger: contextLogger,
  });
};
