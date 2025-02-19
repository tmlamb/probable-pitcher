import type { Config } from "tailwindcss";

import base from "./base";

export default {
  content: base.content,
  darkMode: base.darkMode,
  theme: base.theme,
  //presets: [base],
  //theme: {},
} satisfies Config;
