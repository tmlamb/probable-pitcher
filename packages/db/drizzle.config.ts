import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const nonPoolingUrl = process.env.DATABASE_URL;

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
} satisfies Config;
