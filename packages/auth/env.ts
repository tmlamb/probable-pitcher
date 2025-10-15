import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function authEnv() {
  return createEnv({
    server: {
      AUTH_GOOGLE_ID: z.string().min(1),
      AUTH_GOOGLE_SECRET: z.string().min(1),
      AUTH_APPLE_SERVICE_ID: z.string().min(1),
      AUTH_APPLE_BUNDLE_ID: z.string().min(1),
      AUTH_APPLE_SECRET: z.string().min(1),
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.string().min(1),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    runtimeEnv: {
      AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
      AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
      AUTH_APPLE_BUNDLE_ID: process.env.AUTH_APPLE_BUNDLE_ID,
      AUTH_APPLE_SERVICE_ID: process.env.AUTH_APPLE_SERVICE_ID,
      AUTH_APPLE_SECRET: process.env.AUTH_APPLE_SECRET,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
