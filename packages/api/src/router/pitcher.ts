import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { sql } from "@probable/db";
import { pitcher } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const pitcherRouter = {
  byFuzzyName: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: name }) => {
      const nameQuery = name.trim().replace(/%20/g, " | ");

      return ctx.db
        .select()
        .from(pitcher)
        .where(
          sql`to_tsvector('english', ${pitcher.name}) @@ to_tsquery('english', ${nameQuery})`,
        );
    }),
} satisfies TRPCRouterRecord;
