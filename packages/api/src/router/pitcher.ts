import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq, sql } from "@probable/db";
import { pitcher, team } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const pitcherRouter = {
  byFuzzyName: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: name }) => {
      const nameQuery = name.trim().replace(/%20/g, " | ");

      return ctx.db
        .select({
          id: pitcher.id,
          name: pitcher.name,
          teamId: pitcher.teamId,
          number: pitcher.number,
          teamAbbreviation: team.abbreviation,
        })
        .from(pitcher)
        .innerJoin(team, eq(pitcher.teamId, team.id))
        .where(
          sql`to_tsvector('english', ${pitcher.name}) @@ to_tsquery('english', ${nameQuery})`,
        );
    }),
} satisfies TRPCRouterRecord;
