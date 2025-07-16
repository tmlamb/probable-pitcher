import PitcherSearch from "~/components/pitcher-search";
import { prefetch, trpc } from "~/trpc/server";

export default function HomePage() {
  //   const { data: accounts } = useSuspenseQuery(
  //   trpc.account.byUserId.queryOptions(),
  // );
  prefetch(trpc.subscription.byUserId.queryOptions());

  return <PitcherSearch />;
}
// <div className="flex flex-wrap items-center justify-center gap-4">
//   <div className="bg-background border-border text-foreground rounded-md px-4 py-2">
//     <p>Default</p>
//   </div>
//   <div className="bg-primary text-primary-foreground rounded-md px-4 py-2">
//     <p>Primary</p>
//   </div>
//   <div className="bg-secondary text-secondary-foreground rounded-md px-4 py-2">
//     <p>Secondary</p>
//   </div>
//   <div className="bg-accent text-accent-foreground rounded-md px-4 py-2">
//     <p>Accent</p>
//   </div>
//   <div className="bg-destructive text-destructive-foreground rounded-md px-4 py-2">
//     <p>Destructive</p>
//   </div>
//   <div className="bg-muted text-muted-foreground rounded-md px-4 py-2">
//     <p>Muted</p>
//   </div>
//   <div className="bg-card text-card-foreground rounded-md px-4 py-2">
//     <p>Card</p>
//   </div>
//   <div className="bg-popover text-popover-foreground rounded-md px-4 py-2">
//     <p>Popover</p>
//   </div>
//   <div className="text-foreground rounded-md bg-black px-4 py-2">
//     <p>Black</p>
//   </div>
//   <div className="text-foreground rounded-md bg-white px-4 py-2">
//     <p>White</p>
//   </div>
// </div>
