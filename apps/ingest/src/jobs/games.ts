import { add, formatISO } from "date-fns";
import { getGames } from "../services/base-api.js";
import { processPitcher } from "./pitchers.js";
import { client } from "../db/client.js";

export async function ingestGames() {
  const today = new Date();
  const games = await Promise.all([
    getGames(formatISO(today, { representation: "date" })),
    getGames(formatISO(add(today, { days: 1 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 2 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 3 }), { representation: "date" })),
    getGames(formatISO(add(today, { days: 4 }), { representation: "date" })),
  ]);

  console.debug(
    `Found ${games.flat().length} games: ${JSON.stringify(games.flat())}`,
  );

  for (const game of games.flat()) {
    for (const team of [game.teams.away, game.teams.home]) {
      if (team.pitcher) {
        await processPitcher({
          name: team.pitcher.name,
          ref: team.pitcher.ref,
          number: team.pitcher.number,
          team: team.team.ref,
        });
      }
    }

    const {
      teams: { home, away },
      ref,
      date,
    } = game;

    const homePitcher = home.pitcher
      ? await client.pitcher.byRef(home.pitcher.ref)
      : null;
    const awayPitcher = away.pitcher
      ? await client.pitcher.byRef(away.pitcher.ref)
      : null;

    await client.game.upsert({
      ref,
      date: new Date(date),
      homePitcherId: homePitcher?.id ?? null,
      awayPitcherId: awayPitcher?.id ?? null,
    });
  }
}
