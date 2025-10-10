import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const healthRouter = {
  check: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .execute(`SELECT 1`)
      .then(() => {
        return { status: "ok" };
      })
      .catch((e) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: e,
        });
      });
  }),
} satisfies TRPCRouterRecord;
