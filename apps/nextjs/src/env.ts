import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

import { authEnv } from "@probable/auth/env";

export const env = createEnv({
  extends: [authEnv()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    DATABASE_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_IOS_APP_STORE_ID: z.string(),
    NEXT_PUBLIC_ANDROID_PACKAGE_NAME: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't
   * tree-shaken away.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_IOS_APP_STORE_ID: process.env.NEXT_PUBLIC_IOS_APP_STORE_ID,
    NEXT_PUBLIC_ANDROID_PACKAGE_NAME:
      process.env.NEXT_PUBLIC_ANDROID_PACKAGE_NAME,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
