import { Suspense } from "react";

import { Accounts, AccountSkeleton } from "~/components/accounts";
import SignOut from "~/components/signout";
import { prefetch, trpc } from "~/trpc/server";

export default function Account() {
  prefetch(trpc.account.byUserId.queryOptions());

  return (
    <div className="p-4">
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
  );
}
