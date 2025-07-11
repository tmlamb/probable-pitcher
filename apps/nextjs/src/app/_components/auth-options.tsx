import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@probable/auth";
import { Button } from "@probable/ui/button";

export function AuthOptions({ page }: { page: string }) {
  return (
    <form className="flex flex-col items-center justify-center gap-1 sm:gap-5">
      <Button
        size="none"
        variant="none"
        className="scale-75 hover:opacity-90 sm:scale-90"
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
          width={284}
          height={45}
          className="hidden flex-col justify-center dark:flex"
          src={"/images/apple_signin_white.png"}
          alt="Continue With Apple"
        ></Image>
        <Image
          width={284}
          height={45}
          className="flex flex-col justify-center dark:hidden"
          src={"/images/apple_signin_black.png"}
          alt="Continue With Apple"
        ></Image>
      </Button>
      <Button
        size="none"
        variant="none"
        className="scale-75 hover:opacity-90 sm:scale-90"
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
          width={284}
          height={60}
          className="hidden flex-col justify-center dark:flex"
          src={"/images/google_signin_neutral.png"}
          alt="Continue With Apple"
        ></Image>
        <Image
          width={284}
          height={60}
          className="flex flex-col justify-center dark:hidden"
          src={"/images/google_signin_black.png"}
          alt="Continue With Apple"
        ></Image>
      </Button>
    </form>
  );
}

// return (
//   <div className="flex flex-col items-center justify-center gap-4">
//     <p className="text-center text-2xl">
//       <span>Logged in as {session.user.email}</span>
//     </p>
//
//     <form>
//       <Button
//         size="lg"
//         formAction={async () => {
//           "use server";
//           await auth.api.signOut({ headers: await headers() });
//           // eslint-disable-next-line @typescript-eslint/only-throw-error
//           throw redirect("/");
//         }}
//       >
//         Sign out
//       </Button>
//     </form>
//   </div>
// );
