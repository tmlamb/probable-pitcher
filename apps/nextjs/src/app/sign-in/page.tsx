import { AuthOptions } from "~/components/auth-options";

export default function SignIn() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center space-y-6 bg-transparent px-3 py-8 sm:px-8">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-foreground flex flex-wrap items-center justify-center gap-x-1.5 text-xl leading-normal font-extrabold sm:flex-row sm:text-2xl">
          <span>Welcome to</span>
          <span className="text-primary text-2xl sm:text-3xl">
            Probable Pitcher
          </span>
        </h1>
        <p className="text-foreground text-center text-sm sm:text-base">
          Sign in with one of the options below to start
        </p>
      </div>
      <div className="flex max-w-prose flex-col space-y-4 text-gray-800">
        <AuthOptions page="/" />
      </div>
      <p className="text-muted text-center text-xs sm:text-sm">
        By continuing, you agree to our{" "}
        <a
          href="https://probablepitcher.com/terms"
          className="text-accent underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://probablepitcher.com/privacy"
          className="text-accent underline"
        >
          Privacy Policy
        </a>
      </p>
    </main>
  );
}
