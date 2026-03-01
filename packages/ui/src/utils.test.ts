import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Game, Pitcher, Subscription } from "@probable/db/schema";

import { subscriptionSchedule } from "./utils";

// Freeze time to 2022-08-14 13:00 UTC (matches the ingest test date context)
// In America/New_York this is 9:00 AM on Sunday, Aug 14
const FAKE_NOW = new Date("2022-08-14T13:00:00.000Z");

type SubscriptionInput = Subscription & {
  pitcher: Pitcher & {
    team: { abbreviation: string | null };
    homeGames: Game[];
    awayGames: Game[];
  };
};

function makeGame(overrides: Partial<Game> & { date: Date }): Game {
  return {
    id: crypto.randomUUID(),
    homePitcherId: null,
    awayPitcherId: null,
    ...overrides,
  };
}

function makePitcher(
  overrides: Partial<Pitcher> & { name: string },
): Pitcher & { team: { abbreviation: string | null } } {
  return {
    id: crypto.randomUUID(),
    teamId: "team-1",
    number: "1",
    active: true,
    gone: false,
    team: { abbreviation: "TST" },
    ...overrides,
  };
}

function makeSubscription(
  pitcher: Pitcher & {
    team: { abbreviation: string | null };
    homeGames?: Game[];
    awayGames?: Game[];
  },
): SubscriptionInput {
  return {
    id: crypto.randomUUID(),
    userId: "user-1",
    pitcherId: pitcher.id,
    pitcher: {
      ...pitcher,
      homeGames: pitcher.homeGames ?? [],
      awayGames: pitcher.awayGames ?? [],
    },
  };
}

