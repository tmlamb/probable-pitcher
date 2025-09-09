import PitcherSearch from "~/components/pitcher-search";
import { prefetch, trpc } from "~/trpc/server";

export default function HomePage() {
  prefetch(trpc.subscription.byUserId.queryOptions());

  return (
    <div className="relative">
      <PitcherSearch />
      {/* <div className="text-muted-foreground absolute bottom-2 left-2 z-0 text-xs"></div> */}
    </div>
  );
}
