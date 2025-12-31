import type { TRPCClientErrorLike } from "@trpc/client";
import * as Updates from "expo-updates";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@probable/api";

import { authClient } from "./auth";
import { getBaseUrl } from "./base-url";
import { posthog } from "./posthog";

const isUnauthorizedError = (error: unknown): boolean => {
  return (
    (error as TRPCClientErrorLike<AppRouter>).data?.code === "UNAUTHORIZED"
  );
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        authClient
          .signOut()
          .then(() => {
            Updates.reloadAsync().catch((e) => posthog.captureException(e));
          })
          .catch((e) => posthog.captureException(e));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        authClient
          .signOut()
          .then(() => {
            Updates.reloadAsync().catch((e) => posthog.captureException(e));
          })
          .catch((e) => posthog.captureException(e));
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (isUnauthorizedError(error)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),

        colorMode: "ansi",
      }),

      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          const cookies = authClient.getCookie();
          if (cookies) {
            headers.set("Cookie", cookies);
          }
          return Object.fromEntries(headers);
        },
      }),
    ],
  }),
  queryClient,
});

export type { RouterInputs, RouterOutputs } from "@probable/api";