describe("subscriptionSchedule", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FAKE_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty array for undefined input", () => {
    expect(subscriptionSchedule(undefined)).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(subscriptionSchedule([])).toEqual([]);
  });

  it("sorts groups in correct order: scheduled by date, then unscheduled, inactive, gone", () => {
    // Today: Aug 14 at 7pm UTC
    const gameToday = makeGame({
      date: new Date("2022-08-14T19:00:00.000Z"),
    });
    // Tomorrow: Aug 15 at 7pm UTC
    const gameTomorrow = makeGame({
      date: new Date("2022-08-15T19:00:00.000Z"),
    });
    // In 3 days: Aug 17 at 7pm UTC
    const gameIn3Days = makeGame({
      date: new Date("2022-08-17T19:00:00.000Z"),
    });

    const pitcherToday = makePitcher({ name: "Alice Today" });
    const pitcherTomorrow = makePitcher({ name: "Bob Tomorrow" });
    const pitcherIn3Days = makePitcher({ name: "Charlie Future" });
    const pitcherUnscheduled = makePitcher({ name: "Dave Unscheduled" });
    const pitcherInactive = makePitcher({
      name: "Eve Inactive",
      active: false,
    });
    const pitcherGone = makePitcher({ name: "Frank Gone", gone: true });

    const subscriptions: SubscriptionInput[] = [
      // Deliberately pass in shuffled order to verify sorting
      makeSubscription({ ...pitcherGone, homeGames: [], awayGames: [] }),
      makeSubscription({
        ...pitcherIn3Days,
        homeGames: [gameIn3Days],
        awayGames: [],
      }),
      makeSubscription({
        ...pitcherUnscheduled,
        homeGames: [],
        awayGames: [],
      }),
      makeSubscription({
        ...pitcherToday,
        homeGames: [gameToday],
        awayGames: [],
      }),
      makeSubscription({
        ...pitcherInactive,
        homeGames: [],
        awayGames: [],
      }),
      makeSubscription({
        ...pitcherTomorrow,
        homeGames: [],
        awayGames: [gameTomorrow],
      }),
    ];

    const result = subscriptionSchedule(subscriptions);

    const groupNames = result.map((g) => g.nextGameDay);

    expect(groupNames).toEqual([
      "Today (Sun, Aug 14)",
      "Tomorrow (Mon, Aug 15)",
      "In 3 days (Wed, Aug 17)",
      "Unscheduled",
      "Inactive",
      "Show's Over",
    ]);
  });

  it("sorts pitchers alphabetically by name within the same date group", () => {
    const game = makeGame({
      date: new Date("2022-08-14T19:00:00.000Z"),
    });

    const pitcherC = makePitcher({ name: "Charlie" });
    const pitcherA = makePitcher({ name: "Alice" });
    const pitcherB = makePitcher({ name: "Bob" });

    const subscriptions: SubscriptionInput[] = [
      makeSubscription({ ...pitcherC, homeGames: [game], awayGames: [] }),
      makeSubscription({ ...pitcherA, homeGames: [game], awayGames: [] }),
      makeSubscription({ ...pitcherB, homeGames: [game], awayGames: [] }),
    ];

    const result = subscriptionSchedule(subscriptions);

    expect(result).toHaveLength(1);
    expect(result.at(0)?.data.map((p) => p.name)).toEqual([
      "Alice",
      "Bob",
      "Charlie",
    ]);
  });

  it("places pitcher with soonest game first when multiple dates exist", () => {
    const gameSoon = makeGame({
      date: new Date("2022-08-14T15:00:00.000Z"),
    });
    const gameLater = makeGame({
      date: new Date("2022-08-16T19:00:00.000Z"),
    });

    const pitcherSoon = makePitcher({ name: "Soon Pitcher" });
    const pitcherLater = makePitcher({ name: "Later Pitcher" });

    const subscriptions: SubscriptionInput[] = [
      makeSubscription({
        ...pitcherLater,
        homeGames: [gameLater],
        awayGames: [],
      }),
      makeSubscription({
        ...pitcherSoon,
        homeGames: [gameSoon],
        awayGames: [],
      }),
    ];

    const result = subscriptionSchedule(subscriptions);

    expect(result).toHaveLength(2);
    expect(result.at(0)?.data.at(0)?.name).toBe("Soon Pitcher");
    expect(result.at(1)?.data.at(0)?.name).toBe("Later Pitcher");
  });

  it("uses soonest future game when pitcher has multiple games", () => {
    const gamePast = makeGame({
      date: new Date("2022-08-10T19:00:00.000Z"),
    });
    const gameFuture1 = makeGame({
      date: new Date("2022-08-16T19:00:00.000Z"),
    });
    const gameFuture2 = makeGame({
      date: new Date("2022-08-15T19:00:00.000Z"),
    });

    const pitcher = makePitcher({ name: "Multi-Game Pitcher" });

    const subscriptions: SubscriptionInput[] = [
      makeSubscription({
        ...pitcher,
        homeGames: [gamePast, gameFuture1],
        awayGames: [gameFuture2],
      }),
    ];

    const result = subscriptionSchedule(subscriptions);

    // Should pick Aug 15 (tomorrow) as next game, not Aug 16
    expect(result).toHaveLength(1);
    expect(result.at(0)?.nextGameDay).toBe("Tomorrow (Mon, Aug 15)");
  });

  it("groups multiple inactive pitchers together", () => {
    const inactive1 = makePitcher({ name: "Zed Inactive", active: false });
    const inactive2 = makePitcher({ name: "Amy Inactive", active: false });

    const subscriptions: SubscriptionInput[] = [
      makeSubscription({ ...inactive1, homeGames: [], awayGames: [] }),
      makeSubscription({ ...inactive2, homeGames: [], awayGames: [] }),
    ];

    const result = subscriptionSchedule(subscriptions);

    expect(result).toHaveLength(1);
    expect(result.at(0)?.nextGameDay).toBe("Inactive");
    expect(result.at(0)?.data.map((p) => p.name)).toEqual([
      "Amy Inactive",
      "Zed Inactive",
    ]);
  });

  it("groups multiple gone pitchers together", () => {
    const gone1 = makePitcher({ name: "Zane Gone", gone: true });
    const gone2 = makePitcher({ name: "Abby Gone", gone: true });

    const subscriptions: SubscriptionInput[] = [
      makeSubscription({ ...gone1, homeGames: [], awayGames: [] }),
      makeSubscription({ ...gone2, homeGames: [], awayGames: [] }),
    ];

    const result = subscriptionSchedule(subscriptions);

    expect(result).toHaveLength(1);
    expect(result.at(0)?.nextGameDay).toBe("Show's Over");
    expect(result.at(0)?.data.map((p) => p.name)).toEqual([
      "Abby Gone",
      "Zane Gone",
    ]);
  });
});
