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
        <div className="flex flex-col items-stretch justify-between gap-2 overflow-hidden px-3 text-center sm:min-w-80">
          <div className="flex h-full flex-col">
            <h1 className="text-primary pb-3 text-2xl font-extrabold tracking-tight">
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
              className="pt-3 backdrop-blur-lg"
            >
              <Link href="/account" className="text-lg font-semibold">
                Account
              </Link>
            </Button>
          </div>
        </div>

        {/*<CreatePostForm />*/}
        <div className="bg-accent border-primary relative mr-0 h-full w-full rounded-none border border-l-0 border-r-0 sm:overflow-y-scroll sm:rounded-l-lg sm:border-l md:mr-3 md:rounded-lg md:border-r">
          {props.children}
        </div>
      </main>
    </HydrateClient>
  );
}
