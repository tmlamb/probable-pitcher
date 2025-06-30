"use client";

import { useRouter } from "next/navigation";

import { Button } from "@probable/ui/button";

import { authClient } from "~/auth/client";

export default function SignOut() {
  const router = useRouter();
  return (
    <form>
      <Button
        size="lg"
        formAction={() => {
          authClient
            .signOut({
              fetchOptions: { onSuccess: () => router.push("/signin") },
            })
            .catch(console.error);
        }}
      >
        Sign out
      </Button>
    </form>
  );
}
