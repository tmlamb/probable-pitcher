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
                provider: "apple",
                callbackUrl: "/",
              },
            });
            redirect(res.url ?? "/");
          }}
        >
          Sign in with Apple
        </Button>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            const res = await auth.api.signInSocial({
              body: {
                provider: "google",
                callbackUrl: "/",
              },
            });
            let apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e222899a-2e4e-4413-aad6-15a87b69222e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
            apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e33332a5-d6d8-469d-aae6-22c1ff53333e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
            apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e44442e4-2962-4ed7-99ea-c64d248d444e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
            apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e555bfa9-4dbf-42da-8f8d-348a7364555e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
            apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e666cadc-f752-4646-ad6b-419be06f666e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
            apiKey = await auth.api.createApiKey({
              body: {
                rateLimitEnabled: false,
                userId: "e777a9b7-2b65-4a8d-b476-6eb5fda8777e", // the user id to create the API key for
              },
            });
            console.log("API KEY", apiKey);
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
