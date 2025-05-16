import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";

import { db } from "@probable/db/client";

import { env } from "../env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [expo(), apiKey()],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
    apple: {
      clientId: env.AUTH_APPLE_SERVICE_ID,
      clientSecret: env.AUTH_APPLE_SECRET,
      appBundleIdentifier: env.AUTH_APPLE_BUNDLE_ID,
    },
  },
  trustedOrigins: [
    "probablepitcher://",
    "https://dev.probablepitcher.com",
    "https://probablepitcher.com",
    "http://localhost:3000",
    "https://appleid.apple.com",
  ],
  logger: {
    level: "debug",
    disabled: true,
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
});

export type Session = typeof auth.$Infer.Session;
