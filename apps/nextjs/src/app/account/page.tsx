import { Suspense } from "react";

import { getSession } from "@probable/auth";

import { HydrateClient } from "~/trpc/server";
import { Accounts, AccountSkeleton } from "../_components/accounts";
import { AuthShowcase } from "../_components/auth-showcase";

export default async function Account() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Probable Pitcher
          </h1>
          <AuthShowcase page="/account" />
          {session && (
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <AccountSkeleton />
                </div>
              }
            >
              <Accounts />
            </Suspense>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
