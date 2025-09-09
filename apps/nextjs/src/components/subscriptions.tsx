"use client";

import { useRef } from "react"; // 1. Import useRef
import { useSuspenseQuery } from "@tanstack/react-query";

import type { PitcherSubscription } from "@probable/ui";
import { cn, subscriptionSchedule } from "@probable/ui";

import { useScrollShadow } from "~/hooks/use-scroll-shadow";
import { useTRPC } from "~/trpc/react";

export function SubscriptionList() {
  const trpc = useTRPC();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscription.byUserId.queryOptions(),
  );

  // 3. Create a ref for the scrollable element
  const scrollRef = useRef<HTMLDivElement>(null);
  // 4. Use the hook to get the shadow visibility state
  const { showTopShadow, showBottomShadow } = useScrollShadow(scrollRef);

  if (subscriptions.length === 0) {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="inset-0 flex flex-col items-center justify-center">
          <p className="text-accent-foreground text-2xl font-bold">
            No subscriptions yet
          </p>
        </div>
      </div>
    );
  }

  const schedule = subscriptionSchedule(subscriptions);

  return (
    <div
      className={cn("scroll-shadow-container overflow-hidden", {
        "show-top-shadow": showTopShadow,
        "show-bottom-shadow": showBottomShadow,
      })}
    >
      <div
        ref={scrollRef}
        className="relative z-0 mr-1 flex h-full w-full flex-col gap-4 overflow-y-scroll px-3"
      >
        {schedule.map(({ nextGameDay, data }) => {
          return (
            <div key={nextGameDay} className="mt-3 flex flex-col items-stretch">
              <h2 className="text-muted-foreground text-left text-xs uppercase tracking-wider">
                {nextGameDay}
              </h2>
              <div className="flex flex-col">
                {data.map((subscription, index) => (
                  <PitcherCard
                    key={subscription.id}
                    pitcher={subscription}
                    className={cn(
                      index === 0 ? "rounded-t-lg" : "",
                      index === data.length - 1
                        ? "rounded-b-lg border-b-0"
                        : "",
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PitcherCard(props: {
  pitcher: PitcherSubscription;
  className: string;
}) {
  return (
    <div
      className={cn(
        "border-muted flex flex-row items-center gap-1.5",
        props.className,
      )}
    >
      <p className="p-[.425rem]">{props.pitcher.name}</p>
      <div className="text-muted-foreground flex flex-col items-center text-xs">
        <p className="">{props.pitcher.number}</p>
        <p className="">{props.pitcher.team.abbreviation}</p>
      </div>
    </div>
  );
}

export function SubscriptionSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "bg-primary w-1/4 rounded text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
