import { defineConfig } from "eslint/config";

import { baseConfig } from "@probable/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
