"use client";

import { useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { PitcherSubscription } from "@probable/ui";
import { cn, subscriptionSchedule } from "@probable/ui";

import { useScrollShadow } from "~/hooks/use-scroll-shadow";
import { useTRPC } from "~/trpc/react";

export function Subscriptions() {
  const trpc = useTRPC();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscription.byUserId.queryOptions(),
  );

  const scrollRef = useRef<HTMLDivElement>(null);
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
      className={cn("scroll-shadow-container flex-grow overflow-hidden", {
        "show-top-shadow": showTopShadow,
        "show-bottom-shadow": showBottomShadow,
      })}
    >
      <div
        ref={scrollRef}
        className="relative z-0 mr-1 flex h-full w-full flex-col gap-4 overflow-y-scroll p-3"
      >
        {schedule.map(({ nextGameDay, data }) => {
          return (
            <div
              key={nextGameDay}
              className="flex flex-col items-stretch first:mt-3"
            >
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
    <div className={cn("flex flex-row items-center gap-1.5", props.className)}>
      <p className="p-[.425rem]">{props.pitcher.name}</p>
      <div className="text-muted-foreground flex flex-col items-center text-xs">
        <p className="">{props.pitcher.number}</p>
        <p className="">{props.pitcher.team.abbreviation}</p>
      </div>
    </div>
  );
}

export function SubscriptionsSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="relative z-0 mr-1 flex w-full flex-grow flex-col gap-4 overflow-y-scroll px-3 py-3">
      <div className="mt-3 flex flex-col items-stretch">
        <h2
          className={cn(
            "bg-muted-foreground w-1/3 rounded text-left text-xs uppercase tracking-wider",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <div className="flex w-3/5 flex-col">
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-stretch">
        <h2
          className={cn(
            "bg-muted-foreground w-1/3 rounded text-left text-xs uppercase tracking-wider",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <div className="flex w-3/5 flex-col">
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
          <div className={cn("w-full p-[.425rem]", pulse && "animate-pulse")}>
            <p className="bg-foreground rounded">&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
