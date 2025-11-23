import { accountRouter } from "./router/account";
import { deviceRouter } from "./router/device";
import { healthRouter } from "./router/health";
import { notificationRouter } from "./router/notification";
import { pitcherRouter } from "./router/pitcher";
import { subscriptionRouter } from "./router/subscription";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  account: accountRouter,
  device: deviceRouter,
  notification: notificationRouter,
  pitcher: pitcherRouter,
  subscription: subscriptionRouter,
  user: userRouter,
  health: healthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
