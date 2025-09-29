import { HydrateClient } from "~/trpc/server";

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <HydrateClient>
      <main className="bg-background flex flex-col gap-3 py-3 sm:h-screen sm:flex-row sm:gap-0 sm:overflow-hidden">
        {props.children}
      </main>
    </HydrateClient>
  );
}
