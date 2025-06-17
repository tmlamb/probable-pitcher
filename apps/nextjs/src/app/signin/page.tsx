import { AuthOptions } from "../_components/auth-options";

export default function SignIn() {
  return (
    <main className="container mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-start space-y-4 px-3 py-8 sm:px-8">
      <h1 className="text-accent-foreground text-3xl font-extrabold leading-normal sm:text-3xl">
        Welcome to Probable Pitcher
      </h1>
      <div className="flex max-w-prose flex-col space-y-4 text-gray-800">
        <AuthOptions page="/" />
      </div>
    </main>
  );
}
