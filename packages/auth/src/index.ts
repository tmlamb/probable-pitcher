import type {
  Auth as BAAuth,
  BetterAuthOptions,
  BetterAuthPlugin,
} from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@probable/db/client";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseURL: string;
  productionURL: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
  appleClientId: string;
  appleClientSecret: string;
  appleBundleId: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseURL,
    secret: options.secret,
    plugins: [
      expo(),
      oAuthProxy({
        productionURL: options.productionURL,
      }),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.productionURL}/api/auth/callback/google`,
      },
      apple: {
        clientId: options.appleClientId,
        clientSecret: options.appleClientSecret,
        appBundleIdentifier: options.appleBundleId,
        redirectURI: `${options.productionURL}/api/auth/callback/apple`,
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
      useSecureCookies: true,
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "apple"],
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 365, // 1 year in seconds
      updateAge: 60 * 60 * 24 * 30, // Refresh every 30 days (when user is active)
    },
  } satisfies BetterAuthOptions;
  return betterAuth(config);
}

export type Auth = BAAuth;
export type Session = ReturnType<typeof initAuth>["$Infer"]["Session"];
