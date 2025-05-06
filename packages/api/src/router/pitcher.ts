import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq, ilike, or, sql } from "@probable/db";
import { pitcher, team } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const pitcherRouter = {
  byFuzzyName: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: name }) =>
      ctx.db
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
          or(
            sql`similarity(${pitcher.name}, ${name}) > 0.25`,
            ilike(pitcher.name, `%${name}%`),
            ilike(team.name, `%${name}%`),
            eq(team.abbreviation, name.toUpperCase()),
          ),
        )
        .orderBy(sql`similarity(${pitcher.name}, ${name}) DESC`)
        .limit(30),
    ),
} satisfies TRPCRouterRecord;
