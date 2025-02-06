import { auth, getSession } from "@probable/auth";
import { Button } from "@probable/ui/button";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "google",
              },
            });
            redirect(res.url ?? "/");
          }}
        >
          Sign in with Google
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.email}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({ headers: headers() });
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
