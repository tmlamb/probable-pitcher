import { Suspense } from "react";

import { Accounts } from "~/components/accounts";
import SignOut from "~/components/signout";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";

export default function Account() {
  prefetch(trpc.account.byUserId.queryOptions());

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 p-4">
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <p className="text-accent-foreground text-2xl font-bold">
                Loading...
              </p>
            </div>
          }
        >
          <Accounts />
          <SignOut />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
