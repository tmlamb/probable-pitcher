import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@probable/db";
import { createDeviceSchema, device } from "@probable/db/schema";

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

          return ctx.db.insert(device).values(input);
        });
    }),
} satisfies TRPCRouterRecord;
