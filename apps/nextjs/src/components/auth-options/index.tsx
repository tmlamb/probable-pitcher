import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@probable/auth";
import { Button } from "@probable/ui/button";

import AppleSignInBlack from "./apple_signin_black.png";
import AppleSignInWhite from "./apple_signin_white.png";
import GoogleSignInBlack from "./google_signin_black.png";
import GoogleSignInNeutral from "./google_signin_neutral.png";

export function AuthOptions({ page }: { page: string }) {
  return (
    <form className="flex flex-col items-center justify-center gap-1 sm:gap-5">
      <Button
        size="none"
        variant="none"
        className="scale-75 hover:opacity-90 sm:scale-75"
        formAction={async () => {
          "use server";
          const res = await auth.api.signInSocial({
            body: {
              provider: "apple",
              callbackURL: page,
            },
          });
          redirect(res.url ?? "/");
        }}
      >
        <Image
          className="hidden flex-col justify-center dark:flex"
          src={AppleSignInWhite}
          alt="Continue With Apple"
          placeholder="blur"
        ></Image>
        <Image
          className="flex flex-col justify-center dark:hidden"
          src={AppleSignInBlack}
          alt="Continue With Apple"
          placeholder="blur"
        ></Image>
      </Button>
      <Button
        size="none"
        variant="none"
        className="scale-75 hover:opacity-90 sm:scale-75"
        formAction={async () => {
          "use server";
          const res = await auth.api.signInSocial({
            body: {
              provider: "google",
              callbackURL: page,
            },
          });
          redirect(res.url ?? "/");
        }}
      >
        <Image
          className="hidden flex-col justify-center dark:flex"
          src={GoogleSignInNeutral}
          alt="Continue With Google"
          placeholder="blur"
        ></Image>
        <Image
          className="flex flex-col justify-center dark:hidden"
          src={GoogleSignInBlack}
          alt="Continue With Google"
          placeholder="blur"
        ></Image>
      </Button>
    </form>
  );
}
