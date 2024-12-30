import { authRouter } from "./router/auth";
import { deviceRouter } from "./router/device";
import { notificationRouter } from "./router/notification";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  device: deviceRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
