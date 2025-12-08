import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@probable/ui/button";

import DownloadDialog from "~/components/download-dialog";
import PitcherSearch from "~/components/pitcher-search";
import {
  Subscriptions,
  SubscriptionsSkeleton,
} from "~/components/subscriptions";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function HomePage() {
  prefetch(trpc.subscription.byUserId.queryOptions());
  prefetch(trpc.account.byUserId.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col items-stretch justify-between gap-2 overflow-hidden text-center sm:min-w-80">
        <div className="mx-1.5 flex h-full flex-col">
          <h1 className="text-primary border-b-border border-b pb-3 text-2xl font-extrabold tracking-normal">
            <Link href="/" className="">
              Probable Pitcher
            </Link>
          </h1>
          <Suspense fallback={<SubscriptionsSkeleton />}>
            <Subscriptions />
          </Suspense>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mx-1.5 my-2 p-3 text-lg font-semibold"
          >
            <Link href="/account" className="hover:no-underline">
              Account
            </Link>
          </Button>
          <Button asChild>
            <DownloadDialog />
          </Button>
        </div>
      </div>

      <div className="bg-card border-border relative mr-0 h-full w-full overflow-x-hidden overflow-y-hidden rounded-none border border-r-0 border-l-0 sm:rounded-l-lg sm:border-l md:mr-3 md:rounded-lg md:border-r">
        <Suspense>
          <PitcherSearch />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
