import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { eq } from "@probable/db";
import { device, notification } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  byDeviceId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: deviceId }) => {
      const deviceRecord = await ctx.db.query.device.findFirst({
        where: eq(device.id, deviceId),
      });

      if (!deviceRecord || deviceRecord.userId !== ctx.session.user.id) {
        throw new Error("Device not found or access denied");
      }

      return ctx.db.query.notification.findMany({
        where: eq(notification.deviceId, deviceId),
      });
    }),
} satisfies TRPCRouterRecord;
