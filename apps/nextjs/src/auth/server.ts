import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";
import { apiKey } from "better-auth/plugins";

import { initAuth } from "@probable/auth";

import { env } from "~/env";

const baseURL = env.BETTER_AUTH_URL;
const productionURL = env.BETTER_AUTH_PRODUCTION_URL;

export const auth = initAuth({
  baseURL,
  productionURL,
  secret: env.BETTER_AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  appleClientId: env.AUTH_APPLE_SERVICE_ID,
  appleClientSecret: env.AUTH_APPLE_SECRET,
  appleBundleId: env.AUTH_APPLE_BUNDLE_ID,
  extraPlugins: [
    nextCookies(),
    ...(env.BETTER_AUTH_URL === "http://localhost:3000"
      ? [
          apiKey({
            enableSessionForAPIKeys: true,
          }),
        ]
      : []),
  ],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
