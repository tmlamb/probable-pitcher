import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@probable/db";
import { createDeviceSchema, device } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";
import { z } from "zod";

export const deviceRouter = {
  byUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.device.findMany({
      where: eq(device.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createDeviceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.query.device
        .findMany({
          where: eq(device.userId, ctx.session.user.id),
        })
        .then((devices) => {
          if (devices.length > 64) {
            console.warn(
              `Warning: Approaching 164 device per user system limit for User ID: ${ctx.session.user.id}`,
            );
            if (devices.length > 164) {
              throw new TRPCError({
                code: "TOO_MANY_REQUESTS",
                message: `Error: User has way too many devices. User ID: ${ctx.session.user.id}.`,
              });
            }
          }

          return ctx.db
            .insert(device)
            .values({ ...input, userId: ctx.session.user.id });
        });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        pushToken: z.string(),
        timezone: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .update(device)
        .set({
          pushToken: input.pushToken,
          timezone: input.timezone,
        })
        .where(
          and(eq(device.id, input.id), eq(device.userId, ctx.session.user.id)),
        );
    }),
  byPushToken: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: pushToken }) => {
      return (
        ctx.db.query.device.findFirst({
          where: eq(device.pushToken, pushToken),
        }) || null
      );
    }),
  toggleNotifications: protectedProcedure
    .input(z.object({ id: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input: { id: deviceId, enabled } }) => {
      return ctx.db
        .update(device)
        .set({
          notificationsEnabled: enabled,
        })
        .where(
          and(eq(device.id, deviceId), eq(device.userId, ctx.session.user.id)),
        );
    }),
} satisfies TRPCRouterRecord;
