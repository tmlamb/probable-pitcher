import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@probable/ui/button";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import {
  SubscriptionList,
  SubscriptionSkeleton,
} from "../../components/subscriptions";

export default function AppLayout(props: { children: React.ReactNode }) {
  prefetch(trpc.subscription.byUserId.queryOptions());
  return (
    <HydrateClient>
      <main className="bg-background flex flex-col gap-3 py-3 sm:h-screen sm:flex-row sm:gap-0 sm:overflow-hidden">
        <div className="flex flex-col items-stretch justify-between gap-2 overflow-hidden text-center sm:min-w-80">
          <div className="mx-1.5 flex h-full flex-col">
            <h1 className="text-primary border-b-accent border-b pb-3 text-2xl font-extrabold tracking-normal">
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
            <Button
              asChild
              variant="link"
              size="lg"
              className="m-0.5 p-3 text-lg font-semibold"
            >
              <Link href="/account" className="hover:no-underline">
                Account
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-accent border-primary relative mr-0 h-full w-full overflow-x-hidden rounded-none border border-l-0 border-r-0 sm:overflow-y-scroll sm:rounded-l-lg sm:border-l md:mr-3 md:rounded-lg md:border-r">
          {props.children}
        </div>
      </main>
    </HydrateClient>
  );
}
