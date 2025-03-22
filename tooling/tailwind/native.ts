import type { Config } from "tailwindcss";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
  theme: {},

  //theme: {},
} satisfies Config;
