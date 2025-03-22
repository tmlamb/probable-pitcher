import { deviceRouter } from "./router/device";
import { notificationRouter } from "./router/notification";
import { pitcherRouter } from "./router/pitcher";
import { subscriptionRouter } from "./router/subscription";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  device: deviceRouter,
  notification: notificationRouter,
  pitcher: pitcherRouter,
  subscription: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
