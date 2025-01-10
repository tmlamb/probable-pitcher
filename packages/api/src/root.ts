import { authRouter } from "./router/auth";
import { deviceRouter } from "./router/device";
import { notificationRouter } from "./router/notification";
import { pitcherRouter } from "./router/pitcher";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  device: deviceRouter,
  notification: notificationRouter,
  pitcher: pitcherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
