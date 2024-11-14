/**
 * This file contains the root router of your tRPC-backend
 */

import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  health: publicProcedure.query(() => "yay!"),
  user: router({
    // In our real world app, this would ensure that the user in the JWT also exists in the local database
    ensureUser: publicProcedure.query(() => 1),
  })
});

export type AppRouter = typeof appRouter;
