import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@probable/db";
import { CreateGameSchema, Game } from "@probable/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.Game.findMany({
      orderBy: desc(Game.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));

      return ctx.db.query.Game.findFirst({
        where: eq(Game.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateGameSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Game).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Game).where(eq(Game.id, input));
  }),
} satisfies TRPCRouterRecord;
