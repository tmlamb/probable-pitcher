import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@probable/db";
import { user } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const userRouter = {
  delete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.delete(user).where(eq(user.id, ctx.session.user.id));
  }),
} satisfies TRPCRouterRecord;
