import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ErrorBoundary from "~/components/error/ErrorBoundary";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ContextProvider } from "~/context/provider";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "~/server/routers/_app";
import * as Sentry from "@sentry/nextjs";
import { httpLink } from "@trpc/client/links/httpLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { SSRContext, getBaseUrl } from "../utils/trpc";
import transformer from "../utils/transformer";

declare global {
  // eslint-disable-next-line no-var
  var __ENV: Record<string, string>;
}

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div>
      <ErrorBoundary>
        <PostHogProvider client={posthog}>
          <ClerkProvider
            publishableKey={
              typeof window !== "undefined"
                ? window.__ENV.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            }
            signInUrl={
              typeof window !== "undefined"
                ? window.__ENV.NEXT_PUBLIC_CLERK_SIGN_IN_URL
                : process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL
            }
            signUpFallbackRedirectUrl={
              typeof window !== "undefined"
                ? window.__ENV.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
                : process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
            }
            dynamic
          >
            <ContextProvider>
              <Component {...pageProps} />
            </ContextProvider>
          </ClerkProvider>
        </PostHogProvider>
      </ErrorBoundary>
    </div>
  );
};

export default withTRPC<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          mutations: {
            onError: (error) => {
              Sentry.captureException(error);
              console.error("TRPC mutation error: ");
            },
          },
          queries: {
            refetchOnWindowFocus: false,
            onError: (error) => {
              Sentry.captureException(error);
              console.error("TRPC query error: ");
            },
          },
        },
      },
      links: [
        splitLink({
          condition(op) {
            return op.context.useCache === true;
          },
          true: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
          false: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
      transformer,
    };
  },
  ssr: true,
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;

    if (ctx.status) {
      return {
        status: ctx.status,
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }
    return {};
  },
})(App);
