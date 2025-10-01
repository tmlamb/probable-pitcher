"use client";

import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { capitalizeFirstLetter } from "@probable/ui";
import { toast } from "@probable/ui/toast";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

export function Accounts() {
  const router = useRouter();
  const trpc = useTRPC();
  const deleteUser = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: () => {
        authClient
          .signOut()
          .then(() => {
            router.push("/");
          })
          .catch(console.error);
      },
      onError: (err) => {
        console.error("Failed to delete account", err);
        toast.error("Failed to delete account");
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
