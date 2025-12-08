"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@probable/ui";
import { Button, buttonVariants } from "@probable/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@probable/ui/dialog";
import { toast } from "@probable/ui/toast";
import { capitalizeFirstLetter } from "@probable/ui/utils";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";
import SignOut from "./signout";

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

  const providers = accounts
    .map(({ providerId }) => capitalizeFirstLetter(providerId))
    .join(", ");

  const session = authClient.useSession();

  const email = session.data?.user.email;

  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Button asChild variant="ghost" size="lg" className="px-4 sm:px-8">
        <Link href="../">Back to Subscriptions</Link>
      </Button>
      <div className="flex flex-col items-stretch gap-1">
        <div className="bg-card flex flex-col items-stretch gap-6 rounded-md p-4 sm:p-8">
          <div className="flex flex-row items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold">Email</h2>
            <p className="text-muted font-semibold">{email}</p>
          </div>
          <div className="flex flex-row items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold">Identity Providers</h2>
            <p className="text-muted font-semibold capitalize">{providers}</p>
          </div>
          <SignOut />
        </div>
        <p className="text-muted px-3 text-sm">
          This account is linked with the above identity providers. You can use
          any of them when signing in to the account.
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-1">
        <div className="bg-card flex flex-col items-start gap-6 rounded-md p-4 sm:p-8">
          <h2 className="text-lg font-bold">Danger Zone</h2>
          <Button asChild>
            <Dialog modal={true}>
              <DialogTrigger
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                    size: "lg",
                  }),
                )}
              >
                Delete Account
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="flex flex-row justify-between gap-4">
                    <Button
                      variant="destructive"
                      size="lg"
                      formAction={() => {
                        deleteUser.mutate();
                      }}
                    >
                      Delete Account
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <DialogClose>Cancel</DialogClose>
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Button>
        </div>
        <p className="text-muted px-3 text-sm">
          Delete your account to remove all of your data from our service.
          Warning: All subscriptions will be lost and cannot be recovered.
        </p>
      </div>
    </div>
  );
}
