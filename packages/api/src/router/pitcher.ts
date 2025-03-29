import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq, sql } from "@probable/db";
import { pitcher, team } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const pitcherRouter = {
  byFuzzyName: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: name }) => {
      //const partialTokens = name
      //  .split(/\s+/)
      //  .map((token) => `"${token.trim()}":*D`);
      //const exactTokens = name
      //  .split(/\s+/)
      //  .map((token) => `"${token.trim()}":A`);
      //const nameQuery = [...partialTokens, ...exactTokens].join(" | ");
      // name: Kyle    Winters
      // name: Kyle
      //const nameQueryOld = name.trim().replace(/\s+/g, "+");
      // nameQuery: Kyle | Winters
      // nameQuery: Kyle
      //const matchQuery = sql`(
      //  setweight(to_tsvector('english', ${pitcher.name})) @@ to_tsquery('english', ${nameQuery})`;

      return (
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
          //.where(sql`levenshtein(${pitcher.name}, ${name}) <= 3`)
          //.orderBy(sql`levenshtein(${pitcher.name}, ${name})`);
          //.where(sql`${pitcher.name} % ${name}`);
          .where(sql`similarity(${pitcher.name}, ${name}) > 0.1`)
          .orderBy(sql`similarity(${pitcher.name}, ${name}) DESC`)
      );
    }),
} satisfies TRPCRouterRecord;
