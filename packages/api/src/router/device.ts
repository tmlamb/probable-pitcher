import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, eq } from "@probable/db";
import {
  createDeviceSchema,
  device,
  selectDeviceSchema,
  updateDeviceSchema,
} from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const deviceRouter = {
  byUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.device.findMany({
      where: eq(device.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(createDeviceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(device).where(eq(device.pushToken, input.pushToken));

      const devices = await ctx.db.query.device.findMany({
        where: eq(device.userId, ctx.session.user.id),
      });

      if (devices.length > 64) {
        console.warn(
          `Approaching 164 device per user system limit for User ID: ${ctx.session.user.id}`,
        );
        if (devices.length > 164) {
          console.warn(
            `Reached 164 device per user system limit for User ID: ${ctx.session.user.id}`,
          );
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Error: User has way too many devices`,
          });
        }
      }

      return ctx.db
        .insert(device)
        .values({ ...input, userId: ctx.session.user.id });
    }),
  update: protectedProcedure
    .input(updateDeviceSchema)
    .mutation(async ({ ctx, input }) => {
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
    .input(selectDeviceSchema.shape.pushToken)
    .query(async ({ ctx, input: pushToken }) => {
      return ctx.db.query.device
        .findFirst({
          where: and(
            eq(device.pushToken, pushToken),
            eq(device.userId, ctx.session.user.id),
          ),
        })
        .then((result) => result ?? null);
    }),
  toggleNotifications: protectedProcedure
    .input(z.object({ id: updateDeviceSchema.shape.id, enabled: z.boolean() }))
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
