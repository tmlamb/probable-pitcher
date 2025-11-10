import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";

import { db } from "@probable/db/client";

export function initAuth({
  baseURL,
  secret,
  googleClientId,
  googleClientSecret,
  appleClientId,
  appleClientSecret,
  appleBundleId,
}: {
  baseURL: string;
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
    baseURL,
    secret,
    plugins: [expo(), apiKey()],
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
      apple: {
        clientId: appleClientId,
        clientSecret: appleClientSecret,
        appBundleIdentifier: appleBundleId,
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
