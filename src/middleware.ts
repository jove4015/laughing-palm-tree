import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isApiRoute = createRouteMatcher(["/api/(.*)"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isApiRoute(req) && !isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    signInUrl: "/sign-in",
  },
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
