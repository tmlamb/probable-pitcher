"use client";

import { redirect } from "next/navigation";
import { createAuthClient } from "better-auth/react";

import { Button } from "@probable/ui/button";

export default function AppleClientSignin() {
  const authClient = createAuthClient();
  return (
    <Button
      size="lg"
      onClick={async () => {
        const res = await authClient.signIn.social({
          provider: "apple",
        });
        console.log("debug apple resp", res);
        console.log("debug apple resp string", JSON.stringify(res));
        redirect(res.data?.url ?? "/");
      }}
    >
      Sign in with Apple
    </Button>
  );
}
