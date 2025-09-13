import DownloadApp from "~/components/download-app/download-app";
import PitcherSearch from "~/components/pitcher-search";
import { prefetch, trpc } from "~/trpc/server";

export default function HomePage() {
  prefetch(trpc.subscription.byUserId.queryOptions());

  return (
    <div className="relative">
      <PitcherSearch />
      <DownloadApp />
    </div>
  );
}
