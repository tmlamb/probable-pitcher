import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, oAuthProxy } from "better-auth/plugins";

import { db } from "@probable/db/client";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
  appleClientId: string;
  appleClientSecret: string;
  appleBundleId: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
        currentURL: options.baseUrl,
      }),
      expo(),
      apiKey(),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/google`,
      },
      apple: {
        clientId: options.appleClientId,
        clientSecret: options.appleClientSecret,
        appBundleIdentifier: options.appleBundleId,
        redirectURI: `${options.productionUrl}/api/auth/callback/apple`,
      },
    },
    trustedOrigins: [
      "probablepitcher://",
      "https://dev.probablepitcher.com",
      "https://probablepitcher.com",
      "http://localhost:3000",
      "https://appleid.apple.com",
    ],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
    advanced: {
      cookiePrefix: "probable-pitcher",
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "apple"],
      },
    },
  } satisfies BetterAuthOptions;
  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
