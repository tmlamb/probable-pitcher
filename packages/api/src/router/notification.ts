import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@probable/db";
import { notification } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  byDeviceId: protectedProcedure
    .input(z.string())
    .query(({ ctx, input: deviceId }) => {
      return ctx.db.query.notification.findMany({
        where: eq(notification.deviceId, deviceId),
      });
    }),
} satisfies TRPCRouterRecord;
