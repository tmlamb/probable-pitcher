import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq } from "@probable/db";
import { subscription } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const subscriptionRouter = {
  byUserId: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.subscription.findMany({
      where: eq(subscription.userId, ctx.session.user.id),
      with: {
        pitcher: {
          with: {
            homeGames: true,
            awayGames: true,
            team: {
              columns: {
                name: true,
                id: true,
                abbreviation: true,
              },
            },
          },
          columns: {
            id: true,
            name: true,
            number: true,
            teamId: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        pitcherId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(subscription)
        .values({ userId: ctx.session.user.id, ...input });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(subscription)
        .where(
          and(
            eq(subscription.id, input.subscriptionId),
            eq(subscription.userId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
