import type { Config } from "tailwindcss";

import baseConfig from "@probable/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
