import { Suspense } from "react";
import Link from "next/link";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
  SubscriptionList,
  SubscriptionSkeleton,
} from "../../components/subscriptions";

export default function AppLayout(props: { children: React.ReactNode }) {
  prefetch(trpc.subscription.byUserId.queryOptions());
  return (
    <HydrateClient>
      <main className="bg-background flex h-screen flex-col px-0 py-3 sm:flex-row md:px-3">
        <div className="flex min-w-80 flex-col items-stretch justify-between gap-4 text-center">
          <div>
            <h1 className="text-primary text-2xl font-extrabold tracking-tight">
              <Link href="/" className="">
                Probable Pitcher
              </Link>
            </h1>
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <SubscriptionSkeleton />
                  <SubscriptionSkeleton />
                  <SubscriptionSkeleton />
                </div>
              }
            >
              <SubscriptionList />
            </Suspense>
          </div>
          <div>
            <Link href="/account" className="text-lg font-semibold">
              Account
            </Link>
          </div>
        </div>

        {/*<CreatePostForm />*/}
        <div className="bg-accent border-primary relative h-full w-full overflow-y-scroll rounded-none border border-l-0 border-r-0 sm:rounded-l-lg sm:border-l md:rounded-lg md:border-r">
          {props.children}
        </div>
      </main>
    </HydrateClient>
  );
}
