import type { Game, Pitcher, Subscription } from "@probable/db/schema";
import {
  add,
  format,
  formatDistanceToNowStrict,
  isFuture,
  isToday,
  isTomorrow,
  min,
} from "date-fns";
import _ from "lodash";

function nextGameDate(
  pitcher: Pitcher & {
    homeGames: Game[];
    awayGames: Game[];
  },
): Date | undefined {
  const futureGames = [...pitcher.homeGames, ...pitcher.awayGames]
    .filter(({ date }) => isFuture(add(date, { hours: 3 })))
    .map(({ date }) => date);
  if (futureGames.length) {
    return min(futureGames);
  }
}

export type PitcherSubscription = Pitcher & {
  team: { abbreviation: string | null };
  homeGames?: Game[];
  awayGames?: Game[];
  nextGameDate?: Date;
  subscription?: Subscription;
};

export const subscriptionSchedule = (
  subscriptions:
    | (Subscription & {
        pitcher: Pitcher & {
          team: { abbreviation: string | null };
          homeGames: Game[];
          awayGames: Game[];
        };
      })[]
    | undefined,
): {
  nextGameDay: string;
  data: PitcherSubscription[];
}[] => {
  return _(subscriptions)
    .map((s) => ({
      ...s.pitcher,
      nextGameDate: nextGameDate(s.pitcher),
      subscription: {
        id: s.id,
        userId: s.userId,
        pitcherId: s.pitcherId,
      },
    }))
    .orderBy((p) => p.nextGameDate)
    .groupBy((p) => {
      const date = p.nextGameDate;
      if (date) {
        const dateForSection = format(date, "EEE, MMM d");
        if (isToday(date)) {
          return `Today (${dateForSection})`;
        } else if (isTomorrow(date)) {
          return `Tomorrow (${dateForSection})`;
        } else {
          return `In ${formatDistanceToNowStrict(date)} (${dateForSection})`;
        }
      } else {
        return "Unscheduled";
      }
    })
    .map((data, nextGameDay) => ({ nextGameDay, data }))
    .value();
};

export const faqs = [
  {
    question: "How does the Probable Pitcher service work?",
    answer:
      "Probable Pitcher is a service that sends you a notification on the days your favorite pitchers are scheduled to start.",
  },
  {
    question: "What types of notifications will I receive?",
    answer:
      "You will receive one notification on the morning of days where one or more pitchers you are subscribed to are scheduled to start. You may receive additional notifications throughout the day if there are late lineup changes for a pitcher you are subscribed to.",
  },
  {
    question: "Why am I not receiving notifications?",
    answer:
      "Check your application settings and confirm notifications are enabled. Our service makes a best effort to send you notifications, but we cannot guarantee that you will receive them.",
  },
  {
    question: "How do I stop receiving notifications?",
    answer:
      "You can remove pitchers you no longer wish to recieve notifications for using the Edit button on the homepage. You can also disable all notifications in the application settings.",
  },
];

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
