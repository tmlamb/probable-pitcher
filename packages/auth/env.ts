import { createEnv } from "@t3-oss/env-core";
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
      BETTER_AUTH_PRODUCTION_URL: z.string().min(1),
      NODE_ENV: z.enum(["development", "production"]).optional(),
    },
    runtimeEnv: process.env,
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
