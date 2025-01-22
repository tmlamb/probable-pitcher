import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      VITE_API_URL: "http://nextjs.:3000",
    },
  },
});
