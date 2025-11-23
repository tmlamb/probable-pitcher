import { defineConfig } from "eslint/config";

import { baseConfig } from "@probable/eslint-config/base";
import { reactConfig } from "@probable/eslint-config/react";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
