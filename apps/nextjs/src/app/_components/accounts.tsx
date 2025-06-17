"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { capitalizeFirstLetter, cn } from "@probable/ui";
import { toast } from "@probable/ui/toast";

import { useTRPC } from "~/trpc/react";

export function Accounts() {
  const trpc = useTRPC();
  const deleteUser = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: () => {
        // eslint-disable-next-line react-hooks/react-compiler
        window.location.href = "/";
      },
      onError: (err) => {
        console.error("Failed to delete account", err);
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to delete your account"
            : "Failed to delete account",
        );
      },
      onSettled: () => {
        window.location.href = "/";
      },
    }),
  );

  const { data: accounts } = useSuspenseQuery(
    trpc.account.byUserId.queryOptions(),
  );

  if (accounts.length === 0) {
    return <div className="flex w-full flex-col gap-4">Loading...</div>;
  }

  const providers = accounts
    .map(({ providerId }) => capitalizeFirstLetter(providerId))
    .join(", ");

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h2>Identity Providers:</h2>
        <p className="capitalize">{providers}</p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <p>
          Delete your account to remove all of your data from our service.
          Warning: All subscriptions will be lost and cannot be recovered.
        </p>
        <button
          className="border-2 border-red-500 px-2 text-red-500"
          onClick={() => deleteUser.mutate()}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export function AccountSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "bg-primary w-1/4 rounded text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
