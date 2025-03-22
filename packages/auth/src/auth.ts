import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@probable/db/client"; // your drizzle instance
import { env } from "../env";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [expo()],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      //redirectURI: "https://dev.probablepitcher.com/api/auth/callback/google",
    },
    apple: {
      clientId: env.AUTH_APPLE_WEB_ID,
      clientSecret: env.AUTH_APPLE_SECRET,
      appBundleIdentifier: env.AUTH_APPLE_ID,
      //redirectURI: "https://dev.probablepitcher.com/api/auth/callback/apple",
    },
  },
  trustedOrigins: [
    "probablepitcher://",
    "https://dev.probablepitcher.com",
    "https://probablepitcher.com",
    "http://localhost:3000",
  ],
  logger: {
    level: "debug",
    disabled: false,
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
