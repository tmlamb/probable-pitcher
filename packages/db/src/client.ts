import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "development"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
});

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
