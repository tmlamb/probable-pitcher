import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@probable/eslint-config/base";
import { nextjsConfig } from "@probable/eslint-config/nextjs";
import { reactConfig } from "@probable/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
