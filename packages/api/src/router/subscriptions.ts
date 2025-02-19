import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@probable/db";
import { createSubscriptionSchema, subscription } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const subscriptionRouter = {
  byUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.notification.findMany({
      where: eq(subscription.userId, ctx.session.user.id),
    });
  }),
  create: protectedProcedure
    .input(createSubscriptionSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(subscription).values(input);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input: subscriptionId }) => {
      return ctx.db
        .delete(subscription)
        .where(
          and(
            eq(subscription.id, subscriptionId),
            eq(subscription.userId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
