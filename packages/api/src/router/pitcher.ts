import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { sql } from "@probable/db";
import { pitcher } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const pitcherRouter = {
  byFuzzyName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      const query = input.name.trim().replace(/%20/g, " | ");

      return ctx.db
        .select()
        .from(pitcher)
        .where(
          sql`to_tsvector('english', ${pitcher.name}) @@ to_tsquery('english', ${query})`,
        );
    }),
} satisfies TRPCRouterRecord;
