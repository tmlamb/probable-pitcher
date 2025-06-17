import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@probable/db";
import { account } from "@probable/db/schema";

import { protectedProcedure } from "../trpc";

export const accountRouter = {
  byUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.account.findMany({
      columns: {
        providerId: true,
      },
      where: eq(account.userId, ctx.session.user.id),
    });
  }),
} satisfies TRPCRouterRecord;
