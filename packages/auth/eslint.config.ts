import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@probable/eslint-config/base";

export default defineConfig(
  {
    ignores: ["script/**"],
  },
  baseConfig,
  restrictEnvAccess,
);
