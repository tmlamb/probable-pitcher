import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@probable/db/client"; // your drizzle instance
import { env } from "../env";
import { oAuthProxy } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [oAuthProxy(), expo()],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      redirectURI: "https://dev.probable-pitcher.com/api/auth/callback/github",
    },
  },
  trustedOrigins: ["probablepitcher://"],
  logger: {
    level: "debug",
    disabled: false,
  },
  //cookiePrefix: "probable-pitcher",
});

export type Session = typeof auth.$Infer.Session;
