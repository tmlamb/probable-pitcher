import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { Accounts, AccountSkeleton } from "../_components/accounts";
import SignOut from "../_components/signout";

export default function Account() {
  prefetch(trpc.account.byUserId.queryOptions());

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Probable Pitcher
          </h1>
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <AccountSkeleton />
              </div>
            }
          >
            <Accounts />
            <SignOut />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
