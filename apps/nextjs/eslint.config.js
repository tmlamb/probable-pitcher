import baseConfig, { restrictEnvAccess } from "@probable/eslint-config/base";
import nextjsConfig from "@probable/eslint-config/nextjs";
import reactConfig from "@probable/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
