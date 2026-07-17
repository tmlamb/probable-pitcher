import { defineConfig } from "eslint/config";

import { baseConfig } from "@probable/eslint-config/base";

export default defineConfig(baseConfig, {
  files: ["**/*.ts"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "turbo/no-undeclared-env-vars": "off",
  },
});
