import { Suspense } from "react";

import { HydrateClient } from "~/trpc/server";
import { AuthShowcase } from "./_components/auth-showcase";
import {
  //CreatePostForm,
  NotificationSkeleton,
  NotificationList,
} from "./_components/subscriptions";

export default function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below
  // void api.notification.byDeviceId.prefetch(
  //   "d11186c4-4d5c-4a4e-95c7-fd4c382c111d",
  // );

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Probable Pitcher
          </h1>
          <AuthShowcase />

          {/*<CreatePostForm />*/}
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </div>
              }
            >
              <NotificationList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
